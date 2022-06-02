/**
 * Push notifications within the Interkit Meteor server.
 *
 * Uses Firebase and the Firebase Admin SDK.
 * Note that these docs, esp. the official FCM guides & tutorials for NodeJS
 * seem out of date (at the time of writing), even only the basic import stuff.
 *
 * This module needs credentials from Firebase (a JSON file obtained when adding
 * an app via Firebase console). You can provide it
 * 1. via Database Sheet: in a sheet named `config`, with columns "key" and "value",
 *    create a row with a special key `configFCMKey`, paste the JSON in value.
 *    see {@link module:meteor-server/pushnotifications~getFCMserviceAccountFromDB getFCMserviceAccountFromDB}  
 *    Note: the sheet + special key can be changed, see constants.
 * 2. if this sheet does not exist, we check if a JSON file is present
 *    see {@link module:meteor-server/pushnotifications~getFCMserviceAccountFromFS getFCMserviceAccountFromFS}
 *     1. in a path provided by .env var FCM_CREDENTIALS_PATH,
 *        file name ${projectId}_firebase-admin.json,
 *        if not there, then we try
 *     2. in the project folder (found via .env REPOSITORIES_PATH),
 *        file name firebase-admin.json.
 *
 * @see {@link https://firebase.google.com/docs/admin/setup|Firebase Admin SDK online docs}
 * @module meteor-server/pushnotifications
 */

import admin from 'firebase-admin'
import fs from 'fs'
import { Sheets, Rows } from './collections.js';

/**
 * Idea behind is to have multiple "instances" of firebase in case meteor
 * handles multiple projects with different credentials. 
 * "pusher" run in their own closures. not sure if this even works.
 * @rotected
 */
// TODO check if this idea is any good
const pushers = {}

/**
 * Consider heartbeats for push notification eligibility?
 * If true: current implementation might have performance problems,
 * since every hearbeat causes a user collection onChange.
 * If false: every device receives a push notification. Where the app
 * is still active/visible, the OS does not display a notification,
 * instead, the app can react in a handler (e.g. route to a tab or
 * trigger a poll, update the "new message small red badge counters").
 * See packages/interkit/pushnotifications.js:pushNotificationReceived
 * This flag must be (kept manually) in sync with its counterpart in
 * packages/interkit/pushnotifications.js !!!
 * @default
 */
const enableHeartbeat = false

/**
 * How long ago must a heartbeat be so we consider the recipient
 * eligible for a push notification?
 * should be larger than the heartbeat delay defined in
 * packages/interkit/pushnotifications.js
 * the closer, the less fals positives we get...
 * @default
 */
const heartbeatOldMinAge = 2 * 60 * 1000 // milliseconds

/**
 * Name of the sheet where we store credentials for FCM
 * @default 
 */
const configSheetName = 'config'

/**
 * Key of the variable within the config sheet that holds the FCM JSON
 * @default
 */
const configFCMKey = 'firebaseAdminCredentials'

/**
 * If a message has no text, send this as the notification body
 * @default
 */
const fallbackNotificationBody = '\u2709' // ENVELOPE

/**
 * Retrieve FCM credentials from the Database
 * @param {string} projectId
 */
const getFCMserviceAccountFromDB = (projectId) => {
  const configSheet = Sheets.findOne({ projectId, name: configSheetName })
  if (!configSheet) {
    console.log(`config sheet '${configSheetName}' not found`)
    return
  }
  const keyColumn = configSheet.columns.find(col => col.name === 'key')
  const valColumn = configSheet.columns.find(col => col.name === 'value')
  if (!keyColumn || !valColumn) throw new Error(`config sheet malformed? expecting columns named 'key' and 'value', got`, configSheet.columns)
  const fcmRow = Rows.findOne({
    projectId,
    sheetKey: configSheet.key, 
    $where: function () {
      return this.values[keyColumn.key] === configFCMKey
    }
  })
  const ret = fcmRow?.values?.[valColumn.key]
  console.log(`looking for row with key='${configFCMKey}', found`, typeof ret === 'string' ? ret.substr(0, 10) + '…' : ret)
  return ret
}

/**
 * Retrieve FCM credentials from the file system
 * @param {string} projectId
 */
