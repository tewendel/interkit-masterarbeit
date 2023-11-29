# Getting started with Chatbots

interkit allows you to create complex interactions that can be expressed by narrative flow concepts,
e.g. chat bots. 

### Boards

Create *boards* to organize story components, e.g. if you have several chat bots, chat "channels", or chapters in an interactive story.

You don't need to necessarily have several board, but you need at least one to use the Story functionality. You activate and edit other boards by selecting them in the left sidebar.

At the top of the central area, you can edit your board's name and some metadata, like *Title* and *Label*.

### Nodes

Add *Nodes* to your board. Each node defines a specific state that your user can be in and how the system should behave 
- when the user arrives 
- when the user sends a message

Expand your board in the left sidebar to see all Nodes in a list; they will also appear in the central area, where you build your interaction graph. Drag nodes to arrange them visually -- this has no meaning for interactions, it just helps you design your graph.

Click a node to enter its code, which will appear in another pane.

The default mode to define behaviour in Nodes is using a Javascript API.
There is also a simplified mode inspired by the interactive fiction tool Twine, that you can access in the Twine-ish tab.

See the [chat API reference](/reference/chat/story_cheatsheet) or use the help button next to the editor to learn more about the syntax for both options.

Have a look at the [chat tutorial](/guides/tutorials/chat) to lean basic design patterns when working with boards, nodes and the chat api.