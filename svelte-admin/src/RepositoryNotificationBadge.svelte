<script>
  import NotificationBadge from "./NotificationBadge.svelte";
  import {currentProject} from "./admin.js"

  let repoNotice

  $: {
    const unstagedFiles = $currentProject?.uiState?.git?.unstagedChanges || []
    repoNotice = unstagedFiles.length > 0 ? `(${unstagedFiles.length})` : ""
  }

</script>

<NotificationBadge count={repoNotice} />