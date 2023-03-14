<script>

  import { onDestroy } from 'svelte';
  import { InterkitClient } from 'interkit'
  import UsersList from './UsersList.svelte'
  import {
    Form,
    TextInput,
    Button,
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
  
  let subHandle;  
  $: resetSub(projectId)

  const resetSub = async (projectId) => {
    if(subHandle) await subHandle.stop()
    subHandle = await InterkitClient.getSub('users', 'projectUsers', {projectId});
    usersStore = subHandle.data
    unsubscribe = usersStore.subscribe((data)=>{
      //console.log("project users", data)
      usersArray = data;
    })    
  }

  onDestroy(()=> unsubscribe());

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

<!--pre>
{JSON.stringify(usersArray, null, 2)}
</pre-->
