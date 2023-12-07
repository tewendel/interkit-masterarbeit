# Twinish

Twinish is a limited, simplifed syntax loosely inspired by the interactive fiction tool <a href="http://twinery.org" target="_blank">Twine</a>. 

It is meant for the rapid writing of branching narratives without complex logic.

You can combine twinish and javasciprt nodes in the same board. Internally, twinish is translated into javascript that you can see in the lower part of the editor.

## Table of contents

## Sending messages

Every line becomes a message. An empty newline separates text into separate messages.

<!-- FIXME there is no "plain" or txt language for the highlighter,
  empty crashes the sveltekit server. Ugly workaround with a JS string,
  due to problems with &gt; when using <code>, and other mysterious syntax errors...
-->

```js
This is a message.

This is another message.
```

All text messages are placed in the `onArrive` method and sent one after the other when a user enters a node. 

## Present options to move to different nodes

A common pattern for twinish is to present some text and then give the user options. When the user clicks on one of the options, they are moved to a different node.

A Twine link, like `[[nodeName]]`, will become an option button that executes a moveTo to nodeName.
```js
[[node1]] [[node2]]
```

This wil present two buttons, leading to `node1` or `node2`.

You can specify what text should appear on each button using `|` `->` or `<-`. These are all equivalent:
```js
[[Go Home|node1]] 
[[Go Home->node1]] 
[[node1<-Go Home]]
```

For [i18n](/guides/howto/i18n) you can use this syntax:
```js 
[[Nach Hause|Go Home|homeNode]]
[[Nach Hause|Go Home->homeNode]]
[[homeNode<-Nach Hause|Go Home]]
```

Note: In paragraphs that contain links, all other text will be ignored.

## Move directly to a node

You can move a player directly to a node. This results in a `moveTo` command in the `onMessage` method, meaning the player will be moved in response to any message.

```js
[->node1]
```

## Passing through javascript

You can use `[script]` to insert javascript into your twinish. The javscript ends with the next newline.

```js
[script]
 console.log('foo');
 console.log('bar');
```

## Adding javascript options

Twine paragraphs (message+moveTos) can take javascript options. See the [javascipt api](/reference/chat/javascript_api) for details.

```js
Hello world[{"delay":10}]
[->To home][{"delay":{"hours":1}]
Give me a photo[{"setInterface":{"photo":true}}]
```