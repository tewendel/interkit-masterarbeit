import simpleDDP from 'simpleddp';
import { simpleDDPLogin } from 'simpleddp-plugin-login';

import { StaticArchiveServer } from './static-archive-server.js';

import ws from 'isomorphic-ws';
import { writable, get } from 'svelte/store';

/* TODO InterkitLiveReload is "unimplemented" since the update to Capacitor v5
import InterkitLiveReload from "./interkit-live-reload.js"
*/

import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

import util from './util.js';

import { enableHeartbeat as userEnableHeartbeat } from './pushnotifications.js'
import { userEnableActivityTracking, trackUserUrlPath } from './user-activity-tracking.js' 

// this store holds the basic data from interkit.config.json
let config = writable(null); 

// this store holds the projctId that is loaded with info from the config
let projectId = writable(null);
let connectionIssue = writable(false);
let connected = writable(false);

let showDummyData = writable(false);
let archiveMode = writable(false);
let archiveData;

let server;

let userAuth;

//console.log(get(userAuth))
// this is set only after user logs in sucessfully / or continues user sessio
let userId = writable(null); 

let userIsRole = writable({ admin: false })

userId.subscribe(async userId => {
  // try-block to get around race condition:
  // If this is called too early, there is a syntax/ReferenceError re declaration before initialization,
  // in the case were we need this function we can ignore it, because the subscription fires again, in time.
  try {
    // console.log('try userId subscription InterkitClient.call...')
    const roles = await InterkitClient.call('user.getRoles', { userId })
    userIsRole.set(roles)
  } catch (e) {
    console.log('try userId subscription InterkitClient call: ignoring / failing gracefully...')
  }
})

let pushnotificationRegistrationToken = writable(null)
let webPushPublicKey = writable(null)

// a global store to store the state history of stores relavant to the UI
let uiHistoryStore = writable([])

 // reactive user data related to this project
let userProjectDataStore = writable();

// centrally store all subscriptions to sheets, using sheetKey as key on this object
let rowSubs = {};
let mediaFileSub;
let userProjectDataSub;
let sheetSub;

// can probably be deprecated - used to make sure last subcription is closed
let subscriptionCounter = {};
// a list of subscriptions that are currently active
let subscriptions = [];

let globalStores = {};
let globalMethods = {};

// restores the meteor style _id attribute on all elements in array or single object
// if there aren't any .id attributes, it uses the hopefully existing ._id ones
const restore_ids = (data) => {
  if(Array.isArray(data))
    return data.map((e)=>{return {...e, _id: e.id ? e.id : e?._id}})
  if(typeof data == "object")
    return {...data, _id: data.id ? data.id : data?._id}
  return data;
}

let firstConnect = true;

// connects to the meteor server
const connect = async (url) => {
  if(!url)
    url = get(config)?.INTERKIT_SERVER_WEBSOCKETS_URL
  
  console.log("InterkitClient.connect", url)
  if(server) {
    console.log("server already initialized, ignoring")
    return
  }
  let opts = {
    endpoint: url,
    SocketConstructor: ws,
    reconnectInterval: 5000
  };

  if(get(archiveMode)) {
    server = new StaticArchiveServer(archiveData); // use client-side server simulation
  } else {
    server = new simpleDDP(opts, [simpleDDPLogin]); // connect to meteor
  }
  
  server.on('connected', async () => {
    console.log("server connected")
    connected.set(true);

    if(firstConnect) {
      firstConnect = false;
    } else {
      // we do this here on every reconnect
      let result = await server.call("resumeUserSession", get(userAuth))
      if(result) {
        userId.set(get(userAuth)?.id);
        await loadElementPropertiesFromUser();
      }
    }
  });

  server.on('disconnected', () => {
    connected.set(false);
  });

  // this needs to be done once in the client app
  await server.connect();
  let result = await server.call("resumeUserSession", get(userAuth))
  //console.log("resumeUserSession result", result)

  // these can be very async so we listen to both and the handler acts when both are set
  userId.subscribe(saveUserPushnotificationRegistrationToken)
  pushnotificationRegistrationToken.subscribe(saveUserPushnotificationRegistrationToken)
  InterkitClient.saveUserPushnotificationRegistrationToken()

  // on app load the client is not necessarily connected yet, so we do it here, too
  InterkitClient.userHeartbeat(true) 

  if(result) {
    // login again
    userId.set(get(userAuth)?.id);
    await loadElementPropertiesFromUser();
  }
}

