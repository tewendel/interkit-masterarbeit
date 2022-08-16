<script>

  /*
    provides a context with a store containing the elements specified
    consumed by elementList, elementSlider, map
  */

  export let sheetKey // the sheet to get the elements from

  export let referenceElementStore // a store that contains an element that we use to filter this list
  export let referenceElementColumn // the column on that element that contains the references
    
  export let sortColumn // the column by which to sort the elements
  export let hideColumn // a column that filters elements 
  
  export let excludePropertiesAny // exclude elements with any of these properties
  export let includePropertiesAny // include elements with any of these properties 

  export let discoverableColumn // a column that filters elements unless they are explicitly discovered
  export let discoverProperty // a property that overrides the discoverableColumn
  
  import { onMount, onDestroy, setContext } from "svelte"
  import { get, writable } from "svelte/store"
  import { InterkitClient, util } from "../"

  let unsubscribe;
  let unfilteredData;
  let providedData = writable([]);

  const elementProperties = InterkitClient.getGlobalStore("elementProperties")
  //console.log("ElementsContextProvider")

  const filterData = (data) => {
    //console.log("filterData", data, $elementProperties, hideColumn, sortColumn, excludePropertiesAny, includePropertiesAny)
    if(!data) return [];

    // if reference Element is defined, make sure to filter out all other elements
    if(referenceElementStore && referenceElementColumn) {
      const referenceElement = InterkitClient.getGlobalStore(referenceElementStore);
      if(referenceElement) {
        let references = get(referenceElement)?.values?.[util.colKey(referenceElementColumn)]?.rowKeys
        if(references) {
          data = data.filter(a => references.includes(a.key))
        }
      }
    }

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
      console.log("ElementsContextProvider filtering for discovered elements", data, $elementProperties)
      let filteredData = [];
      for(let element of data) {
        if(!element.discoverableColumn 
            || (element.discoverableColumn && $elementProperties?.[element.key]?.[discoverProperty])) {
          filteredData.push(element)  
        }
      }
      data = filteredData;   
    }

    //qconsole.log("filtered data", data)
    return data;
  }

  const refilter = () => {
    //console.log("ElementsContextProvider refilter", unfilteredData)
    providedData.set(filterData(unfilteredData));    
  }

  const initSubs = async () => {

    //console.log("initSubs", sheetKey)

    if(!sheetKey) {
      alert("ElementsContextProvider - no sheetKey set")
      return;
    }

    let rows = await InterkitClient.getRowSubStore(sheetKey, { sortColumn, hideColumn, discoverableColumn });

    // refilter data when data changes
    unsubscribe = rows.subscribe((data) => {
      //console.log("ElementsContextProvider got data", sheetKey, data)
      unfilteredData = data;
      refilter();
    })
  }

  // refilter data if elementProperties change
  $: {
    if($elementProperties) {
      //console.log("ElementsContextProvider detected change in elementProperties, refiltering")
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