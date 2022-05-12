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

// send an image message to player
// (to get its key, go to Media tab, open ⋮ menu, copy key)
api.sendImage("f00ba420-0123-4567-89abcdef012356789")

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
await api.setUserVar("name", "alice")







`



