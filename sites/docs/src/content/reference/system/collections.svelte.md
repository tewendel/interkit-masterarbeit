<script>
  import ComponentInfo from "../../../components/ComponentInfo.svelte";
  import src from "../../../../../../meteor-server/imports/collections.js?raw";
</script>

# Collections

Internally, interkit uses a few database collections to manage data:

1. `Projects`: project-related data, 1 entry per project
2. `Users`: users, both front and back-end
3. `Sheets`: database sheets
4. `Rows`: database sheet rows
5. `Messages`: chat messages
6. `Channels`: chat channels (usually 1 per board)

## 

<ComponentInfo code={src} />