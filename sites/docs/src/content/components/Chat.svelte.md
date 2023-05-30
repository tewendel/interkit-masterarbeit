<script>
  import ComponentInfoYaml from "../../components/ComponentInfoYaml.svelte";
</script>

# Chat

## Usage

Displays a chat interface for a given channel. 

The channel key can be set in two ways:

* using the `board` prop
* using the globalStore "chatChannelKey"

If the globalStore is set, it takes priority.

<ComponentInfoYaml component="Chat" />

<details>
<summary>Developer docs</summary>

```docs
../../../../../packages/interkit/components/Chat.svelte
```

</details>
