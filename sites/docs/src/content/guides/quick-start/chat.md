<script>
  import YouTube from "../../../components/YouTube.svelte"
</script>

# Getting started with Chatbots

interkit allows you to create complex interactions that can be expressed by narrative flow concepts,
e.g. chat bots. 

<YouTube url="https://www.youtube.com/embed/eFPSLS0S9tg?si=kAGrQyF11TXoq2T8"/> 

### Boards

Create *boards* to organize your story into different parts. For example, if you have several chat bots, chat "channels", or chapters in an interactive story.

You don't necessarily need to have several boards, but you will need at least one to use the Story functionality. You activate and edit other boards by selecting them in the left sidebar.

At the top of the central area, you can edit your board's name and some metadata, like *Title* and *Label*.

### Nodes

Add *Nodes* to your board. Each node defines a specific state that your user can be in and how the system should behave 
- when the user first arrives 
- when the user sends a message

In each node, you can define messages that the system sends to the user, including example text, images, audio or options. When the user sends a message, your node can write back to user or move them to a different node, for example when they make a choice.

Expand your board in the left sidebar to see all Nodes in a list; they will also appear in the central area, where you build your interaction graph. Drag nodes to arrange them visually -- this has no meaning for interactions, it just helps you design your graph.

Click a node to enter its code, which will appear in another pane.

The default mode to define behaviour in Nodes is using a Javascript API.
There is also a simplified mode inspired by the interactive fiction tool Twine, that you can access in the Twine-ish tab.

See the [chat javascript API reference](/reference/chat/javascript_api) or the [twinish reference](/reference/chat/twinish) for more information. You can also use the help button next to the editor to look up syntax for both variants.

Have a look at the [chat tutorial](/guides/tutorials/chat) to lean basic design patterns when working with boards, nodes and the chat api.