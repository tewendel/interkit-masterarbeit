# Javascript API

## Table of contents

## onArrive and onMessage

Each node must contain one `onArrive` and one `onMessage` function. 

`onArrive` is called when the user enters the node for the first time.

```js
export const onArrive = async (api) => {
  /* place your code here */
} 
```

`onMessage` is called each time the user sends a message or makes a choice.

```js
export const onMessage = async (msg, api) => {
  /* place your code here */
} 
```

The code that defines the behaviour of the node is placed between the `{` and `}`

In the `Handlers` tab, these functions are provided automatically for you. 

## moveTo

Move the player to a different node on the same board:

```js
api.moveTo("node1")
```

Advanced: Move the player on a different board:

```js
api.moveTo("node1", {channelKey: "board2"})
```
This does not change the node on the current board.

## Sending messages

### sendText

Sends a text message to the player.
```js
api.sendText("hello")
```

### sendImage

Sends an image message to the user.

```js
api.sendImage("f00ba420-0123-4567-89abcdef012356789")
```

The first parameter is the media file key. To get the media file key, go to the Media tab, open ⋮ menu, copy key.

Images are normally scaled and cropped to fit ("cover" mode). To make sure that everything on the image is visible, you can switch to "contain" mode:

```js
api.sendImage(
  "f00ba420-0123-4567-89abcdef012356789", 
  { objectFit: "contain" }
)
```

Images are by default zoomable (enlarge on click or tap). Prevent zoom:

```js
api.sendImage(
  "f00ba420-0123-4567-89abcdef012356789", 
  { zoomable: false }
)
```

Send an image with a link that the user can click on:

```js
api.sendImage(
  "f00ba420-0123-4567-89abcdef012356789", 
  { url: "https://docs.interkit.app/" }
)
```

Trigger an [action](/guides/howto/actions) on the client by clicking an image

```js
api.sendImage(
  "f00ba420-0123-4567-89abcdef012356789", 
  {action: {trigger: "triggerName", payload: payloadObject}}
)
```

### sendAudio

```js
api.sendAudio("e4770840-3c2e-4eeb-b59b-a0e15e14190b")
```

The first parameter is the media file key. To get the media file key, go to the Media tab, open ⋮ menu, copy key.

Autoplay the audio when the message arrives
```js
api.sendAudio("mediafileKey", { autoplay: true })
```

You can send audio to the floating popout player using the `target` option. Hoewver, this is a bit different as the floating player does not expect a media file key but a database row and a column that contains the audio. Note that the `audioColumn` option is required and contains the key of the sheet 
and the kay of the column, separated by a `/`.

```js
// Get the row from the database
const element = await api.getRow("b7905d1c-b567-4801-80be-b7c6e749ad7a")
api.sendAudio(null, { 
  target: "popout", 
  element: element, 
  audioColumn: "elements/audio" 
})
```


### sendVideo

```js
api.sendVideo("b94eb8f3-72ef-476d-ad61-64adc18204e7")
```
The first parameter is the media file key. To get the media file key, go to the Media tab, open ⋮ menu, copy key.


### sendChoice

Send a choice, presented as multiple choic buttons.

```js
api.sendChoice({
  a: "option a",
  b: "option b"
})
```

