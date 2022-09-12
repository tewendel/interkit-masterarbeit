<script>
  import ComponentInfo from "../../components/ComponentInfo.svelte";
  import src from "../../../../../packages/interkit/components/Chat.svelte?raw";
</script>

# ElementList

## usage

Displays a chat interface for a given channel. 

The channel key can be set in two ways:
* using the channel_key prop
* using the globalStore "chatChannelKey"

If the globalStore is set, it takes priority.

```docs
../../../../../packages/interkit/components/Chat.svelte
```

<ComponentInfo code={src} />