// loads local config file to get basic info about project
const loadConfig = async () => {
    let params = (new URL(document.location)).searchParams;
    let _config;
    
    if(params.get("localConfigURL")) {

      console.log("localConfigURL", params.get("localConfigURL"))

      // we are in the authoring system preview - load generated config from budler
      let response = await fetch(params.get("localConfigURL"))    
      try {
        _config = await response.json()
        console.log("interkit.config.json", _config)
      } catch(e) {
        console.log("error parsing config", e);
      }

    } else {

      // we are in standalone/capacitor mode - load config from our own public directory
      let response = await fetch("interkit.config.json")    
      try {
        _config = await response.json()
        console.log("interkit.config.json", _config)
      } catch(e) {
        console.log("error parsing config", e);
      }

    }

    // override loadTheme option that might be set in config
    if(params.get("loadTheme")) {
      _config.INTERKIT_APP_LOAD_THEME = params.get("loadTheme") === "true";
    }
    console.log(`INTERKIT_APP_LOAD_THEME=${_config.INTERKIT_APP_LOAD_THEME}`)

    if(params.get("dummyData")) {
      let d = params.get("dummyData") == "true" ? true : false
      _config.showDummyData = d
      showDummyData.set(d)
    }

    if(params.get("archiveMode")) {
      let d = params.get("archiveMode") == "true" ? true : false
      archiveMode.set(d)
      console.log("set archiveMode", d)
    }
    
    config.set(_config);
}

// loads local archive data
const loadArchiveData = async () => {
  console.log("loading archiveData...")

  const currentUrl = new URL(window.location.href);
  const urlWithoutQuery = currentUrl.origin + currentUrl.pathname;
  console.log(urlWithoutQuery);

  const archiveDataResponse = await fetch(urlWithoutQuery + "/archive/db.json");
  console.log("loaded archive data response", archiveDataResponse)
  
  try {
    archiveData = await archiveDataResponse.json()
    // change key of files to fit mediafiles publication
    archiveData.mediafiles = archiveData.files
    console.log("loaded archiveData", archiveData)
  } catch(e) {
    console.log("error getting archiveData", e);
  }
}

const fetchWithTimeout = async (resource, options={timeout: 8000}) => { 
  const { timeout } = options;
  var response = false;
  if ('AbortController' in window) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
  } else {
    console.log('no AbortController...')
    // warning: this will never time out. TODO find a better polyfill?
    response = await fetch(resource, { ...options })
  }
  return response;
}

let connectionAlert = false;

const getProjectId = async () => {

  let _projectId;
  let params = (new URL(document.location)).searchParams;
  if(params.get("projectId")) {
    console.log("got projectId from url param, using that")
    _projectId = params.get("projectId");
  } else {
    console.log("trying to get projectId from server via slug", get(config)?.project_slug);
    let url = get(config)?.INTERKIT_BUNDLER_URL + "/project_id/" + get(config)?.project_slug
    let result
    try {
      result = await fetchWithTimeout(url)
    } catch (e) {
      console.log(e);
      if(!connectionAlert && !get(archiveMode)) {
        // alert("Diese App benötigt Internet-Zugriff. Bitte überprüfen Sie Ihre Verbindung.")
        connectionAlert = true
        connectionIssue.set(true)
      }
      if(get(archiveMode)) {
        console.log("setting projectId via archive data")
        _projectId = archiveData.project._id
      }
    }    

    if(result) {
      _projectId = await result.text();
    } else {
      if (!connectionAlert && !get(archiveMode)) {
        alert("couldn't retrieve projectId from slug " + get(config)?.project_slug);
      }
    }
  } 
  console.log("INTERKIT_PROJECT_ID", _projectId);
  projectId.set(_projectId);
}

// compares two version strings of the format "0.1", returns 0 if equal, -1 if a > b, 1 if a < b
const versionCompare = (a, b) => {
  if(a == b) return 0;
  let aNumeric = a.split(".").map(c => parseInt(c));
  let bNumeric = b.split(".").map(c => parseInt(c));
  // compare first digit
  if(aNumeric[0] > bNumeric[0]) return -1;
  if(aNumeric[0] < bNumeric[0]) return 1;
  // compare second digit
  if(aNumeric[1] > bNumeric[1]) return -1;
  if(aNumeric[1] < bNumeric[1]) return 1;
}

