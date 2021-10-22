<script>

  /*
    provides a context with a store containing the elements specified
    consumed by elementList, elementSlider, map
  */

  export let sheetKey // the sheet to get the elements from

  export let sortColumn // the column by which to sort the elements
  export let hideColumn // a column that filters elements 
  
  export let excludePropertiesAny // exclude elements with any of these properties
  export let includePropertiesAny // include elements with any of these properties 

  export let discoverableColumn // a column that filters elements unless they are explicitly discovered
  export let discoverProperty // a property that overrides the discoverableColumn
  
  import { onMount, onDestroy, setContext } from "svelte"
  import { writable } from "svelte/store"
  import { InterkitClient } from "../"

  let unsubscribe;
  let unfilteredData;
  let providedData = writable([]);

  const elementProperties = InterkitClient.getGlobalStore("elementProperties")
  //console.log("ElementsContextProvider")

  const filterData = (data) => {
    //console.log("filterData", data, $elementProperties, hideColumn, sortColumn, excludePropertiesAny, includePropertiesAny)
    if(!data) return [];

    // exclude elements that have true in hideColumn
    if(hideColumn) {
      data = data.filter(a => a.hideColumn != "true")    
    }

    // sort elemets by sortcolumn
    if(sortColumn) {
      data.sort((a, b) => a.sortColumn - b.sortColumn)
    }

    // exclude elements with any of these properties set to true
    if(excludePropertiesAny) {
      for(let property of excludePropertiesAny.split(", ")) {
        data = data.filter(a => $elementProperties?.[a.key]?.[property])
      }
    }

    // include only elements with one of these properties set to true
    if(includePropertiesAny) {
      //console.log("includePropertiesAny")
      let filteredData = [];
      for(let element of data) {
        for(let property of includePropertiesAny.split(", ")) {
          if($elementProperties?.[element.key]?.[property]) {
            filteredData.push(element)
            break;
          }
        }
      }
      data = filteredData;
    }

    // check for discoverables and exclude if not yet discoverd
    if(discoverableColumn && discoverProperty) {
      let filteredData = [];
      for(let element of data) {
        if(!element.discoverableColumn 
            || (element.discoverableColumn && $elementProperties?.[element.key]?.[discoverProperty])) {
          filteredData.push(element)  
        }
      }
      data = filteredData;   
    }

    return data;
  }

  const refilter = () => {
    providedData.set(filterData(unfilteredData));    
  }

  const initSubs = async () => {

    if(!sheetKey) {
      alert("ElementsContextProvider - no sheetKey set")
      return;
    }

    let rows = await InterkitClient.getRowSubStore(sheetKey, { sortColumn, hideColumn, discoverableColumn });

    // refilter data when data changes
    unsubscribe = rows.subscribe((data) => {
      unfilteredData = data;
      refilter();
    })
  }

  // refilter data if elementProperties change
  $: {
    if($elementProperties) {
      console.log("ElementsContextProvider detected change in elementProperties, refiltering")
      refilter();
    }
  }



  setContext("elementsProvider", {
    elements: providedData
  })

  onMount(initSubs);

  onDestroy(()=>{
    if(unsubscribe) unsubscribe();
  })

</script>

<slot/>