<script>

  import { onDestroy } from 'svelte';
  import { InterkitClient } from 'interkit'
  import UsersList from './UsersList.svelte'
  export let projectId

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
      //console.log("new mediafiles", data)
      usersArray = data;
    })    
  }

  onDestroy(unsubscribe);

</script>

<UsersList users={usersArray} {projectId}/>

<!--pre>
{JSON.stringify(usersArray, null, 2)}
</pre-->