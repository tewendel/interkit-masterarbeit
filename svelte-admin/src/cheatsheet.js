export const cheatsheetContents = 
`
const onArrive = async (api) => {
  // do something
} 

const onMessage = async (msg, api) => {
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








`



