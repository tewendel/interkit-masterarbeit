# App creation process

Creating an app is a multi-stage process that often involves several people with different responsibilities. It starts with conceptualizing your idea and ends with a finished app that you can share with others.

## Stages

### 1. Concept

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

### 2. COmceptualizing in the framework of interkit

Before you start building your app, you should think about how to structure it in the framework of interkit.

- Check the templates for similar apps
- [Define your "elements"](./build_app)
- Determine if you need the `Story` section
    - User generated content? -> yes
    - Chat interaction? -> yes
    - Chatbot? -> yes

### 2. Build the Structure

Sections `App` and `Data`

- create a new project
- setup [components](../components)
- setup component [actions](../components/actions)
- setup database sheets
- connect components to database sheets

### 3. Content

Sections `Data` and `Media`

- add and edits texts
- upload images
- upload audio
- upload video
- upload 3d assets

### 4. Story (optional)
Design Chat interaction and server-side actions 

- write interactions in the chat interface
- add chat channels and bots
- add server-side actions
- connect external services
- use [cron](../guides/cron_setup) for global timed actions

### 5. Styling
Tweak visual appearance of the app  
[...]

### 6. Deploy

Publish App  
[...]

### 7. Moderation
Moderate users and user generated content (optional)  
[...]
