<script>
  import {InterkitClient} from "interkit";
  import { onMount, onDestroy } from "svelte";
  import NotificationBadge from "../Atoms/NotificationBadge.svelte";

  export let projectId

  let subHandle
  let messagesListNotification

  onMount(async () => {
    subHandle = await InterkitClient.getSub("messagesChannelReportsCount", "messagesChannelReportsCount", {projectId});
    subHandle.data.subscribe((data) => {
      messagesListNotification = data?.[0]?.total
    })
  })

  onDestroy(() => {
    if (subHandle) subHandle.stop()
  });

</script>

<NotificationBadge count={messagesListNotification} />