import { lib as boardNodeUtil } from './project-boards-nodes.js'

let boardData;

const subscribeMessages = async (server, projectId) => {
  let messagesSub = server.subscribe("messages.unhandled", { projectId });
  await messagesSub.ready();

  let reactiveMessagesCollection = server.collection('messages').reactive();
  return reactiveMessagesCollection
}

const subscribeUnselected = async (server, projectId) => {
  let messagesSub = server.subscribe("choices.unselected", { projectId });
  await messagesSub.ready();

  let reactiveMessagesCollection = server.collection('messages').reactive();
  return reactiveMessagesCollection  
}

const subscribeUsers = async (server, projectId) => {
  let usersSub = server.subscribe("projectUsers", { projectId });
  await usersSub.ready();

  let reactiveUsersCollection = server.collection('users').reactive();
  return reactiveUsersCollection 
}

let scheduledEvents;
const subscribeScheduledEvents = async (server, projectId) => {
  const events = server.subscribe("scheduled_events", { projectId });
  await events.ready();
  scheduledEvents = server.collection('scheduled_events').reactive();
}

// this is called regularly and checks if any events need to be processed
const processEvents = async (server) => {

  // retrieve the events;
  const events = scheduledEvents.data();
  const now = new Date();
  if(events.length) {
    console.log("scheduled events: ", events.length)
  }
  const eventsToProcess = events.filter(e => e.status == "scheduled" && e.execTime.getTime() < now.getTime())
  if(eventsToProcess.length) {
    console.log("now processing:", eventsToProcess);
  }
  for(let event of eventsToProcess) {
    // set event status to done
    await server.call("events.setDone", {_id: event.id})

    // call the method
    await server.call(event.method, event.payload)    
  }
}


// updates the boardState of a user on the server
const updateBoardState = async (server, projectId, userId, boardState) => {
   return await server.call("user.updateUserProjectData", {
    userId,
    projectId,
    key: "boardState",
    value: boardState
  })
}

// sets up a fresh boardState on a new user
const initialiseBoardState = async (server, projectId, userId, boardData) => {

  console.log("initialiseBoardState");
  let boardState = {};
  for(let board in boardData) {
    boardState[board] = {
      nodeId: boardData[board].startId,
      status: "arriving"
    }
  }
  console.log("no boardState yet, initializing to", boardState)
  await updateBoardState(server, projectId, userId, boardState);
  return boardState;
}

// updatess the arrival status of a user in a node on a board
const setArrivalStatus = async (server, projectId, userId, boardState, boardId, nodeId, status) => {
  let newBoardState = {...boardState}
  newBoardState[boardId].nodeId = nodeId
  newBoardState[boardId].status = status
  const result = await updateBoardState(server, projectId, userId, newBoardState);
  //console.log("setArrivalStatus", result)
  return result
}

// checks which node the user is on for a current node
const checkCurrentNode = async (server, userId, projectId, boardId, boardData) => {

  let projectUserData = await server.call("user.getProjectUserData", {
    userId,
    projectId
  });
  let boardState = projectUserData?.boardState;
  
  // check if boardState needs to be initialised  
  if(!boardState) {
    await initialiseBoardState(server, projectId, userId, boardData);
  } else {
    if(boardState[boardId]?.status == "arrived") {
      return boardState[boardId].nodeId;
    }
  }
}

// we need to make sure this function cannot be called multiple times at almost the same time 
let processingQueue = [];
let processingQueueRunning = false;
const processUserArrivals = async (server, projectId, projectApi, handlers, users, boards, boardData) => {  
  processingQueue.push({
    server, projectId, projectApi, handlers, users, boards, boardData      
  })
  await executeQueue();
}

const executeQueue = async () => {
  if(!processingQueueRunning && processingQueue.length) {
    processingQueueRunning = true;
    await doProcessUserArrivals(processingQueue[0]);
    processingQueue.shift();
    processingQueueRunning = false;
    await executeQueue();
  }
}

/** adds the translate t function to api passed to onArrive + onMessage
 * (it needs information from both project-api and project-server,
 * so has to be "strapped on later". e.g. it needs both sendText AND userLang)
 * also adds the sendTextT shortcut/helper, api.sendTextT(foo, bar) = api.sendText(t(foo, bar))
 * returns the t function so it can be passed as argument, too
 */