const getFCMserviceAccountFromFS = (projectId) => {
  const path = process.env.FCM_CREDENTIALS_PATH
    ? `${process.env.FCM_CREDENTIALS_PATH}/${projectId}_firebase-admin.json`
    : `${process.env.REPOSITORIES_PATH}/projects/${projectId}/firebase-admin.json`
  try {
    console.log(`trying to read FCM credentials at ${path}...`)
    return fs.readFileSync(path)?.toString()
  } catch (error) {
    console.error('error reading serviceAccount at ', path, error)
    return
  }
}

/**
 * Retrieve FCM credentials, try Database, then file system
 * @param {string} projectId
 */
const getFCMserviceAccount = (projectId) => {
  // DB has precedence over FS
  const accountStr = getFCMserviceAccountFromDB(projectId) || getFCMserviceAccountFromFS(projectId)
  if (!accountStr || typeof accountStr !== 'string') {
    console.error('error reading account', accountStr)
    return
  }
  try {
    const account = JSON.parse(accountStr)
    console.log('account looks OK, excerpt .client_email', account.client_email)
    return account
  } catch (e) {
    console.error('error parsing account', e)
  }
}

/**
 * Set up "notification pushing" for a project
 * @param {string} projectId
 */
const init = (projectId) => {
  if (projectId in pushers) return pushers[projectId]
  const pusher = (() => {
    const serviceAccount = getFCMserviceAccount(projectId)
    if (!serviceAccount) throw new Error('no firebase credentials')
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    // TODO not sure if this will be closure-scoped.
    // maybe initializeApp returns an app, that messaging() can take as argument?
    return admin.messaging()
  })()
  pushers[projectId] = pusher
  return pusher
}

/**
 * Send push notifications
 * @param {string} projectId
 * @param {Meteor} Meteor
 * @param {Array} recipients ids
 * @param {Object} payload
 */
const send = ({ projectId, Meteor, recipients, payload }) => {
  let messaging
  // note: Meteor needs a Date object, not a number
  const heartbeatOld = new Date(new Date() - heartbeatOldMinAge)
  const recipientsEligibleForPush = Meteor.users.find({
    _id: { $in: recipients },
    [`projectUserData.${projectId}.pushnotificationRegistrationToken`]: {
      $not: { $in: [undefined, '', '(web)'] }
    },
    ...(enableHeartbeat
      ? {
        // ...with heartbeats older than...
        [`projectUserData.${projectId}.lastHeartbeat`]: {
          $lt: heartbeatOld
        },
      }
      : {}
    )
  })
  const recipientsRegistrationTokens = recipientsEligibleForPush.map(user =>
    user.projectUserData?.[projectId]?.pushnotificationRegistrationToken
  ).filter(token => !!token)
  if (recipientsEligibleForPush.count() === 0) {
    console.log('no eligible recipients, not sending push notifications')
  } else if (recipientsRegistrationTokens.length === 0) {
    console.warn('eligible recipients, but no tokens, not sending push notifications', { recipientsEligibleForPush })
  } else {
    console.log('recipientsEligibleForPush', recipientsEligibleForPush.count())
    console.log('recipientsRegistrationTokens', recipientsRegistrationTokens)
    try {
      messaging = init(projectId)
      // console.log('FCM messaging OK', messaging)
    } catch (err) {
      console.error('error setting up push notifications, bailing')
      return false
    }
    try {
      messaging.sendMulticast({ // solo would be .send()
        notification: {
          // TODO
          // title: `Notification from ${projectId}`,
          body: payload.text || fallbackNotificationBody
        },
        data: {
          // foo: 'bar',
        },
        // solo would be token: string
        tokens: recipientsRegistrationTokens
      })
        .then((response) => {
          console.log(`message.send sent push ${response.successCount} successes`)
          if (response.failureCount > 0) {
            const failedTokens = []
            response.responses.forEach((resp, idx) => {
              if (!resp.success) {
                failedTokens.push(recipientsRegistrationTokens[idx])
              }
            })
            // TODO do something with failedTokens
            console.error(`${response.failureCount} tokens failed: `, failedTokens)
          }
        })
        // this catch might be not working, due to bad implementation?
        // hence we double-wrap the whole thing in try-catch...
        .catch((error) => { console.log('message.send push error', error) })
    } catch (error) {
      console.error('message.send push error', error)
    }
  }
}

export {
  send,
  heartbeatOldMinAge
}
