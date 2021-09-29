import { writable, get } from 'svelte/store';

// this store holds the basic data from interkit.config.json
let config = writable(null);

let globalActions = [];

const registerAction = ( {
    triggers=[], 
    method=function(){} } = {}
  ) => {
  const action = {
    triggers,
    method
  }
  console.log("registerAction", action)
  globalActions.push(action)
};

const registerActions = actions => {
  for (let action of actions) {
    registerAction(action)
  }
}

const executeTrigger = (trigger, payload) => {
  console.log("executeTrigger", trigger, payload)
  let actionsTriggered = 0;
  for (let action of globalActions) {
    if (action.triggers && action.triggers.indexOf(trigger) > -1) {
      actionsTriggered += 1;
      console.log("action triggered", action, payload)
      action.method({
        timestamp: Date.now(),
        payload
      })
    }
  }
  if(actionsTriggered == 0) {
    console.log(`trigger "${trigger}" did not trigger any action`);
  }
}

export {
  registerAction,
  registerActions,
  executeTrigger
};