/* TODO InterkitLiveReload is "unimplemented" since the update to Capacitor v5
const checkForUpdates = async () => {
    let _config = get(config);
    let _projectId = get(projectId);

    if(!_projectId) {
      console.log("no projectId, aborting update")
      return
    }

    let url = `${_config?.INTERKIT_BUNDLER_URL}/app/${_projectId}/interkit.config.json`;
    console.log("looking for online config at", url);
    let response = await fetch(url)
    let onlineConfig;
    try {
      onlineConfig = await response.json()
      console.log("found online config", onlineConfig);  
    } catch(e) {
      console.log("error during update", e)
    }

    let myVersion = _config?.bundle_version
    let onlineVersion = onlineConfig?.bundle_version
    console.log(`my version: ${myVersion} - online version: ${onlineVersion}`);

    let downloadedVersion = await InterkitLiveReload.checkDownloadedVersion();

    if(downloadedVersion) {
      console.log("found a downloaded bundle with version " + downloadedVersion);
      if(
        versionCompare(downloadedVersion, myVersion) >= 0  // I am newer or equal downloaded
        && versionCompare(onlineVersion, myVersion) >= 0 // I am newer or queal online
      ) {
        console.log("I'm at the newest available version, no need to update")
        return false;
      }

      // If the downloaded version is newer or equal to the online version, switch 
      if(versionCompare(onlineVersion, downloadedVersion) >= 0) {
        console.log("The downloaded version is the newest available, switching to that...")
        await InterkitLiveReload.activateInstalledBundle();
        return true;
      } 
    }

    // if the online version is newer than me, downnload it and switch!
    if(versionCompare(myVersion, onlineVersion) == 1) {
       console.log("online is newer, we need to update!");
       let bundleURL = `${_config?.INTERKIT_BUNDLER_URL}/bundlezip/${_projectId}`;
       //let bundleURL = "https://app.demo.interkit.app/bundlezip/Pn5M862Kw9Zj7C8ot"

       await InterkitLiveReload.downloadAndActivateBundle(encodeURI(bundleURL))
       return true;

    } else {
      console.log("online is same or older - we are on the newest available version, no update or switch needed");
    }
    return false;   
}
*/

/**

Returns a svelte store based on a Meteor subscription.
@async
@function getSub
@param {Object} col - The Meteor collection.
@param {string} pub - The Meteor publication to subscribe to.
@param {Object} [pubArgs={}] - An object with arguments for the subscription. projectId is added from config.
@param {function} [cFilter=(a) => true] - A filter function to narrow down the results.
@param {boolean} [single=false] - Track a single document or an array.
@param {Object} columnMap - Column keys for conversion into more convenient objects.
@param {string} autoUnsubscribeKey - If set, the subscription will be automatically unsubscribed when a new subscription with the same key comes in. This is useful when you intend to resubscribe with changed arguments.
@return {Object} Returns an object containing a svelte store named 'data'.
@example
// Components should not use this directly but use getRowSubStore (see below)
@note
// Important notice: simpleDDP internally groups all messages from the same collection but different subscriptions into the same storage
*/

