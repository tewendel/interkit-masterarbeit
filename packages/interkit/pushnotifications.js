import { InterkitClient } from './'
import { get } from "svelte/store"

import { Plugins } from '@capacitor/core'

const { PushNotifications } = Plugins;

/**
 * Consider heartbeats for push notification eligibility?
 * If true: current implementation might have performance problems,
 * since every hearbeat causes a user collection onChange.
 * If false: every device receives a push notification. Where the app
 * is still active/visible, the OS does not display a notification,
 * instead, the app can react in a handler (e.g. route to a tab or
 * trigger a poll, update the "new message small red badge counters").
 * See pushNotificationReceived handler.
 * This flag must be (kept manually) in sync with its counterpart in
 * meteor-server/imports/pushnotifications.js !!!
 * @default
 */
const enableHeartbeat = false
const heartbeatDelay = 10000 // milliseconds

const addListeners = async () => {
  await PushNotifications.addListener('registration', token => {
    console.info('Registration token', token);
    InterkitClient.pushnotificationRegistrationToken.set(token.value)
  });

  await PushNotifications.addListener('registrationError', err => {
    // TODO do something
    console.error('Registration error: ', err.error);
  });

  await PushNotifications.addListener('pushNotificationReceived', notification => {
    // if tab is visible & still does receive a push notification,
    // we "handle" it hereby & it "disappears"
    // TODO could be used to focus a "chat tab"
    console.log('Push notification received: ', notification);
    // alert('got push:' + JSON.stringify(notification))
  });

  await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
    // after the OS receives & displays the notification & users taps it,
    // we can handle the event here.
    // it sends OS/FCM stuff about the notification, like
    // (on Android) actionId: tap, very long IDs, google.delivered_priority and
    // collapse_key (which holds the bundle id, like 'interkit.app.cs3')
    // alert('push action performed:' + JSON.stringify(notification))
    // TODO could be used to focus a "chat tab"?
    console.log('Push notification action performed', notification.actionId, notification.inputValue);
  });
}

const registerNotifications = async () => {
  // docs seemed out of date, the surrounding code used to be necessary? TODO recheck
  // let permStatus = await PushNotifications.checkPermissions();
  // if (permStatus.receive === 'prompt') {
  let permStatus = await PushNotifications.requestPermission();
  // }
  console.info('pushNotifications requestPermission returned', permStatus)

  if (permStatus.granted !== true) {
    throw new Error('User denied permissions!');
  }

  await PushNotifications.register();
}

const getDeliveredNotifications = async () => {
  const notificationList = await PushNotifications.getDeliveredNotifications();
  console.log('delivered notifications', notificationList);
  // TODO do something with them? maybe just throw them out, since app is being opened
}

const heartbeat = () => {
  const isTabHidden = document.visibilityState === 'hidden' ||
    document.webkitVisibilityState === 'hidden' ||
    document.hidden === true
  // console.log('<3', !isTabHidden)
  InterkitClient.userHeartbeat(!isTabHidden)
}

const startHeartbeat = () => {
  if (!enableHeartbeat) {
    console.log('heartbeat disabled')
    return
  }
  console.log('startHeartbeat')
  heartbeat()
  window.setInterval(heartbeat, heartbeatDelay)
  document.addEventListener('visibilitychange', heartbeat)
}

export {
  registerNotifications,
  addListeners,
  getDeliveredNotifications,
  enableHeartbeat,
  startHeartbeat
}