See the [responding to messages](#responding-to-messages) section below for reponding to a choice made by a user

### sendLink

Send a link message to the user.

```js
api.sendLink("https://docs.interkit.app/")
```

Separate text from URL

```js
api.sendLink("Interkit Documentation", "https://docs.interkit.app/")
```

See [sendImage](#sendimage) to send a link with an image

### sendLocation

Send a location (Coordinates). The user can click on the location to open it in a map app.

```js
api.sendLocation("Open in map", {lat: 52.51449, lng: 13.38324})
```

### sendSystem

Send a system message das is displayed in the center of the chat. Useful for error messages or neutral informational content.

```js
api.sendSystem("Someone entered the channel")
```

### sendSystemImage

Send a system image displayed in the center of the chat.

```js
api.sendSystemImage("f00ba420-0123-4567-89abcdef012356789")
```

Set a custom width for the image
```js
api.sendSystemImage(
  "f00ba420-0123-4567-89abcdef012356789", 
  {width: "200px"}
)
```
Place the system image on either side of the chat
```js
api.sendSystemImage(
  "f00ba420-0123-4567-89abcdef012356789", 
  {placement: "me"}
)
api.sendSystemImage(
  "f00ba420-0123-4567-89abcdef012356789", 
  {placement: "other"}
)
```

## Labels

Add a label to identify a sender.
```js
api.sendText("hello", {label: "bot"})
```

You can add labels in the same way to the other types of messages.

## Delays

Use the dealy option to schedule events for later delivery. This works for sendText, sendChoice, sendImage and moveTo.

Send a message 10 seconds later
```js
api.sendText("hello", {delay: 10}) 
```

Send a message 1 hour, 30 minutes later
```js
api.sendText("hello", {delay: {hours: 1, minutes: 30}}) 
```

Send a message the "next 13 o'clock", either later today, or tomorrow (in the server's timezone!)
```js
api.sendText("hello", {delay: {nextHour: 13}}) 
```

Add between 0 and 60 minutes, randomly
```js
api.sendText("hello", {delay: {nextHour: 13, randomHours: 1}})
```

To clear all scheduled messages and moveTos for the current user, use `clearSchedule()`. Note that this does not only clear the scheduled events from this node, but all scheduled events for the user.

```js
api.clearSchedule()
```

## Responding to messages

The `onMessage` method receives a msg parameter that you can evaluate to respond conditionally to messages.

```js
if(msg.payload.text == "foo") {
  // do something
}
```

If the user made a [multiple choice](#sendchoice) selection, the key attribute on `msg.payload` will be set.

```js
if(msg.payload.key == "a") {
  // do something
}
```

`msg.payload.type` contains information about the type of message that the user sent.

## echo

To create, multiplayer chatrooms, you need to forward incoming messages to other users.

`echo` forwards a message to other users currently in the same node.
```js
api.echo(msg)
```
The user variable "name" is used by default as a label.

`msg` is supposed to be a whole message object like the one received in `onMessage(api, msg)`. 

## Sending to specific recipients

By default, the recipient of a message sent by any `api.send...()` function is the current user.

All `api.send...()` functions accept further options to specify the recipients:

      - `channelKey` optionally send this message on a different channel
      - `recipients` an array of recipients user ids.

```js
api.sendText("hello", {
  channelKey: "other_board",
  recipients: ["ohpppdsCZ9CXZ4Ds4", "bREC5nMSLoRNjSRn3"], 
})
```

To broadcast a message to all users that are currently in a node, specify the nodeId inside the recipients

```js
api.sendSystem("The bus will arrive in 5 minutes", {
  recipients: {
    nodeId: "waitingforthebus"
  }
})
```

You can also get the explicit list of users in a node with `api.getUsersInNode({ channelKey, nodeId })`. To get a list of userIds, map the users to their userIds.

```js
const users = await api.getUsersInNode({ channelKey: "board2", nodeId: "start" })
const userIds = users.map(user => user._id)
```

## Moving other players

While `api.moveTo()` moves the current user by default, you can add a list of `recipients` to move other users.

```js
api.moveTo(
  "node1",
  {
    recipients: ["ohpppdsCZ9CXZ4Ds4", "bREC5nMSLoRNjSRn3"],
  }
)

`recipients` is a list of user IDs.

The `nodeId` always relates to the node on the board where `moveTo` is called. Optionally add a `channelKey` to explicitly move users on a different board.

Recipients can be defined as users in a node. Example: Move all users from node "start" to node "end" on the board "board2".

```js
api.moveTo(
  "end",
  {
    channelKey: "board2",
    recipients: {
      nodeId: "start",
      channelKey: "board2"
    },
  }
)
```

### Alternative notation

The function `moveUsers` is a shorthand for `moveTo` with the `recipients` as the second argument.

```js
api.moveUsers("node1", ["ohpppdsCZ9CXZ4Ds4", "bREC5nMSLoRNjSRn3"])
```

## Variables

Set a variable for this user, for example set the user's "name" to "alice".
```js
await api.setUserVar("name", "alice")
```

Get a variable for this user, for example the variable called "name"
```js
await api.getUserVar("name")
```

These operations read from the database, so await is needed.

There are "magic" variables, see "Restarting" below.

## Restarting (by resetting other players)

Set a user's `userVar` `resetRequested` to `true` to signal their device to reset.
Their client will reset as soon it "sees" the signal
(like when they re-open a tab, or launch the app).  
When a client reacts, it

1. sets its `userVar` to a timestamp, signaling back it has *read* the request
   (the timestamp is currently not used in user-friendly way,
   but it can be examined in Project/users table, User vars column)
2. clears localStorage (thus "forgetting" its userId)
3. reloads the tab (it then receives a new userId)

There is a batch helper variant of this function, intended for admin-like users:

```js
const affectedUserCount = await api.requestResetAllOtherUsers()
```

will set the magic signal userVars for all *other* (i.e. presumably non-admin) users.  
The return value does not reflect how many users/devices were *successfully* reset,
only how many were *newly* requested to do so
(this excludes users/devices where a request is pending).

## Database rows

Load rows from a sheet
```js
await api.getRows("elements")
```
Load one row from a sheet (by row key)
```js
await api.getRow("rowKey")
```


Add a row to a sheet
```js
await api.addRow("elements", {title: "hello"})
```
Update a row (replaces the whole row)
```js
await api.updateRow("elements", "rowKey", {title: "bye"})
```
Update single values in a row (keeps existing values, only overwrites the one you provide)
```js
await api.updateRowValue("elements", "rowKey", "colKey", "value")
//example:
await api.updateRowValue("elements", "rowKey", "title", "bye")
```

These operations read from the database, so await is needed.

## Data annotations

Set or get a data annotation (formerly called element properties) about an element for this user. Data annotations are user specific data that is added to database rows, for example bookmarks.

The first parameter is the row key, the second the annotation name, the third, the value you want to set.

```js
await api.setElementProperty("f00ba420-0123-4567-89abcdef012356789", "discovered", true)
await api.getElementProperty("f00ba420-0123-4567-89abcdef012356789", "discovered")
```

These operations read from the database, so await is needed.

## Interface

You can set what interface the chat could display to the user. For example if you want users to be able to take photos or not. These settings persist across nodes per board. 

The default is text entry, with photo turned off.

Hide the interface for sending messages:
```js
api.setInterface({text: false})
api.setInterface({text: true}) // turn it back on 
```

Allow user to take pictures and send them into chat:
```js
api.setInterface({text: true, photo: true}) // text and photo entry
api.setInterface({text: false, photo: true}) // just photo entry
```

Set preferred camera (front or back):
```js
api.setInterface({photo: true, cameraFacingMode: "environment"}) // or "user" for selfie mode
```

The interface can be also set per message.

```js
api.sendText('Give me a photo', { setInterface: { photo: true, text: false } })
```

## Location

To get a user's location, we can present the user with a button that enables them to send their location.

```js
api.requestLocation("Send Location", {cancel: "Cancel"}) // you can also leave the cancel option blank
```

Responding to a location looks like this

```js
if(msg.payload.type == "locationResponse") {
  // do something
  if(api.distance(msg.payload.location, {lat: 56, lng: 12}) < 100) {
    api.sendText("you're close!")
  }
}
if(msg.payload.type == "locationRequestCanceled") {
  api.sendText("ok")
}
```

## Translation

See the [i18n](/guides/howto/i18n) guide for general intro to interkit's i18n system.

Access the current language
```js
api.sendText('your language: ' + api.userLang)
api.sendText('your language, index: ' + api.userLangIndex)
```

Set language
```js
api.setLang('de', 1) 
```
The second argument has to match the index (0-based) in the AppBase blockly field 

Use current language
```js
if (api.userLang === 'en') ...
if (api.userLangIndex === 1) ...
let text1 = ['Deutsch', 'Englisch'][api.userLangIndex]
let text2 = {de: 'Deutsch', en: 'Englisch'}[api.userLang]
```

Use text localized to current user language
```js
export const onMessage = async (msg, api, t) => {
  api.sendChoice({ a: t('Ja|Yes'), b: t('Nein|No') })
}
```

The t helper function takes pipe-separated strings, arrays or objets:
```js
api.sendText(t('Ja|Yes'))
api.sendText(t(['Ja', 'Yes']))
api.sendText(t({ de: 'Ja', en: 'Yes' })) // order-independant
```
You can use sendTextT, sendChoiceT, sendSystemT shortcuts, equivalently
```js
api.sendTextT('Tschüß|Bye')
api.sendChoiceT({ a: 'Ja|Yes', b: ['Nein', 'No'] })
api.sendSystemT('Chat verlassen|Left the chat')
