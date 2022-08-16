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

// advanced: move player on a different board
api.moveTo("node1", {channelKey: "board2"})

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

// delays (this works for sentText, sendChoice, sendImage and moveTo)
api.sendText("hello", {delay: 10}) // send the message 10 seconds later
api.sendText("hello", {delay: {hours: 1, minutes: 30}}) // 1 hour, 30 minutes later

// forward a message to other users currently in this node, uses user variable "name" as label
api.echo(msg)

// get a variable for this user
await api.getUserVar("name")

// set a variable for this user
await api.setUserVar("name", "alice")

// set an save a property about an element for this user, for example "discovered"
await api.setElementProperty("f00ba420-0123-4567-89abcdef012356789", "discovered", true)

// set a user specific property on a channel (eg to hide a channel for specific user)
await api.setChannelProperty("board1", "unlisted", true)

// load rows from a sheet
await api.getRows("elements")

// add a row to a sheet
await api.addRow("elements", {title: "hello"})

// update a row
await api.updateRow("elements", "rowKey", {title: "bye"})

// hide the interface for sending messages (persists for each board)
api.setInterface({text: false})
api.setInterface({text: true}) // turn is back on 

// present the user with a button to send their location
api.requestLocation("Send Location", {cancel: "Cancel"}) // you can also leave the cancel option blank

// respond to location
if(msg.payload.type == "locationResponse") {
  // do something
  if(api.distance(msg.payload.location, {lat: 56, lng: 12}) < 100) {
    api.sendText("you're close!")
  }
}
if(msg.payload.type == "locationRequestCanceled") {
  api.sendText("ok")
}

/* translation, multi-language (i18n, l10n) */

// access current language
api.sendText('your language: ' + api.userLang)
api.sendText('your language, index: ' + api.userLangIndex)

// use current language
if (api.userLang === 'en') ...
if (api.userLangIndex === 1) ...
let text1 = ['Deutsch', 'Englisch'][api.userLangIndex]
let text2 = {de: 'Deutsch', en: 'Englisch'}[api.userLang]

// use text localized to current user language
export const onMessage = async (msg, api, t) => {
  api.sendChoice({ a: t('Ja|Yes'), b: t('Nein|No') })
}

// the t helper function takes pipe-separated strings, arrays or objets:
api.sendText(t('Ja|Yes'))
api.sendText(t(['Ja', 'Yes']))
api.sendText(t({ de: 'Ja', en: 'Yes' })) // order-independant

// use sendTextT shortcut, equivalently
api.sendTextT('Tschüß|Bye')

`



