# InterkitClient

InterkitClient is a collection of methods commonly used to interact with the system.

Warning: It is in the process of being cleaned up, simplified and documented. Proceed with caution.

See <a href="https://gitlab.interkit.app/interkit/interkit-experiments/-/blob/v04/packages/interkit/interkit-client.js" target="_blank">source code</a>

## Table of contents

## UI Keys

Getting and setting UI Keys.

```js
  InterkitClient.setUiKey("menuOpen", true)
```

```js
  InterkitClient.getUiKey("menuOpen")
```

## Data Annotations

Getting and setting Data Annotations (formerly called element properties)

```js
  InterkitClient.setElementProperty("9b59b249-3d9f-4335-905c-260291e1237f", "bookmarked", true)
```

```js
  InterkitClient.getElementProperty("9b59b249-3d9f-4335-905c-260291e1237f", "bookmarked")
```

## User Variables

Setting User Variables.

```js 
  InterkitClient.setUserVar("name", "alice")
```

Getting user variables currently needs to be done with [server methods](#server-methods)

## Database

Load all rows in a database sheet

```js 
  await InterkitClient.getRows("elements")
```

Get a reactive store for rows in a database sheet

```js 
  const rows = await InterkitClient.getRowSubStore("elements")
```

Further database operations currently need to be done with [server methods](#server-methods)


## Media Files

Loading metadata for a media file identified by it's key

```js
  await InterkitClient.getMediaFile("9b59b249-3d9f-4335-905c-260291e1237f")
```

## Playback audio

Plays audio of the correct language in the floating player, assuming audio is stored in column "elements/audio$lang".

```js
  import { lang } from 'interkit/i18n.js';
  import { get } from 'svelte/store'

  await InterkitClient.playFloatingAudio(
    arg.payload.elementRow, 
    "elements/audio$" + get(lang)
  )
```

## Server Methods

Call a server method. projectId is added to methodParams automatically.

```js
  await InterkitClient.call("methodName", methodParams)
```

Further documentation needed. See <a href="https://gitlab.interkit.app/interkit/interkit-experiments/-/tree/v04/meteor-server/server/methods" target="_blank">source code</a> for the available methods.