const getSub = async (col, pub, pubArgs={}, cFilter=(a)=>true, single=false, columnMap, autoUnsubscribeKey) => {

  // setup the store
  let sub = {};
  sub.data = writable([]); // save svelte store under data
  sub.objects = writable([]); // svelte store to contain converted objects

  // add projectId to arguments object
  if(pubArgs) {
    if(!pubArgs?.projectId && get(projectId)) {
      pubArgs.projectId = get(projectId);
    }
  }
  //console.log("getSub", col, pub, pubArgs)

  if (!server) {
    console.warn("server not initialised, aborting getSub");
    return
  }

  let collection
  let data = []
  
  // setup the subscription
  sub.sub = server.sub(pub, [pubArgs]);
  await sub.sub.ready();
  //console.log("sub ready", pub, pubArgs)

  if(!subscriptionCounter[pub]) subscriptionCounter[pub] = 0;
  subscriptionCounter[pub] += 1;
  //console.log("incremented subscriptionCounter", pub, subscriptionCounter[pub])

  collection = server.collection(col).filter(cFilter)
  data = single ? collection.fetch()[0] : collection.fetch()
  console.log("initial data received for", col, pub, data) 
  
  let dataRestored = restore_ids(data)
  
  // write an initial fetch of the collection into the stores
  sub.data.set(dataRestored);
  sub.objects.set(util.rowsToObjects(dataRestored, columnMap));
  
  // update the store through simpleDDP's onChange listener
  sub.reactiveCollection = single ? collection.reactive().one() : collection.reactive()

  let bufferedWritesInterval = 350
  let bufferedWritesMaxAge = 2000
  let bufferedWritesFlushAt = null
  let bufferedWritesFlushHandle = null

  const updateAndFlush = (d) => {
    if (bufferedWritesFlushHandle) {
      clearTimeout(bufferedWritesFlushHandle);
      bufferedWritesFlushHandle = null;
    }
    bufferedWritesFlushAt = null
    let dataRestored = restore_ids(d);
    sub.data.set(dataRestored)
    sub.objects.set(util.rowsToObjects(dataRestored, columnMap))
    //console.log("update-"+col+"-"+pub+":", dataRestored, pubArgs)
  }

  sub.reactiveCollection.onChange((newData)=>{
    //console.log("onChange-"+col+"-"+pub+":", newData, pubArgs)
    
    if (bufferedWritesFlushAt === null) {
      bufferedWritesFlushAt = new Date().valueOf() + bufferedWritesMaxAge;
    }
    else if (bufferedWritesFlushAt < new Date().valueOf()) {
      updateAndFlush(newData)
      return;
    }

    // schedule next flush time to bufferedWritesInterval ahead of now
    if (bufferedWritesFlushHandle) {
      clearTimeout(bufferedWritesFlushHandle);
      bufferedWritesFlushHandle = null;
    }
    bufferedWritesFlushHandle = setTimeout(() => updateAndFlush(newData), bufferedWritesInterval);
      
  })

  sub.stop = async () => {
    if(subscriptionCounter[pub] > 0) {
      subscriptionCounter[pub] -= 1
      //console.log("reduced subscriptionCounter", pub, subscriptionCounter[pub])
    }

    // remove the subscription from the subscriptions array
    subscriptions = subscriptions.filter(s => s != sub)
    console.log("InterkitClient: " + subscriptions.length + " subscriptions active")

    sub.reactiveCollection.stop()
    
    if(subscriptionCounter[pub] == 0) {
      console.log("stopping subscription to", pub)
      await sub.sub.stop()
      await sub.sub.remove()
    }

  } 

  sub.status = "subscribed";

  subscriptions.push(sub);
  console.log("InterkitClient: " + subscriptions.length + " subscriptions active")

  if(autoUnsubscribeKey) {
    const autoUnsubscribeId = `${autoUnsubscribeKey}-${col}-${pub}`;
    
    // save the autoUnsubscribeId to the subscription
    sub.autoUnsubscribeId = autoUnsubscribeId;
  
    // if we have an autoUnsubscribeKey, we need to check if we have a subscription with the same key and stop it
  
    subscriptions.forEach(s => {
      if(s.autoUnsubscribeId == autoUnsubscribeId && s != sub) {
        console.log("InterkitClient: stopping subscription automatically, autoUnsubscribeKey found: ", autoUnsubscribeKey)
        s.stop();
      }
    })
  }

  return sub;
}

// this gets a sub to messages of specified channel
const getMessageSub = async (channel_key, includeBlocked = false) => {
  let sub = await InterkitClient.getSub(
    "messages",
    "messages",
    {
      channel_key,
      userId: get(userId),
      includeBlocked
    },
    m => (m.channel_key === channel_key)
  )
  return sub;
}

// returns the row store for a given sheet, created one if not available or waits for subscription to complete
// if a columnMap is passed in, returns the converted object store
// subKey is a special key you can use to prevent conflicts with other subs that have different column maps
const getRowSubStore = async (sheetKeyOrSheetColumn, columnMap, subKey) => {

  // check if we got a sheetKey or sheetColumn
  let sheetKey;
  if(sheetKeyOrSheetColumn.includes("/")) {
    sheetKey = util.getSheetKey(sheetKeyOrSheetColumn)
  } else {
    sheetKey = sheetKeyOrSheetColumn
  }
  
  // if we use a columnMap make this together with the sheetKey as the subKey to avoid conflicts
  if(columnMap && !subKey) subKey = JSON.stringify({sheetKey, ...columnMap})

  // default subKey is the sheetKey
  if(!subKey) subKey = sheetKey;

  //console.log("getRowSubstore", {sheetKey, columnMap, subKey, rowSubs})

  if(!rowSubs[subKey]) {
    // no subscription for this sheet yet, create one
    rowSubs[subKey] = {
      status: "subscribing",
      subPromise: new Promise(async (resolve, reject) => {
        console.log("getRowSubstore: creating row subscription on sheet", sheetKey)
        let rsub = await getSub("rows", "rows", {sheetKey}, r=>r.sheetKey==sheetKey, false, columnMap)
        resolve(rsub);
      })
    };
  }
  let sub = await rowSubs[subKey].subPromise;
  //console.log("getRowSubStore got sub", subKey, sub)
  if(columnMap) {
    return sub?.objects
  } else {
    return sub?.data;  
  }
}

