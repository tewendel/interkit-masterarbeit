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
 * 2. if these sheet does not exist, we check if a JSON file is present
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
 * How long ago must a heartbeat be so we consider the recipient
 * eligible for a push notification?
 * should be larger than the heartbeat delay defined in
 * packages/interkit/pushnotifications.js
 * the closer, the less fals positives we get...
 * @default
 */
const heartbeatOldMinAge = 2 * 60 // seconds

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
  try {
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
  } catch (error) {
    console.error('init error', error)
  }
}

export {
  init,
  heartbeatOldMinAge 
}
