export const cheatsheetContents = `
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

// send an image, audio or video message to player
// (to get the media file key, go to Media tab, open ⋮ menu, copy key)
api.sendImage("f00ba420-0123-4567-89abcdef012356789")
api.sendAudio("e4770840-3c2e-4eeb-b59b-a0e15e14190b")
api.sendVideo("b94eb8f3-72ef-476d-ad61-64adc18204e7")

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

// send a system message
api.sendSystem("Someone entered the channel")

// delays (this works for sendText, sendChoice, sendImage and moveTo)
api.sendText("hello", {delay: 10}) // send the message 10 seconds later
api.sendText("hello", {delay: {hours: 1, minutes: 30}}) // 1 hour, 30 minutes later
api.sendText("hello", {delay: {nextHour: 13}}) // the "next 13 o'clock", either later today, or tomorrow
api.sendText("hello", {delay: {nextHour: 13, randomHours: 1}}) // add between 0 and 60 minutes, randomly

// forward a message to other users currently in this node, uses user variable "name" as label
api.echo(msg)

// get a variable for this user
await api.getUserVar("name")

// set a variable for this user
await api.setUserVar("name", "alice")

// set or get a property about an element for this user, for example "discovered"
await api.setElementProperty("f00ba420-0123-4567-89abcdef012356789", "discovered", true)
await api.getElementProperty("f00ba420-0123-4567-89abcdef012356789", "discovered")

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
api.setInterface({text: true}) // turn it back on 

// allow user to take pictures and send them into chat
api.setInterface({text: true, photo: true}) // text and photo entry
api.setInterface({text: false, photo: true}) // just photo entry

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

// use sendTextT & sendChoiceT shortcuts, equivalently
api.sendTextT('Tschüß|Bye')
api.sendChoiceT({ a: 'Ja|Yes', b: ['Nein', 'No'] })

/** Twine-ish syntax
 *  (this is a comment because JS highlighting doesnt' make sense)
 *  See also the twine-ish new node templates.

Hi! This is a message.

An empty newline separates paragraphs = message.

[script]console.log('This tag lets you passthru JS code');\`
  console.log('It\\\'s good to indent the next line.');
  // and backticks are currently not supported here!

A Twine link, like [[nodeName]],
will become a choice with moveTo to nodeName.
We also support Twine aliases/renames:
[[Go Home|home]] [[Go Home->home]] [[home<-Go Home]]
...with i18n:
[[Nach Hause|To home|homeNode]]
[[homeNode<-Nach Hause|To home]] etc.
All other text in paragraphs with links,
like this sentence, will be ignored.

Twine paragraphs can be explicit, immediate moveTos:
[->To home]

Twine paragraphs (message+moveTos) can take options:
Hello world[{"delay":10}]
[->To home][{"delay":{"hours":1}]

*/
`;
