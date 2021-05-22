import simpleDDP from 'simpleddp';
import { simpleDDPLogin } from 'simpleddp-plugin-login';

import ws from 'isomorphic-ws';
import { writable, get } from 'svelte/store';

import InterkitLiveReload from "./interkit-live-reload.js"

import { Capacitor } from '@capacitor/core';


// this store holds the basic data from interkit.config.json
let config = writable(null); 

// this store holds the projctId that is loaded with info from the config
let projectId = writable(null);
let connectionIssue = writable(false);

let server;

// get auth token from local storage if available
let userAuth;
try {
  let userAuthObj = JSON.parse(localStorage.getItem('userAuth'))
  userAuth = writable(userAuthObj);
} catch(e) {
  console.log(e)
}
//console.log(get(userAuth))
// this is set only after user logs in sucessfully / or continues user sessio
let userId = writable(null); 

// centrally store all subscriptions to sheets, using sheetKey as key on this object
let rowSubs = {};
let mediaFileSub;
let sheetSub;

// can probably be deprecated - used to make sure last subcription is closed
let subscriptionCounter = {};

let globalStores = {};
let globalMethods = {};

// restores the meteor style _id attribute on all elements in array or single object
const restore_ids = (data) => {
  if(Array.isArray(data))
    return data.map((e)=>{return {...e, _id: e.id}})
  if(typeof data == "object")
    return {...data, _id: data.id}
  return data;
}

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
  server = new simpleDDP(opts, [simpleDDPLogin]);
  // this needs to be done once in the client app
  await server.connect();
  console.log("connected")

  let result = await server.call("resumeUserSession", get(userAuth))
  //console.log("resumeUserSession result", result)
  if(result) {
    // login again
    userId.set(get(userAuth)?.id);
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
    
    config.set(_config);
}

const fetchWithTimeout = async (resource, options={timeout: 8000}) => { 
  const { timeout } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(id);

  return response;
}

let connectionAlert = false;

const getProjectId = async() => {

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
      if(!connectionAlert) {
        alert("Diese App benötigt Internet-Zugriff. Bitte überprüfen Sie Ihre Verbindung.")
        connectionAlert = true;
        connectionIssue.set(true);
      }
    }    

    if(result) {
      _projectId = await result.text();
    } else {
      console.log("couldn't retrieve projectId from slug " + get(config)?.project_slug);
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
        return;
      }

      // If the downloaded version is newer or equal to the online version, switch 
      if(versionCompare(onlineVersion, downloadedVersion) >= 0) {
        console.log("The downloaded version is the newest available, switching to that...")
        await InterkitLiveReload.activateInstalledBundle();
        return;
      } 
    }

    // if the online version is newer than me, downnload it and switch!
    if(versionCompare(myVersion, onlineVersion) == 1) {
       console.log("online is newer, we need to update!");
       let bundleURL = `${_config?.INTERKIT_BUNDLER_URL}/bundlezip/${_projectId}`;
       //let bundleURL = "https://app.demo.interkit.app/bundlezip/Pn5M862Kw9Zj7C8ot"

       await InterkitLiveReload.downloadAndActivateBundle(encodeURI(bundleURL))

    } else {
      console.log("online is same or older - we are on the newest available version, no update or switch needed");
    }   
}

  /*
    col: the meteor collection 
    pub: the meteor publication to subscribe to
    pubArgs: an object with arguments for the subscription - projectId is added from config
    cFilter: a filter function to narrow down the results
    single: track a single document or an array

    -> components should not use this directly but use getRowSubStore (see below)
  */

const getSub = async (col, pub, pubArgs={}, cFilter=(a)=>true, single=false) => {
  //console.log("getSub", pub)
  
  // setup the store
  let sub = {};
  sub.data = writable([]); // save svelte store under data

  // add projectId to arguments object
  if(pubArgs) {
    if(!pubArgs?.projectId && get(projectId)) {
      pubArgs.projectId = get(projectId);
    }
  }
  //console.log(col, pub, pubArgs)

  // setup the subscription
  sub.sub = server.sub(pub, [pubArgs]);
  await sub.sub.ready();
  //console.log("sub ready", pub)

  if(!subscriptionCounter[pub]) subscriptionCounter[pub] = 0;
  subscriptionCounter[pub] += 1;
  //console.log("incremented subscriptionCounter", pub, subscriptionCounter[pub])

  let collection = server.collection(col).filter(cFilter)
  let data = single ? collection.fetch()[0] : collection.fetch()
  //console.log("data", pub, data)

  // write an initial fetch of the collection into the store
  sub.data.set(restore_ids(data));
  
  // update the store through simpleDDP's onChange listener
  sub.reactiveCollection = single ? collection.reactive().one() : collection.reactive()
  sub.reactiveCollection.onChange((newData)=>{
    
    // this is called way too often! -> todo: optimize 
    // console.log("onChange", col, newData)
    sub.data.set(restore_ids(newData))      
    
  })

  sub.stop = async () => {
    if(subscriptionCounter[pub] > 0) {
      subscriptionCounter[pub] -= 1
      //console.log("reduced subscriptionCounter", pub, subscriptionCounter[pub])
    }
    
    if(subscriptionCounter[pub] == 0) {
      console.log("stopping subscription to", pub)
      await sub.sub.remove()
    }
  } 

  sub.status = "subscribed";

  return sub;
}

