/**
 * Serverside connection to interkit (project-server)
 */

import simpleDDP from 'simpleddp'; // ES6
import ws from 'isomorphic-ws';
import { simpleDDPLogin } from "simpleddp-plugin-login";

let userAuth = null;

const defaultOpts = {
  endpoint: process.env.INTERKIT_SERVER_SERVERSIDE_WEBSOCKETS_URL || process.env.INTERKIT_SERVER_WEBSOCKETS_URL,
  SocketConstructor: ws,
  reconnectInterval: 5000
};

const setup = async (opts={}, user={}) => {

  opts = {...defaultOpts, ...opts}

  /* connect */

  console.log("connecting to " + opts.endpoint + "...")

  const server = new simpleDDP(opts, [simpleDDPLogin]);

  // observe connection
  const logInterval = setInterval(() => {
    if (!server.connected) {
      console.log("trying to connect to interkit server at " + opts.endpoint + "...")
    }
  }, 10000);

  server.on('connected', async () => {

    console.log("connected to interkit server", user)

    if (user.username) {
      if (user.password) {
        console.log("logging in as " + user.username + "...")
        try {
          userAuth = await server.login({
            password: user.password,
            user: {
              username: user.username
            }
          });
          console.log("Logged in as '" + user.username + "'")
        } catch (e) {
          console.log("login failed")
          console.log(e)
        }
      } else {
        console.warn("cannot log into interkit server as '" + user.username + "' because password is missing")
      }
    }
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