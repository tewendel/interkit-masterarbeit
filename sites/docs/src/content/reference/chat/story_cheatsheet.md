# Story programming cheatsheet

## Table of contents

## JavaScript

```js
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

// images are normally scaled and cropped to fit ("cover" mode). to make sure that everything on the image is visible, you can switch to "contain" mode:
api.sendImage("f00ba420-0123-4567-89abcdef012356789", { objectFit: "contain" })

// image are by default zoomable (enlarge on click or tap). prevent zoom:
api.sendImage("f00ba420-0123-4567-89abcdef012356789", { zoomable: false })

// send a clickable link
api.sendLink("https://docs.interkit.app/")
api.sendLink("Docs", { url: "https://docs.interkit.app/" })

// send an image with a link
api.sendImage("f00ba420-0123-4567-89abcdef012356789", { url: "https://docs.interkit.app/" })

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

// send a system image
api.sendSystemImage("f00ba420-0123-4567-89abcdef012356789")
api.sendSystemImage("f00ba420-0123-4567-89abcdef012356789", {width: "200px"})
// place the system image on either side of the chat
api.sendSystemImage("f00ba420-0123-4567-89abcdef012356789", {placement: "me"})
api.sendSystemImage("f00ba420-0123-4567-89abcdef012356789", {placement: "other"})

// delays (this works for sendText, sendChoice, sendImage and moveTo)
api.sendText("hello", {delay: 10}) // send the message 10 seconds later
api.sendText("hello", {delay: {hours: 1, minutes: 30}}) // 1 hour, 30 minutes later
api.sendText("hello", {delay: {nextHour: 13}}) // the "next 13 o'clock", either later today, or tomorrow (in the server's timezone!)
api.sendText("hello", {delay: {nextHour: 13, randomHours: 1}}) // add between 0 and 60 minutes, randomly

// forward a message to other users currently in this node, uses user variable "name" as label
api.echo(msg)

// get a variable for this user
await api.getUserVar("name")

// set a variable for this user
await api.setUserVar("name", "alice")

// set or get a property about an element for this user, for example "discovered"
await api.setElementProperty("f00ba420-0123-4567-89abcdef012356789", "discovered", "true")
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

// set preferred camera (front or back)
api.setInterface({photo: true, cameraFacingMode: "environment"}) // or "user" for selfie mode

// interface can be also set per message
api.sendText('Give me a photo', { setInterface: { photo: true, text: false } })

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

// trigger an action on the client by clicking an image
api.sendImage("f00ba420-0123-4567-89abcdef012356789", {action: {trigger: "triggerName", payload: payloadObject}})

// custom css class on message
api.sendImage("f00ba420-0123-4567-89abcdef012356789", {customClass: "special"})

/* translation, multi-language (i18n, l10n) */

// access current language
api.sendText('your language: ' + api.userLang)
api.sendText('your language, index: ' + api.userLangIndex)

// set language
api.setLang('de', 1) // the second argument has to match the index (0-based) in the AppBase blockly field 

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

// use sendTextT, sendChoiceT, sendSystemT shortcuts, equivalently
api.sendTextT('Tschüß|Bye')
api.sendChoiceT({ a: 'Ja|Yes', b: ['Nein', 'No'] })
api.sendSystemT('Chat verlassen|Left the chat')
```

## Twine-ish syntax

<!-- FIXME there is no "plain" or txt language for the highlighter,
  empty crashes the sveltekit server. Ugly workaround with a JS string,
  due to problems with &gt; when using <code>, and other mysterious syntax errors...
-->

```js
`ignore this first line

Hi! This is a message.

An empty newline separates paragraphs = message.

[script]console.log('This tag lets you passthru JS code');
  console.log('It\'s good to indent the next line.');
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
Give me a photo[{"setInterface":{"photo":true}}]
`
```