// returns the row store for a given sheet, created one if not available or waits for subscription to complete
const getRowSubStore = async (sheetKey) => {
  if(!rowSubs[sheetKey]) {
    // no subscription for this sheet yet, create one
    rowSubs[sheetKey] = {
      status: "subscribing",
      subPromise: new Promise(async (resolve, reject) => {
        console.log("creating row subscription on sheet", sheetKey)
        let rsub = await getSub("rows", "rows", {sheetKey}, r=>r.sheetKey==sheetKey)
        resolve(rsub);
      })
    };
  }
  let sub = await rowSubs[sheetKey].subPromise;
  return sub?.data;
}

const getMediaFileSubStore = async () => {
  if(!mediaFileSub) {
    // no subscription to media files yet, set it up
    mediaFileSub = new Promise(async (resolve, reject) => {
      console.log("creating subscription for mediafiles")
      let msub = await getSub("mediafiles", "mediafiles", {})
      resolve(msub);
    })
  }    
  let sub = await mediaFileSub;
  return sub?.data;
}

const InterkitClient = {
  userId,
  config,
  projectId,
  connectionIssue,
  connect,
  initApp: async () => {
    await loadConfig();
    await getProjectId();
    console.log("Capacitor.isNative", Capacitor.isNative)
    if(Capacitor.isNative) {
      await checkForUpdates();
    }
    await connect()
    return true;
  },
  login: async ({username, password}) => {
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
    localStorage.setItem('userAuth', JSON.stringify(userAuthData))
  },

  logout: async () => {
    await server.logout();
    userId.set(null);
    localStorage.setItem('userId', null);
    localStorage.setItem('userAuth', null);
  },

  // call a meteor method, add projectId to params if needed (allow method calls without params)
  call: async (method, params) => {

    if(config && params && !params?.projectId) {
      console.log("adding projectId to method params", params, method)
      params.projectId = get(projectId);
    }

    if(params && !params?.projectId) {
      console.log("warning, call to method before projectId has been retreived:" + method)
    } 
    
    let response = await server.call(method, params);
    return response
  },

  getSub,
  getRowSubStore,
  
  getMediaFileSubStore,
  getMediaFile: async (key) => {
    if(key) {
      let store = await getMediaFileSubStore()
      let mediafile = get(store)?.find(m => m.meta.key == key)
      if(mediafile) {
        mediafile.link = 
        `${get(config).INTERKIT_SERVER_URL}/cdn/storage/mediafiles/${mediafile._id}/original/${mediafile._id}.${mediafile.ext}`
      } else {
        //console.log("mediafile not found", key, get(store))
      }
      return mediafile
    } else {
      console.log("call of getMediaFile with no key", key, typeof key)
    }
  },

  getSheet: async (key) => {
    if(!sheetSub) {
      // no subscription to media files yet, set it up
      sheetSub = new Promise(async (resolve, reject) => {
        console.log("creating subscription for sheets")
        let ssub = await getSub("sheets", "sheets", {})
        resolve(ssub);
      })
    }    
    let sub = await sheetSub;
    let sheet = get(sub?.data)?.find(m => m.key == key)
    return sheet
  },

  getGlobalStore: (key) => {
    if(!globalStores[key]) {
      let persistedStoreJSON = localStorage.getItem(key)
      let persistedStore;
      try {
        persistedStore = JSON.parse(persistedStoreJSON)
      } catch (e) {
        console.log(e)
      }
      console.log("localStorage store", key, persistedStore)
      globalStores[key] = writable(persistedStore);   
    }
    return globalStores[key]
  },

  setElementProperty: (store, key, property, value) => {
    let storeData = get(store)
    if(!storeData) storeData = {}
    if(!storeData[key]) storeData[key] = {};
    storeData[key][property] = value;
    console.log("setElemmentProperty", property, value, storeData)
    store.set(storeData);
    localStorage.setItem("elementProperties", JSON.stringify(storeData));
  },

  registerGlobalMethod: (key, method) => {
    //console.log("registerGlobalMethod", key)
    globalMethods[key] = method;
  },
  callGlobalMethod: (key, options) => {    
    if(globalMethods[key]) {
      //console.log("callGlobalMethod", key)
      globalMethods[key](options);
    } else {
      console.log("global method not fouund", key);
    }
  }
}


export default InterkitClient;