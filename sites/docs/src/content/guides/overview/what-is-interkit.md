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
- The apps you create using the authoring system are Svelte-based Single Page Applications (SPA), assembled from pre-built Svelte components that you can assemble by drag and drop using a <a href="https://developers.google.com/blockly/" target="_blank">blockly</a> based interface. You can expand the system by writing your own Svelte components
- Each app can optionally include a Node-based project server for managing multi-user chat interactions, including variables of different scope. You can program the server to manage chatbots and interactive stories using a node based editor with a javascript API or a simplified syntax based on <a href="https://twinery.org/" target="_blank">Twine</a>.
- Apps can be distributed as PWA or through the app stores using <a href="https://capacitorjs.com/" target="_blank">Capacitor</a>.

## For artists and game designers

Interkit is designed to be integrated into art and cultural projects in a number of scenarios:
- Show a catalog of works that the audience can explore, using lists, carousels, categories and more.
- Present locations on a map and associate media (formatted text, images, audio, video, AR) with locations.
- Audiences can continue to listen to audio while they navigate through the app.
- Allow audiences to select, collect, unlock or bookmark content by using a QR scanner or pressing buttons.
- Using the freely programmable chatbot and interactive story functionality, you can create very elaborate forms of engagement with your audience. You can use a single channel, or add multiple channels, like contacts in a messenger application. The chats can be indiviudal single-player stories, or coordinated multi-player experiences.
- It is possible to combine the progress users make in chat with what they see in the rest of the app.
See the quick start guides and the [tutorial](/guides/tutorials/intro) for more information.

## For visual designers

The look and feel of the system can be customized in a number of ways:
- arranging components to meet your needs
- through your uploaded media assets
- styling the base design
- selecting one of multiple premade themes
- creating your own theme with CSS to create a custom appearance
See the quick start guide on [styling](/guides/quick-start/styling) for more information.
