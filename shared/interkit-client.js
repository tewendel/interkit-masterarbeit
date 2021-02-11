import simpleDDP from 'simpleDDP';
import ws from 'isomorphic-ws';
import { writable } from 'svelte/store';

let server;

const InterkitClient = {
  connect: async (url) => {
    if(server) {
      console.log("server already initialized, ignoring")
      return
    }
    let opts = {
      endpoint: `ws://${url}/websocket`,
      SocketConstructor: ws,
      reconnectInterval: 5000
    };
    server = new simpleDDP(opts);
    // this needs to be done once in the client app
    await server.connect();
    console.log("connected")
  },
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
    console.log("getSub", pub)
    
    // setup the store
    let sub = {};
    sub.data = writable([]); // save svelte store under data

    // setup the subscription
    sub.sub = server.sub(pub, pubArgs);
    await sub.sub.ready();
    console.log("sub ready", pub)

    let collection = server.collection(col).filter(cFilter)
    let data = single ? collection.fetch()[0] : collection.fetch()
    console.log("data", data)

    // write an initial fetch of the collection into the store
    sub.data.set(data);
    
    // update the store through simpleDDP's onChange listener
    sub.reactiveCollection = single ? collection.reactive().one() : collection.reactive()
    sub.reactiveCollection.onChange((newData)=>{
      //console.log("onChange", newData)
      sub.data.set(newData)
    })

    sub.stop = async () => {
      console.log("stopping", pub)
      await sub.sub.remove()
    } 

    return sub;
  },
  
}

export default InterkitClient;