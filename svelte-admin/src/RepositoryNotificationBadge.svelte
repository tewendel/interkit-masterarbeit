<script>
  import NotificationBadge from "./NotificationBadge.svelte";
  import {currentProject} from "./admin.js"

  let count = ""

  $: {
    const unstagedFiles = $currentProject?.uiState?.git?.unstagedChanges || []
    count = unstagedFiles.length > 0 ? unstagedFiles.length : ""
  }

</script>

<NotificationBadge {count} />