// helper function to simplify data loading in action - just get all the data
const getRows = async (sheetkey) => {
  let store = await getRowSubStore(sheetkey);
  return store ? get(store) : [];
}


// returns the row store for a given sheet, created one if not available or waits for subscription to complete
// returns only one row
// if a columnMap is passed in, returns the converted object store
// subKey is a special key you can use to prevent conflicts with other subs that have different column maps
const getOneRowSubStore = async (sheetKeyOrSheetColumn, query, filterFunction) => {

  let data = await getRowSubStore(sheetKeyOrSheetColumn) // query not used yet

  const rowStore = writable()
  
  data.subscribe( rows => {
    rowStore.set(rows.filter(filterFunction)?.[0])
  })

  return rowStore
}

const getMediaFileSubStore = async () => {
  if(!mediaFileSub) {
    // no subscription to media files yet, set it up
    mediaFileSub = new Promise(async (resolve, reject) => {
      //console.log("creating subscription for mediafiles")
      let msub = await getSub("mediafiles", "mediafiles", {})
      resolve(msub);
    })
  }    
  let sub = await mediaFileSub;
  return sub?.data;
}

const subscribeUserProjectDataStore = async () => {
  console.log("try subscribeUserProjectData", get(userId), get(projectId), userProjectDataSub)
  if ((!server || !get(userId) || !get(projectId)) && !get(archiveMode)) {
    console.log("subscribeUserProjectDataStore aborting")
    return  
  }
  if (!userProjectDataSub) {
    // no subscription to userProjectData yet, set it up
    userProjectDataSub = new Promise(async (resolve, reject) => {
      console.log("creating subscription for userProjectData")
      let msub = await getSub("users", "user.projectUserData", {})
      resolve(msub);
    })
    let sub = await userProjectDataSub;
    console.log("subscribeUserProjectDataStore", sub, sub.data)
    // subscribe to user project data
    sub.data.subscribe(d => {
      console.log("userProjectDataSub new data", d)
      userProjectDataStore.set(d?.[0]?.projectUserData?.[get(projectId)] || null)
    })
  }
}

const getUiKeyStore = uiKey => {
  const key = "uiKey_" + uiKey
  if (!globalStores[key]) {
    globalStores[key] = writable();
  }
  return globalStores[key]
}

const getUiKey = uiKey => {
  const key = "uiKey_" + uiKey
  if (globalStores[key]) {
    return get(globalStores[key])
  } else {
    return false
  }
}

// get a local persistant store by key or initialize a new one if it doens't exist
const getGlobalStore = (key) => {
  if(!globalStores[key]) {
    let persistedStoreJSON = localStorage.getItem(key)
    let persistedStore;
    try {
      persistedStore = JSON.parse(persistedStoreJSON)
    } catch (e) {
      console.log(e)
    }
    //console.log("localStorage store", key, persistedStore)
    globalStores[key] = writable(persistedStore);   
  }
  return globalStores[key]
}

// save current ui state, but also debounce
// needs to be called *after* all changes are done
// (alternatively the debounce should go in the different direction)
const takeUiSnapshot = (debounceBeforeMs = 0) => {
  uiHistoryStore.update(arr => {
    //console.log(arr)
    //if (typeof arr != "array") return


    // get values from current stores
    let stores = {}
    for (let key in globalStores) {
      stores[key] = get(globalStores[key])
    }

    // construct new entry
    const newEntry = {
      globalStores: stores,
        date: new Date(),
          id: Date.now()
    }

    let method = "pushState"

    // replace latest entry when it is less than debounceStreakMs ago
    if (arr.length > 0) {
      if (arr[arr.length - 1].date.getTime() + debounceBeforeMs > Date.now()) {
        // ...by removing the last entry before adding the new one
        arr.pop();
        method = "replaceState"
      }
    }

    const result = [...arr, newEntry]

    console.log("ui snapshot", method, result)

    if (window) {
      window.history[method]({ id: newEntry.id}, newEntry.id) // use browser history api to store the id
    }

    return result
  })
}

