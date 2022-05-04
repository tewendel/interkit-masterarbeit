export const cheatsheetContents = 
`
export const onArrive = async (api) => {
  // do something
} 

export const onMessage = async (msg, api) => {
  // do something
} 

// move player to a different node on the same board
api.moveTo("node1")

// send a text message to player
api.sendText("hello")

// add a label
api.sendText("hello", {label: "bot"})

// respond to text in onMessage
if(msg.payload.text == "foo") {
  // do something
}

// send a choice
api.sendChoice({
  a: "option a",
  b: "option b"
})

// respond to a choice
if(msg.payload.key == "a") {
  // do something
}

// forward a message to other users currently in this node, uses user variable "name" as label
api.echo(msg)

// get a variable for this user
await api.getUserVar("name")

// set a variable for this user
await setUserVar("name", "alice")







`