const i18nifyApi = api => {
  const t = texts => {
    if (typeof texts === 'string' && texts.indexOf('|') > -1) {
      /* pipe-separated string-list given */
      texts = texts.split('|')
    }
    let text = '(sendTextT error 0)'
    if (typeof texts === 'object' && texts.length) {
      /* array-ish given */
      if (typeof api.userLangIndex !== 'number') {
        text = '(sendTextT error 10)'
        console.error('api.sendTextT error, userLangIndex is not number', api.userLangIndex)
      } else {
        text = texts[api.userLangIndex]
        if (text === undefined) {
          text = '(sendTextT error 20)'
          console.error('api.sendTextT error, userLangIndex\'d text undefined', api.userLangIndex, texts)
        }
      }
    } else if (typeof texts === 'object') {
      /* object-ish given */
      if (!api.userLang) {
        text = '(sendTextT error 30)'
        console.error('api.sendTextT error, userLang invalid?', api.userLang)
      } else {
        text = texts[api.userLang]
        if (text === undefined) {
          text = '(sendTextT error 40)'
          console.error('api.sendTextT error, userLang\'d text undefined', api.userLang, texts)
        }
      }
    } else {
      console.error('api.sendTextT error, got neither object nor array', typeof texts, texts)
      text = texts?.toString() || '(sendTextT error 90)'
    }
    return text
  } 
  api.t = t
  api.sendTextT = (texts, options) => api.sendText(t(texts), options)
  api.sendChoiceT = (choices, options) => {
    const choicesT = {}
    for (const key in choices) {
      choicesT[key] = t(choices[key])
    }
    return api.sendChoice(choicesT, options)
  }
  return t
}

// goes over users and boards and processes any pending arrivals
const doProcessUserArrivals = async ({server, projectId, projectApi, handlers, users, boards, boardData}) => {  
  //console.log("processUserArrivals", users);
  
  for(let user of users) {
    if (!user?.projectUserData) continue; // skip user that don't have project, especially the projectserver login user
    let boardState = user?.projectUserData[projectId]?.boardState;
    let userLang = user?.projectUserData[projectId]?.lang;
    let userLangIndex = user?.projectUserData[projectId]?.langIndex;
    
    //console.log("boardState", user, boardState)
    if(!boardState) {
      //console.log("no boardState defined for this user - initialising...")
      boardState = await initialiseBoardState(server, projectId, user.id, boardData);
      continue;
    }

    for(let boardId of boards) {

      if(boardState?.[boardId]) {

        // user is just arriving
        if(boardState[boardId].status == "arriving") {

          // make sure we have the updated information on this to prevent multiple onArrive calls
          const updatedProjectData = await server.call("user.getProjectUserData", {userId: user.id, projectId})
          console.log("loaded updatedProjectData", updatedProjectData)
          const updatedBoardState = updatedProjectData?.boardState;
          if(updatedBoardState[boardId].status != "arriving") return
 
          // updating arrival in boardState so that this never runs twice
          const result = await setArrivalStatus(server, projectId, user.id, updatedBoardState, boardId, updatedBoardState[boardId].nodeId, "arrived")
          console.log("status updated, now running onArrive", result)

          let nodeId = boardState[boardId].nodeId;
          
          console.log(`user ${user.id} arriving in node ${nodeId} on board ${boardId}`)

          // check if node exists
          const nodeIds = boardData[boardId].nodes.map(n => n.id)
          // console.log("checking if node exists in", nodeIds);
          if(!nodeIds.includes(nodeId)) {
            console.log("warning: moving user into non-existant node, moving to starting node", boardData[boardId].startId)
            nodeId = boardData[boardId].startId;
            await setArrivalStatus(server, projectId, user.id, boardState, boardId, nodeId, "arrived")
          }
          
          const api = {
            ...projectApi, 
            server, 
            projectId, 
            userId: user.id,
            userLang,
            userLangIndex,
            boardId,
            message: {channel_key: boardId, sender: user.id}
          }

          const t = i18nifyApi(api)

          let handlerName = boardId + "_" + nodeId;
          
          if (handlers[handlerName]?.onArrive) {
            await handlers[boardId + "_" + nodeId]?.onArrive(api, t)
          } else {
            console.warn(`handler ${handlerName} has no onArrive method`)            
          }
        }

      } else {
        // this board is not initialized for user  

      }
   
    }
  }

}

