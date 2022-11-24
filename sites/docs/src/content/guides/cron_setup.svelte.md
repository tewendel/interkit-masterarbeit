# The concept of hooks

`hooks` are like nodes, but run by the system, triggered by certain events (instead of regular nodes, that are triggered by messages and user movements). they export `async init()` and `async run()` functions (instead of `onMessage()` and `onArrive()`).

# Set up cron jobs in a project

Cron jobs are hooks (JS callbacks) that are run periodically on the server.

1. add a file `hooks/cron.js` to your project
2. this file should export `async init()` and `async run()`
3. `init` will get called once when the project server starts
4. `run` gets called regularly (every second)
5. you are responsible for the rest!

# API for callbacks

The `init` and `run` callbacks are called with these arguments:  
(see `project-server.js` for details)

```js
({
  ...projectApi, // provides .setUserVar, .sendMessage
                 // see project-api.js
  users,    // reactive collection of users
  messages, // reactive collection of messages
  events,   // reactive collection of scheduled events
  server,   // meteor server
  projectId // the project Id
})
```