const restoreUiSnapshot = id => {
  const history = get(uiHistoryStore)
  const entry = history.find(e => e.id === id)
  if (entry) {
    console.log("restoring ui snapshot", entry)
    for (let key in globalStores) {
      if (typeof entry.globalStores[key] !== "undefined") {
        // replace existing content
        globalStores[key].set(entry.globalStores[key])
      } else {
        // remove stores that are not in the snapshot
        globalStores[key].set(null)
        //delete globalStores[key]
      }
    }
    console.log(globalStores)
    // there is no way to remove stores, so no need to check if there are stores in the snapshot that are not there anymore
    return entry
  } else {
    return false
  }
}

const initAuth = async () => {
  console.log('initAuth')
  try {
    let userAuthObj = await Preferences.get({ key: 'userAuth' })
    if (userAuthObj && userAuthObj.value) {
      console.log('got userAuth from Preferences')
      userAuthObj = userAuthObj.value
    } else {
      console.log('moving legacy localStorage userAuth to persistent Capacitor Storage')
      userAuthObj = localStorage.getItem('userAuth')
      await Preferences.set({ key: 'userAuth', value: userAuthObj })
      localStorage.removeItem('userAuth')
    }
    userAuthObj = JSON.parse(userAuthObj)
    userAuth = writable(userAuthObj)
  } catch(e) {
    console.error(e)
  }
}

const initApp = async options => {
  console.log('initApp')
  await initAuth()
  await loadConfig();
  await loadArchiveData(); // loads archive data, including projectId

  if (options.projectId) {
    projectId.set(options.projectId);
  } else {
    await getProjectId();
  }

  let updating = false;
  /* TODO InterkitLiveReload is "unimplemented" since the update to Capacitor v5
  if (Capacitor.isNative) {
    updating = await checkForUpdates();
  }
  */
  if (!updating) {
    await connect()
    const _publicKey = await server.call('project.getWebPushPublicKey', { projectId: get(projectId) })
    webPushPublicKey.set(_publicKey)
    return true;
  }  
}

// create a user that is identified by a project specific userToken
const createProjectTokenUser = async ({ userToken, projectData } = {}) => {
  //console.log("createProjectTokenUser")
  const result = await server.call("createProjectTokenUser", {
    userToken,
    projectId: get(projectId),
    projectData
  })
  return result
}

const loginTokenUser = async ({ userToken }) => {
  let credentials
  try {
    credentials = await InterkitClient.call("generateLoginCredentialsForTokenUser", { userToken })
    console.log(credentials)
    const user = await InterkitClient.login(credentials)
    return user
  } catch (error) {
    return false
  }
}

const createProjectTokenUserAndLogin = async ({ userToken, projectData } = {}) => {
  console.log("createProjectTokenUserAndLogin")
  const token = await InterkitClient.call("createProjectTokenUser", {
    userToken,
    projectData
  })
  const userId = await InterkitClient.loginTokenUser({ userToken: token })
  await loadElementPropertiesFromUser();
  return userId ? token : false
}

const createProjectUser = async ({ username, password, email, projectData, projectId }) => {
  const result = await InterkitClient.call("createProjectUser", {
    username,
    password,
    email,
    projectData,
    projectId
  })
  return result
}

const deleteProjectUsers = async (ids) => {
  const result = await InterkitClient.call('deleteProjectUsers', ids)
  return result
}

const pushnotificationMessageUser = async ({ userId, msg }) => {
  await InterkitClient.call(
    'pushnotificationMessageUser',
    { userId, msg }
  )
}

const saveUserPushnotificationRegistrationToken = async () => {
  if (!userId || !pushnotificationRegistrationToken) {
    console.log('saveUserPushnotificationRegistrationToken bailing, because something\'s missing', { userId, pushnotificationRegistrationToken })
    return
  }
  let result
  try {
    const token = get(InterkitClient.pushnotificationRegistrationToken)
    if (!token) {
      console.log('saveUserPushnotificationRegistrationToken bailing, because no token', token)
      return
    }
    result = await InterkitClient.call(
      'user.savePushnotificationRegistrationToken',
      { token }
    )
  } catch (error) {
    console.error('saveUserPushnotificationRegistrationToken error', error)
    return false
  }
  return result
}

const saveUserWebPushSubscription = async (subscription) => {
  if (!get(userId)) {
    console.warn('saveUserWebPushSubscription bailing, no userId')
    return
  }
  console.log('InterkitClient.saveUserWebPushSubscription', subscription)
  const result = await InterkitClient.call('user.saveWebPushSubscription', { userId: get(userId), subscription })
  return result
}

const userHeartbeat = async (isAwake) => {
  let result
  try {
    result = await InterkitClient.call('user.heartbeat', { isAwake, userId: get(InterkitClient.userId) })
  } catch (error) {
    console.error('userHeartbeat error, maybe called before connect?', error)
    return false
  }
  return result
}

