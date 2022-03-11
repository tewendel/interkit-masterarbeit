// note that firebase docs, esp. the official FCM guides & tutorials for NodeJS
// seem out of date (at the time of writing), even only the basic import stuff.
import admin from 'firebase-admin'
// TODO this must *not* be compiled it, but provided on per-project basis
// (at least not in meteor scope)
import firebaseAdminCredentials from '../firebase-admin-credentials.js'

// TODO idea behind is to have multiple "instances" of firebase in case meteor
// handles multiple projects with different credentials. 
// "pusher" run in their own closures. not sure if this even works.
const pushers = {}

// var serviceAccount = require("./interkit-chat-test-firebase-adminsdk-dhj4y-13a84a76ae.json");

const init = (projectId) => {
  if (projectId in pushers) return pushers[projectId]
  try {
    const pusher = (() => {
      /* idea how to realize a "dynamic import" for per-project credential JSONs
      let serviceAccount
      // turns out, meteor runs somewhere deep in cached folders, so likely no fs.
      console.log('pusher realpath', fs.realpathSync('.'))
      const path = `../${projectId}_firebase-admin.json`
      try {
        serviceAccount = JSON.parse(fs.readFileSync(path))
      } catch (error) {
        console.error('error reading serviceAccount at ', path, error)
        return
      }
      */
      let serviceAccount = firebaseAdminCredentials?.[projectId]
      if (!serviceAccount) throw new Error('no firebase credentials found')
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
  init
}
