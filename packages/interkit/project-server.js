import { lib as boardNodeUtil } from './project-boards-nodes.js'

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

// goes over users and boards and processes any pending arrivals
const processUserArrivals = async (server, projectId, projectApi, handlers, users, boards, boardData) => {
  //console.log("processUserArrivals", users);

  for(let user of users) {
    let boardState = user?.projectUserData[projectId]?.boardState;
    
    //console.log("boardState", user, boardState)
    if(!boardState) {
      //console.log("no boardState defined for this user - initialising...")
      boardState = await initialiseBoardState(server, projectId, user.id, boardData);
      continue;
    }

    for(let boardId of boards) {

      const updatedProjectData = await server.call("user.getProjectUserData", {userId: user.id, projectId})
      const updatedBoardState = updatedProjectData?.boardState;
 
      if(updatedBoardState?.[boardId]) {

        // console.log("got updatedBoardState for", boardId, updatedBoardState?.[boardId])

        // user is just arriving
        if(updatedBoardState[boardId].status == "arriving") {

          // updating arrival in boardState so that this never runs twice
          const result = await setArrivalStatus(server, projectId, user.id, updatedBoardState, boardId, updatedBoardState[boardId].nodeId, "arrived")
          console.log("status updated, now running onArrive", result)

          let nodeId = updatedBoardState[boardId].nodeId;
          
          console.log(`user ${user.id} arriving in node ${nodeId} on board ${boardId}`)
          
          const api = {
            ...projectApi, 
            server, 
            projectId, 
            userId: user.id,
            boardId,
            message: {channel_key: boardId, sender: user.id}
          }

          let handlerName = boardId + "_" + nodeId;
          
          if (handlers[handlerName]?.onArrive) {
            await handlers[boardId + "_" + nodeId]?.onArrive(api)
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

  // read boards from file system and get info for each
  
  const boards = await boardNodeUtil.boards.list("./handlers");
  // console.log("project server found boards: ", boards);

  const boardData = {};
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
      
      // put interkit objects in api that gets passed to handler
      const api = {
        ...projectApi, 
        message, 
        server, 
        projectId, 
        userId: message?.sender,
        boardId,
        nodeId: currentNodeId
      }

      if(currentNodeId) {

        let handlerName = boardId + "_" + currentNodeId
        if (handlers[handlerName].onMessage) {
          console.log(`handling message ${message.id} with ${handlerName}`)
          // allow parallel execution... should handler be required to be synchronous and return something?
          handlers[handlerName].onMessage(message, api)
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

  // subscribe to users to watch for boardState changes and run onArrive handlers
  let reactiveUsersCollection = await subscribeUsers(server, projectId)
  
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
