<script>

  import MessagesList from './MessagesList.svelte'
  import PaginatedCollectionSubscription from './PaginatedCollectionSubscription.svelte'

  export let projectId
  export let notification = true

  let messagesArray

  let limit = 20
  let page = 1
  let searchQuery = ""
  let sortKey = "createdAt"
  let sortDirection = -1

  let channelReports = false

  const REPORTS_CHANNEL_KEY = 'REPORTS'

  // we have unseen reports about messages
  $: notification = messagesArray?.some(message => (!message.seen || message?.seen?.length === 0) && message?.channel_key === REPORTS_CHANNEL_KEY)

</script>

<PaginatedCollectionSubscription
    {projectId}
    publicationName="messagesPaginated"
    extraParams={{channelReports}}
    let:items={messagesArray}
    let:resetting
    let:total
    bind:limit={limit}
    bind:page={page}
    bind:searchQuery={searchQuery}
    bind:sortKey={sortKey}
    bind:sortDirection={sortDirection}
  >
  <MessagesList
    {projectId}
    messages={messagesArray}
    loading={resetting}
    total={total}
    bind:page={page}
    bind:limit={limit}
    bind:searchQuery={searchQuery}
    bind:sortKey={sortKey}
    bind:sortDirection={sortDirection}
    bind:channelReports
  />
</PaginatedCollectionSubscription>


