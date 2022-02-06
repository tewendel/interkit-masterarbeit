const send = function(text) {
  const {message, server, projectId} = this
  // console.log(this)
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

export default {
  send
}