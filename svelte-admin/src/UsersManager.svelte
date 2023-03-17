<script>

  import { onMount, onDestroy, tick } from 'svelte';
  import { InterkitClient } from 'interkit'
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

  let usersStore;
  let unsubscribe;
  let usersArray;
  let meta;
  let resetting = false
  

  let skip = 0
  let limit = 20
  let total = 0
  let page = 1
  let searchQuery = ""
  let sortKey = "createdAt"
  let sortDirection = -1

  $: skip = (page - 1) * limit
  
  let subHandle;  

  $: tick().then(async() => {
    await resetSub(projectId, skip, limit, searchQuery, sortKey, sortDirection)
  })

  const resetSub = async (projectId, skip, limit, searchQuery, sortKey, sortDirection) => {
    console.log("reset sub", projectId, skip, limit, searchQuery, sortKey, sortDirection)
    if (resetting) return
    resetting = true
    if(subHandle) await subHandle.stop()
    let i = 0
    subHandle = await InterkitClient.getSub('projectUsersPaginated', 'projectUsersPaginated', {
      projectId,
      skip,
      limit,
      searchQuery,
      sortKey,
      sortDirection
    });
    unsubscribe = subHandle.data.subscribe((data)=>{
      [meta, ...usersArray] = data;
      total = meta && meta.total || 0
      console.log("new total", total)
      console.log("project users", data)
    })    
    resetting = false
  }

  onMount(async()=> {
    setInterval(()=>{
      //skip = skip + 1
    }, 2000)
  });

  onDestroy(async()=> {
    if (unsubscribe) unsubscribe();
    if (subHandle) subHandle.stop()
  });

  let openCreateNewUser = false

  const createNewUser = () => {
    const projectData = { createdInBackEnd: true }
    const data = { username, password, email, projectData, projectId }
    console.log(data)
    InterkitClient.createProjectUser( data )
  }

</script>

<UsersList
  users={usersArray}
  {projectId}
  {previewUserId}
  {updatePreviewUserAuth}
  {moveToBoardId}
  {moveToNodeId}
  total={meta && meta.total}
  bind:page={page}
  bind:limit={limit}
  bind:searchQuery={searchQuery}
  bind:sortKey={sortKey}
  bind:sortDirection={sortDirection}
  bind:loading={resetting}
  on:clickedAddUser={() => { openCreateNewUser = true }}
/>

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
