<script>

  import { onDestroy, tick } from 'svelte';
  import { InterkitClient } from 'interkit'

  let unsubscribe;
  let subHandle;  
  let skip = 0
  let meta;
  let resetOneMoreTime = false

  export let projectId
  export let publicationName
  export let extraParams = {}

  /* let: */ let items = [];
  /* let: */ let resetting = false
  /* let: */ let total = 0

  /* bind: */ export let limit = 20
  /* bind: */ export let page = 1
  /* bind: */ export let searchQuery = ""
  /* bind: */ export let sortKey = "createdAt"
  /* bind: */ export let sortDirection = -1

  $: skip = (page - 1) * limit

  $: if (sortKey || sortDirection || searchQuery ) page = 1 // reset page when sortKey or sortDirection or searchQuery changes


  $: tick().then(async() => {
    await resetSub(projectId, skip, limit, searchQuery, sortKey, sortDirection, extraParams)
  })

  const resetSub = async (projectId, skip, limit, searchQuery, sortKey, sortDirection, extraParams) => {
    console.log("reset sub", projectId, skip, limit, searchQuery, sortKey, sortDirection, extraParams)
    if (resetting) {
      resetOneMoreTime = true
      return
    }
    resetting = true
    if(subHandle) await subHandle.stop()
    subHandle = await InterkitClient.getSub(publicationName, publicationName, {
      projectId,
      skip,
      limit,
      searchQuery,
      sortKey,
      sortDirection,
      ...extraParams
    });
    unsubscribe = subHandle.data.subscribe((data)=>{
      const meta = data.find(i => i.id == "meta")
      items = data.filter(i => i.id != "meta")
      total = meta && meta.total || 0
      console.log("sub data", meta, items)
    })    
    resetting = false
    if (resetOneMoreTime) {
      resetOneMoreTime = false
      resetSub(projectId, skip, limit, searchQuery, sortKey, sortDirection, extraParams)
    }
  }

  onDestroy(async()=> {
    if (unsubscribe) unsubscribe();
    if (subHandle) subHandle.stop()
  });

</script>

<slot {items} {resetting} {total} />

