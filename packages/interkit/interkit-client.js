import simpleDDP from 'simpleddp';
import { simpleDDPLogin } from 'simpleddp-plugin-login';

import ws from 'isomorphic-ws';
import { writable, get } from 'svelte/store';

let server;

// get auth token from local storage if available
let userAuth;
try {
  let userAuthObj = JSON.parse(localStorage.getItem('userAuth'))
  userAuth = writable(userAuthObj);
} catch(e) {
  console.log(e)
}
console.log(get(userAuth))
// this is set only after user logs in sucessfully / or continues user sessio
let userId = writable(null); 

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

const InterkitClient = {
  userId,
  connect: async (url) => {
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
    console.log("resumeUserSession result", result)
    if(result) {
      // login again
      userId.set(get(userAuth)?.id);
    }
  },

  login: async ({username, password}) => {
    console.log(server)
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

  // call a meteor method
  call: async (method, params) => {
    let response = await server.call(method, params);
    return response
  },


  /*
    col: the meteor collection 
    pub: the meteor publication to subscribe to
    pubArgs: an array of arguments for the subscription
    cFilter: a filter function to narrow down the results
    single: track a single document or an array
  */

  getSub: async (col, pub, pubArgs=[], cFilter=(a)=>true, single=false) => {
    //console.log("getSub", pub)
    
    // setup the store
    let sub = {};
    sub.data = writable([]); // save svelte store under data

    // setup the subscription
    sub.sub = server.sub(pub, pubArgs);
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
      // console.log("onChange", newData)
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

    return sub;
  },

  getGlobalStore: (key) => {
    if(!globalStores[key])
      globalStores[key] = writable(null);   
    return globalStores[key]
  },

  registerGlobalMethod: (key, method) => {
    console.log("registerGlobalMethod", key)
    globalMethods[key] = method;
  },
  callGlobalMethod: (key, options) => {    
    if(globalMethods[key]) {
      console.log("callGlobalMethod", key)
      globalMethods[key](options);
    } else {
      console.log("global method not fouund", key);
    }
  }
}


export default InterkitClient;