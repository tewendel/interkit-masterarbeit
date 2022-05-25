<script>

  import { onDestroy } from 'svelte'
  import { InterkitClient } from 'interkit'
  import MessagesList from './MessagesList.svelte'

  export let projectId

  let messagesStore
  let unsubscribe
  let messagesArray

  let subHandle
  $: resetSub(projectId)

  const resetSub = async (projectId) => {
    if (subHandle) await subHandle.stop()
    subHandle = await InterkitClient.getSub('messages', 'messages', { projectId })
    messagesStore = subHandle.data
    unsubscribe = messagesStore.subscribe((data) => {
      messagesArray = data
      console.log('MessagesManager 2', { projectId, subHandle, messagesStore, messagesArray })
    })
    console.log('MessagesManager', { projectId, subHandle, messagesStore, messagesArray })
  }

  onDestroy(unsubscribe);

</script>

<MessagesList
  messages={messagesArray}
  {projectId}
  />

