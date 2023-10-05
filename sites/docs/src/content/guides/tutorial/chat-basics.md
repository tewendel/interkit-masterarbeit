#### What the template does

This template shows a chat interface and allows the user to send messages. The response is always "yes".

#### Which parts of the system were used

The template was created by using components in the **App** section, setting the chat behaviour in the **Story** section.

#### Techniques demonstrated

- In the Story section, we have created a board ("board1") and a node. We have used the **api.sendText** command in the node editor to define how the chat reacts to users arriving and sending messages.

- We have added the **AnonymousLogin** component in the App section to create an anonymous user account when a user opens the app. This is necessary for chat interactions.

- The **Chat** component shows the chat interface and is set to the "board1" that we have set up in the story section.

#### Next Steps

- Write things into the chat and see how the system reacts.

- Change the text that the system sends in response to a user arriving and sending a message. Click the question mark in the node editor to see the available commands.

- In the Story section, create a new board and a new node. Change the Chat component in the App section to use your new board instead of the old one.

- See the chat authoring guide in the Docs to get started with writing interactive chats.
