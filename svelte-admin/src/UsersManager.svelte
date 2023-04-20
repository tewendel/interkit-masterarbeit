<script>

  import { InterkitClient } from 'interkit'
  import PaginatedCollectionSubscription from './PaginatedCollectionSubscription.svelte'
  import UsersList from './UsersList.svelte'
  import {
    Form,
    TextInput,
    Modal
  } from "carbon-components-svelte"

  export let projectId
  export let previewUserId
  export let updatePreviewUserAuth

  export let moveToBoardId
  export let moveToNodeId

  let username
  let email
  let password

  let limit = 20
  let page = 1
  let searchQuery = ""
  let sortKey = "createdAt"
  let sortDirection = -1

  let openCreateNewUser = false

  const createNewUser = () => {
    const projectData = { createdInBackEnd: true }
    const data = { username, password, email, projectData, projectId }
    console.log(data)
    InterkitClient.createProjectUser( data )
  }

</script>

<PaginatedCollectionSubscription
    {projectId}
    publicationName="projectUsersPaginated"
    let:items
    let:resetting
    let:total
    bind:limit={limit}
    bind:page={page}
    bind:searchQuery={searchQuery}
    bind:sortKey={sortKey}
    bind:sortDirection={sortDirection}
  >
  <UsersList
    {projectId}
    users={items}
    loading={resetting}
    total={total}
    bind:page={page}
    bind:limit={limit}
    bind:searchQuery={searchQuery}
    bind:sortKey={sortKey}
    bind:sortDirection={sortDirection}
    {previewUserId}
    {updatePreviewUserAuth}
    {moveToBoardId}
    {moveToNodeId}
    on:clickedAddUser={() => { openCreateNewUser = true }}
  />
</PaginatedCollectionSubscription>

<Modal
  bind:open={openCreateNewUser}
  modalHeading="Create new project user"
  primaryButtonText="Create"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => { openCreateNewUser = false }}
  on:submit={() => { createNewUser(); openCreateNewUser = false }}
  shouldSubmitOnEnter={false}
  >
  <Form on:submit={createNewUser}>
    <TextInput bind:value={username} inline light labelText="User name" />
    <TextInput bind:value={email} inline light labelText="Email" />
    <TextInput bind:value={password} inline light labelText="Password" />
  </Form>
  <!-- FIXME there is no error handling, e.g. if an email exists
    you only get an error in the console -->
</Modal>
