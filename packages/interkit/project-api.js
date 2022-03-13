const send = function(text) {

  const {message, server, projectId} = this
  //console.log(this)
  server.call('message.send', {
    projectId, 
    channel_key: message.channel_key, 
    //sender, 
    recipients: [message.sender],
    origin: "handler",
    payload: {
      type: 'text',
      text,
    }
  })
}

const moveTo = function(nodeId) { 
  const {server, projectId, boardId, userId} = this

  server.call('user.moveTo', {
    projectId,
    userId,
    boardId,
    nodeId
  })

}

export default {
  send,
  moveTo
}