const setupMessageHandling = async ({
    handlers, 
    projectApi, 
    server, 
    projectId
  }) => {

  let handledMessageIds = [] // remember handled messages
  let reactiveMessagesCollection = await subscribeMessages(server, projectId)

  // subscribe to users to watch for boardState changes and run onArrive handlers
  let reactiveUsersCollection = await subscribeUsers(server, projectId)
  // read boards from file system and get info for each
  
  const boards = await boardNodeUtil.boards.list("./handlers");
  // console.log("project server found boards: ", boards);

  boardData = {};
  for(let board of boards) {
    boardData[board] = await boardNodeUtil.boards.readFromProject(projectId, board)
  }
  // console.log("project server found board data: ", boardData);

  // this gets called many times, for each message that is found through the subscriptions
  reactiveMessagesCollection.onChange(async (messages) => {

    // console.log("messages onChange", messages)

    // TODO: sort by date to ensure that the newest message is processed first
    const unhandledMessages = messages.filter(message => !handledMessageIds.includes(message.id))
    // because onChange gets called with all messages each time a new message appears, 
    // and this can happen while a message is being processed, we make sure to handle each only once

    // before processing, we add the message to handledMessageIds - so that we don't process it again if
    // this function is called again before processing is complete
    handledMessageIds.push(...unhandledMessages.map(message => message.id))
    
    // handle each unhandled message
    for (let message of unhandledMessages) {
      console.log("handling message", message)
      
      let handledBy = []

      // determine board
      let boardId = message.channel_key;
      console.log("determined board", boardId);

      // check which node the user is on
      let currentNodeId = await checkCurrentNode(server, message?.sender, projectId, boardId, boardData)
      console.log("determined current node", currentNodeId)

      const userId = message?.sender
      // using _rawData, we don't need reactivity here, hopefully faster?
      const projectUserData = userId
        ? reactiveUsersCollection._rawData?.find(_ => _.id === userId)?.projectUserData?.[projectId]
        : undefined
      const userLang = projectUserData?.lang
      const userLangIndex = projectUserData?.langIndex
      
      // put interkit objects in api that gets passed to handler
      const api = {
        ...projectApi, 
        message, 
        server, 
        projectId, 
        userId,
        userLang,
        userLangIndex,
        boardId,
        nodeId: currentNodeId
      }

      const t = i18nifyApi(api)
      if(currentNodeId) {

        let handlerName = boardId + "_" + currentNodeId
        if (handlers[handlerName]?.onMessage) {
          console.log(`handling message ${message.id} with ${handlerName}`)
          // allow parallel execution... should handler be required to be synchronous and return something?
          handlers[handlerName].onMessage(message, api, t)
          handledBy.push(handlerName)
          //if (handlers[handlerName].onMessage(message)) {
          //    successfullyHandledBy.push(handlerName)
          //}
        } else {
          console.warn(`handler ${handlerName} has no onMessage method`)
        }      
      } else {
        console.log("user does not have a current node, message not handled!")
      }

      // save handled state to server so it is not handled again
      try {
        await server.call("message.setHandled", { messageId: message.id, handledBy })
      } catch (e) {
        console.error(e)
      }
    
    }
  });
  
  // process on first load
  await processUserArrivals(server, projectId, projectApi, handlers, reactiveUsersCollection.data(), boards, boardData);
  
  // process on each change
  reactiveUsersCollection.onChange(async (users) => {
    //console.log("users collection onChange")
    await processUserArrivals(server, projectId, projectApi, handlers, users, boards, boardData);
  })

  // subscribe to scheduled events and process regularly
  await subscribeScheduledEvents(server, projectId);
  await processEvents(server);
  setInterval(()=>{processEvents(server)}, 2000);
}



export {
  setupMessageHandling,
}
