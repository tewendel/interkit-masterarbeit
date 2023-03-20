<script>

  import { onDestroy, tick } from 'svelte';
  import { InterkitClient } from 'interkit'

  let unsubscribe;
  let subHandle;  
  let skip = 0
  let meta;

  export let projectId
  export let publicationName

  /* let: */ let items = [];
  /* let: */ let resetting = false
  /* let: */ let total = 0

  /* bind: */ export let limit = 20
  /* bind: */ export let page = 1
  /* bind: */ export let searchQuery = ""
  /* bind: */ export let sortKey = "createdAt"
  /* bind: */ export let sortDirection = -1

  $: skip = (page - 1) * limit

  $: tick().then(async() => {
    await resetSub(projectId, skip, limit, searchQuery, sortKey, sortDirection)
  })

  const resetSub = async (projectId, skip, limit, searchQuery, sortKey, sortDirection) => {
    console.log("reset sub", projectId, skip, limit, searchQuery, sortKey, sortDirection)
    if (resetting) return
    resetting = true
    if(subHandle) await subHandle.stop()
    subHandle = await InterkitClient.getSub(publicationName, publicationName, {
      projectId,
      skip,
      limit,
      searchQuery,
      sortKey,
      sortDirection
    });
    unsubscribe = subHandle.data.subscribe((data)=>{
      [meta, ...items] = data;
      total = meta && meta.total || 0
      console.log("sub data", meta, items)
    })    
    resetting = false
  }

  onDestroy(async()=> {
    if (unsubscribe) unsubscribe();
    if (subHandle) subHandle.stop()
  });

</script>

<slot {items} {resetting} {total} />

