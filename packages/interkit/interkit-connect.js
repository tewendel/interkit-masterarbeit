import simpleDDP from 'simpleddp'; // ES6
import ws from 'isomorphic-ws';

const defaultOpts = {
  endpoint: process.env.INTERKIT_SERVER_SERVERSIDE_WEBSOCKETS_URL || process.env.INTERKIT_SERVER_WEBSOCKETS_URL,
  SocketConstructor: ws,
  reconnectInterval: 5000
};

const setup = async (opts={}) => {

  opts = {...defaultOpts, ...opts}

  /* connect */

  console.log("connecting to " + opts.endpoint + "...")

  const server = new simpleDDP(opts);

  server.on('connected', () => {
    // do something
    console.log("connected to interkit server")
  });

  server.on('disconnected', () => {
    // for example show alert to user
    console.log("disconnected from interkit server")
  });

  server.on('error', (e) => {
    // global errors from server
    console.log("interkit server error", e)
  });

  return server

}

export {
  setup
}