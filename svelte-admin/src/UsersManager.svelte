<script>

  import { onDestroy } from 'svelte';
  import { InterkitClient } from 'interkit'
  import UsersList from './UsersList.svelte'
  import { Form, TextInput, Button } from "carbon-components-svelte"

  export let projectId
  export let previewUserId

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

  onDestroy(unsubscribe);

  const createNewUser = () => {
    const projectData = { createdInBackEnd: true }
    const data = { username, password, email, projectData, projectId }
    console.log(data)
    InterkitClient.createProjectUser( data )
  }

</script>

<UsersList users={usersArray} {projectId} {previewUserId} />

<br><br>

<Form on:submit={createNewUser}>
  <TextInput bind:value={username} inline light labelText="User name" />
  <TextInput bind:value={email} inline light labelText="Email" />
  <TextInput bind:value={password} inline light labelText="Password" />
  <br>
  <Button type="submit">Create New Project User</Button>
</Form>

<!--pre>
{JSON.stringify(usersArray, null, 2)}
</pre-->
