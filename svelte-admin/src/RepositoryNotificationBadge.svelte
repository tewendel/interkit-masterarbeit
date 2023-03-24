<script>
  import NotificationBadge from "./NotificationBadge.svelte";

  export let currentProject

  let repoNotice

  $: {
    const unstagedFiles = $currentProject?.uiState?.git?.unstagedChanges || []
    repoNotice = unstagedFiles.length > 0 ? `(${unstagedFiles.length})` : ""
  }

</script>

<NotificationBadge count={repoNotice} />