const login = async ({ username, password }) => {
  console.log('InterkitClient.login')
  //console.log(server)
  let userAuthData = await server.login({
    password,
    user: {
      username
    }
  });
  console.log(userAuthData)
  userId.set(userAuthData.id);
  localStorage.setItem('userId', userAuthData.id);
  await Preferences.set({ key: 'userAuth', value: JSON.stringify(userAuthData) })
  await loadElementPropertiesFromUser();
  return userAuthData
}

const logout = async () => {
    await server.logout();
    userId.set(null);
    localStorage.setItem('userId', null);
    await Storage.set({ key: 'userAuth', value: JSON.stringify(null) })
  }

// call a meteor method, add projectId to params if needed (allow method calls without params)
const call = async (method, params = {}) => {

    if (config && params && !params?.projectId) {
      console.log("adding projectId to method params", params, method, get(projectId))
      params.projectId = get(projectId);
    }

    if (params && !params?.projectId) {
      console.log("warning, call to method before projectId has been retreived:" + method)
    }

    let response = await server.call(method, params);
    return response
  }


const getMediaFile = async (key) => {
  if (key) {
    let store = await getMediaFileSubStore()
    console.log("getMediaFile", get(store))
    let mediafile = get(store)?.find(m => m.meta.key == key)
    console.log("getMediaFile", get(store), mediafile)
    if (mediafile) {
      // get file from media server
      if (!get(archiveMode)) {
        mediafile.link =
          `${get(config).INTERKIT_SERVER_URL}/cdn/storage/mediafiles/${mediafile._id}/original/${mediafile._id}.${mediafile.ext}`   
      // get file from public directory
      } else {
        const currentUrl = new URL(window.location.href);
        const urlWithoutQuery = currentUrl.origin + currentUrl.pathname;
        console.log(urlWithoutQuery);
        mediafile.link = `${urlWithoutQuery}archive/media/${mediafile._id}.${mediafile.extension}`
      }
      //console.log("mediafile not found", key, get(store))
    }
    return mediafile
  } else {
    console.log("call of getMediaFile with no key", key, typeof key)
  }
}

const getUploadEndpoint = () =>
    `${get(config)?.INTERKIT_SERVER_URL}/mediaUpload`

const getSheet = async (key) => {
  if (!sheetSub) {
    // no subscription to media files yet, set it up
    sheetSub = new Promise(async (resolve, reject) => {
      //console.log("creating subscription for sheets")
      let ssub = await getSub("sheets", "sheets", {})
      resolve(ssub);
    })
  }
  let sub = await sheetSub;
  let sheet = get(sub?.data)?.find(m => m.key == key)
  return sheet
}

const setGlobalStore = (storeKey, value) => {
  let store = InterkitClient.getGlobalStore(storeKey);
  store.set(value)
  localStorage.setItem(storeKey, JSON.stringify(value));
}

// Properties are additional user-specific attributes to elements
// they all exist in the same global store "elementProperties"
// setElementProperty sets a property on an item and persist it
const setElementProperty = async (
  //store,  // a global store from getGlobalStore()
  key, // an id, typically a row key from database
  property, // name of the property
  value // value of the property
) => {
  const elementProperties = getGlobalStore("elementProperties");
  let storeData = get(elementProperties)
  if (!storeData) storeData = {}
  if (!storeData[key]) storeData[key] = {};
  storeData[key][property] = value;
  console.log("setElementProperty", key, property, value, storeData)
  elementProperties.set(storeData);
  localStorage.setItem("elementProperties", JSON.stringify(storeData));
  
  await saveElementPropertiesToUser();
}

const getElementProperty = (
  //store, // a global store from getGlobalStore()
  elementKey, // rowKey of the element to check
  property // name of the property, for example "bookmarked"
) => {
  const elementProperties = getGlobalStore("elementProperties");
  let value = get(elementProperties)?.[elementKey]?.[property]
  return value;
}

const loadElementPropertiesFromUser = async () => {
  console.log("loadElementPropertiesFromUser")
  const userProjectData = get(userProjectDataStore)
  if (!userProjectData) {
    // wait for data
    userProjectDataStore.subscribe(data => {
      if (!data?.elementProperties) return false
      const elementPropertiesStore = getGlobalStore("elementProperties");
      elementPropertiesStore.set(data?.elementProperties)
      return true
    })
  } else {
    // same but now
    if (!userProjectData?.elementProperties) return false
    const elementPropertiesStore = getGlobalStore("elementProperties");
    elementPropertiesStore.set(userProjectData?.elementProperties)
    return true
  }

}

