<script>

  import MessagesList from './MessagesList.svelte'
  import PaginatedCollectionSubscription from './PaginatedCollectionSubscription.svelte'

  export let projectId

  let messagesArray

  let limit = 20
  let page = 1
  let searchQuery = ""
  let sortKey = "createdAt"
  let sortDirection = -1

  let channelReports = false

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


