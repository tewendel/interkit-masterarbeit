<script>

  import { onDestroy } from 'svelte'
  import { InterkitClient } from 'interkit'
  import MessagesList from './MessagesList.svelte'

  export let projectId
  export let notification = true

  let messagesStore
  let unsubscribe
  let messagesArray

  let subHandle
  $: resetSub(projectId)

  const resetSub = async (projectId) => {
    if (subHandle) await subHandle.stop()
    subHandle = await InterkitClient.getSub('messages', 'messages', { projectId, includeBlocked: true })
    messagesStore = subHandle.data
    unsubscribe = messagesStore.subscribe((data) => {
      messagesArray = data
    })
  }

  onDestroy(()=>{
    if (unsubscribe) unsubscribe()
  });

  const REPORTS_CHANNEL_KEY = 'REPORTS'

  // we have unseen reports about messages
  $: notification = messagesArray?.some(message => (!message.seen || message?.seen?.length === 0) && message?.channel_key === REPORTS_CHANNEL_KEY)

</script>

<MessagesList
  messages={messagesArray}
  {projectId}
  />