const setUserVar = (varName, value) => {  
  InterkitClient.call('user.setUserVar', {
    userId: get(userId),
    varName,
    value
  })
}


const usersMoveTo = async ({ userIds, projectId, boardId, nodeId }) => {
  const result = await InterkitClient.call(
    'users.moveTo',
    { userIds, projectId, boardId, nodeId }
  )
  return result
}

const saveElementPropertiesToUser = async () => {
  const elementProperties = getGlobalStore("elementProperties");
  let storeData = get(elementProperties)
  console.log("saving elementProperties", storeData)
  let result
  try {
    result = await InterkitClient.call("user.saveElementProperties", { elementProperties: storeData })
  } catch (error) {
    return false
  } finally { }
  return result
}

const getUiHistoryStore = () => {
  return uiHistoryStore
}

const setUiKey = (uiKey, value) => {
  const store = getUiKeyStore(uiKey)
  //console.log(`change ${uiKey} from ${get(uiKey)} to ${value}`)
  console.log(`setUiKey: change ${uiKey} to ${value}`)
  store.set(value)
}

const registerGlobalMethod = (key, method) => {
  //console.log("registerGlobalMethod", key)
  globalMethods[key] = method;
}

const callGlobalMethod = (key, options) => {
  if (globalMethods[key]) {
    //console.log("callGlobalMethod", key)
    globalMethods[key](options);
  } else {
    console.log("global method not fouund", key);
  }
}

projectId.subscribe(subscribeUserProjectDataStore)
userId.subscribe((data)=>{
  console.log("userId update", data)  
  if (data) { 
    trackUserUrlPath() 
  }
  subscribeUserProjectDataStore()
})

// restore elementProperties from user --> not necessary because they are also in the localstorage 
//
// userProjectDataStore.subscribe(data => {
//   const elementProperties = data?.elementProperties
//   if (elementProperties) {
//     initElementProperties(elementProperties)
//   }
// })

const playFloatingAudio = async (elementRow, audioColumn, autoplay=true) => {
  const audioPlayerStatus = getGlobalStore("audioPlayerStatus")
  const audioPlayerElement = getGlobalStore("audioPlayerElement")
  
  if(elementRow) {
    if(elementRow.key == get(audioPlayerElement)?.key) {
      // if this element is already in player, just toggle paused state
      audioPlayerStatus.update( s => ({
        ...s, 
        paused: !get(audioPlayerStatus)?.paused,
        currentTime: s?.currentTime == s?.duration ? 0 : s.currentTime
      })) 
    } else {
      // new element, reset
      audioPlayerElement.set(elementRow)
      audioPlayerStatus.set({
        active: true,
        //elementRow,
        autoplay,
        paused: false,
        currentTime: 0,
        expanded: false,
        loading: true,
        audioKey: util.rowVal(elementRow, audioColumn)?.value
      })  
    }
  }
}


const InterkitClient = {
  userId,
  userIsRole,
  pushnotificationRegistrationToken,
  webPushPublicKey,
  config,
  connected, // svelte store
  projectId,
  showDummyData,
  archiveMode,
  userProjectDataStore,
  connectionIssue,
  connect,
  initApp,
  initAuth,
  createProjectTokenUser,
  loginTokenUser,
  createProjectTokenUserAndLogin,
  createProjectUser,
  deleteProjectUsers,
  saveUserPushnotificationRegistrationToken,
  saveUserWebPushSubscription,
  userEnableHeartbeat,
  userHeartbeat,
  userEnableActivityTracking,
  loginAnon: createProjectTokenUserAndLogin,
  login,
  logout,
  call,
  getSub,
  getMessageSub,
  getRowSubStore,
  getRows,
  getOneRowSubStore,
  getMediaFileSubStore,
  getMediaFile,
  getUploadEndpoint,
  getSheet,
  getGlobalStore,
  setGlobalStore,
  setElementProperty,
  getElementProperty,
  setUserVar,
  saveElementPropertiesToUser,
  loadElementPropertiesFromUser,
  usersMoveTo,
  getUiKeyStore,
  takeUiSnapshot,
  restoreUiSnapshot,
  getUiHistoryStore,
  setUiKey,
  getUiKey,
  registerGlobalMethod,
  callGlobalMethod,
  playFloatingAudio
};

export default InterkitClient;
