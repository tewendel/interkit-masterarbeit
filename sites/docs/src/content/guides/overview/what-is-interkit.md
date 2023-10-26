# What is interkit?

interkit is a toolkit for mobile apps in playful art and cultural projects - with features like map, audio player, archive and chat.

At the heart of Interkit is a self-hosted, web-based authoring system that allows apps to be assembled from a growing collection of predefined components, media to be uploaded, interactions to be designed, and content to be managed in a database. Apps can be published as mobile websites, as a PWA, or through app stores.

Interkit was created for museums, cultural institutions large and small, and anyone who wants to design aesthetic and social experiences between spaces and the people who are there. The tool makes it possible to build your own applications without prior programming experience. At the same time, it remains possible for developers to code their own extensions.

## For cultural project managers

Here are some basic things to know:
- Interkit runs on a server managed by your organisation. You will need someone with technical expertise [to install it](/guides/howto/server_setup).
- Your team can then use a [web-based authoring interface](/guides/overview/interface_overview) on desktop computers to create apps for mobile devices.
- Your audiences can access these apps by visiting specific urls or scanning qr codes with their phones. You can also publish your app in the app stores, but this requires more effort.
- You can base your apps off of templates that come with the system, covering common use cases like a museum guide with audio.
- You can also build new apps based on predefined components. For this, you will have to familiarise yourself with the component system, for example by going through the [tutorial](/guides/tutorials/intro).

## For developers

Interkit uses a few different technologies under the hood:
- The server is  based on <a href="https://www.meteor.com/" target="_blank">Meteor</a>, which provides real time database updates, media and user management.
- The authoring system is based on <a href="https://svelte.dev/" target="_blank">Svelte</a>, <a href="https://carbon-components-svelte.onrender.com/" target="_blank">Carbon Components</a> and <a href="https://developers.google.com/blockly/" target="_blank">Blockly</a>.
- You can install interkit using <a href="https://www.docker.com/" target="_blank">Docker</a>.
- The apps you create using the authoring system are Svelte-based Single Page Applications (SPA), assembled from pre-built components. You can expand the system by writing your own Svelte components
- Each app can optionally include a Node-based project server for managing multi-user chat interactions, including variables of different scope.
- You can distribute your apps as PWA or through the app stores using Capacitor.

## For artists

## For visual designers