import simpleDDP from 'simpleDDP';
import ws from 'isomorphic-ws';
import { writable } from 'svelte/store';

let server;
let subs = {};

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
  getStoreForSheetRows: async (sheetId) => {
    if(subs[sheetId]) return subs[sheetId].store;

    subs[sheetId] = {};
    subs[sheetId].store = writable([]);

    // initiates subscription
    subs[sheetId].sub = server.subscribe("rows", sheetId);
    await subs[sheetId].sub.ready();
    console.log("sub ready", sheetId)

    let collection = server.collection('rows').filter(row=>row.sheetId==sheetId)

    // write an initial fetch of the collection into the store
    subs[sheetId].store.set(collection.fetch());

    // update the store through simpleDDP's onChange listener
    subs[sheetId].reactiveCollection = collection.reactive();
    subs[sheetId].reactiveCollection.onChange((data)=>{
      subs[sheetId].store.set(data)
    }) 

    return subs[sheetId].store;
  }
}

export default InterkitClient;