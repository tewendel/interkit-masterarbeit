# The process of creating an app

Creating an app is a multi-stage process that often involves several people with different responsibilities. It starts with conceptualizing your idea and ends with a finished app that you can share with others.

--- 

## Stage 1: Planning

### Concept - what do you want to do?

- think about goals and objectives 
    - information
    - knowledge transfer
    - encounter
    - exchange
    - encourage participation
    - collecting
    - ...
- conceptualize how the users interact with the experience
- think about the progression of the experience
    - How does the experience start?
    - How does it end?
    - How does it develop?
- timing
    - How long should the experience last? Once? ongoing? Again and again?
- define interactions among users (if there are any)
    - Multiuser chat?
    - Leaving or receiving messages?
    - Visiting same places at the same time?
    - Sharing content?
- consider interactions between users and their environment
    - Where should the experience take place? In public space? Indoor?

### Implementation - how can you do it with interkit?

Before you start building your app, you should think about how to structure it in the framework of interkit.

- Check the templates for similar apps and how they are done
- [Define your "elements"](./build_app)
- Think about the layout of your app
    - Which screens do you need?
    - Check if suitable components exist
    - Think about the interactions between the screens and components - what happens on which tap?
- Determine if you need the `Story` section
    - User generated content? -> yes
    - Chat interaction? -> yes
    - Chatbot? -> yes
    - User log in? -> yes
- Be aware of the privacy implications and responsibilities connected to the design choices of the experience [link to guide]

--- 

## Stage 2: Building

### Build the App Structure

Sections `App` and `Data`

- create a new project
- setup components 
    - Do you need a list of elements?
    - Do you need a single element view?
    - map, menu, chat, ... 
- set up routing
- set up component [actions](../components/actions) (optional)
- set up database sheets
- connect components to database sheets

### Insert the Content

Sections `Data` and `Media`

- add and edits texts
- upload images
- upload audio
- upload video
- upload 3d assets

### Story (optional)

Section `Story`

Design Chat interaction and server-side actions.

- write interactions in the chat interface
- add chat channels and bots
- add server-side actions
- connect external services
- use [cron](../guides/cron_setup) for global timed actions

### Styling
Tweak visual appearance of the app  
[...]

### Testing

It is a good idea to have people test your app, gather feedback and improve it. 
[...]

--- 

## Stage 3: Publishing

### Legal

- add imprint
- add data protection declaration (if necessary)
- add privacy policy (if necessary)
- add terms of use (if necessary)
- add license information (if necessary)
- add credits (if necessary)
- add contact information (if necessary)

### Internationalization (optional)

see [Internationalization guide](../guides/i18n)  
[...]

### Deployment

Publish App  
[...]

optinal: App Store and Play Store 

--- 

## Stage 4: Maintaining

### Moderation
Moderate users and user generated content (optional)  
[...]
