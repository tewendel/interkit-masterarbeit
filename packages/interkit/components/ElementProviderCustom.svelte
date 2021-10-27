<script>

  import { onMount, setContext } from "svelte"
  import { writable } from "svelte/store"
  import { InterkitClient } from "../"

  export let srcKeyColumn;  
  export let srcKey;
  export let srcGlobalStore;

  export let targetContext;
  export let targetContextProperty;
  
  export let elementProp = "FALSE"
  
  export let targetGlobalStore; 
  
  // this is where we write our element to internally
  const singleElementStore = writable(null)

  // if set, we write is also to this global store
  const _targetGlobalStore = targetGlobalStore ? InterkitClient.getGlobalStore(targetGlobalStore) : null;

  // update our internal element store and an optional global store
  const update = (element) => {
    singleElementStore.set(element);
    if(_targetGlobalStore) {
      _targetGlobalStore.set(element);
      console.log("writing to target global Store", targetGlobalStore, element)
    }
  }

  onMount(async () => {
    
    // get element from database
    if(srcKeyColumn && srcKey) {      
      const elementsStore = await InterkitClient.getRowSubStore(srcKeyColumn, { srcKeyColumn })  
      elementsStore.subscribe(data => {
        const row = data.filter(d => d.srcKeyColumn == srcKey)?.[0]?.row
        update(row);
      })
    }

    // get element from a global store
    if(srcGlobalStore) {
      const _srcGlobalStore = InterkitClient.getGlobalStore(srcGlobalStore)
      _srcGlobalStore.subscribe(data => {
        update(data)
      })
    }
  
  });

  // put the element store into a context
  if(targetContext && targetContextProperty) {
    setContext(targetContext, {
      [targetContextProperty]: singleElementStore
    })
  }

</script>

{#if elementProp == "TRUE"}
  <slot name="consumer" element={$singleElementStore}/>
{/if}

{#if elementProp == "FALSE"}
  <slot name="consumer"/>
{/if}