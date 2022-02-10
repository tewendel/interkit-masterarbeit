
const subscribeMessages = async (server, projectId) => {
  let messagesSub = server.subscribe("messages.unhandled", { projectId });
  await messagesSub.ready();

  let reactiveMessagesCollection = server.collection('messages').reactive();
  return reactiveMessagesCollection
}

const setupMessageHandling = async ({
    handlers, 
    projectApi, 
    server, 
    projectId
  }) => {

  let handledMessageIds = [] // remember handled messages
  let reactiveMessagesCollection = await subscribeMessages(server, projectId)

  reactiveMessagesCollection.onChange(async (messages) => {
  // TODO: sort by date to ensure that the newest message is processed first
  const unhandledMessages = messages.filter(message => !handledMessageIds.includes(message.id))
  // prevent not handling over double handling by blocking second execution before processing
  handledMessageIds.push(...unhandledMessages.map(message => message.id))
  for (let message of unhandledMessages) {
    let handledBy = []
    // put interkit objects in api that gets passed to handler
    const api = {...projectApi, message, server, projectId}
    // handle each message
    for (let handlerName in handlers) {
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
    }
    try {
      await server.call("message.setHandled", { messageId: message.id, handledBy })
    } catch (e) {
      console.error(e)
    }
  }
  });
}



export {
  setupMessageHandling
}