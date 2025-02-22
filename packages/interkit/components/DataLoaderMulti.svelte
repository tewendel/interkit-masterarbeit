<script>

  import { onMount, onDestroy, getContext, setContext } from "svelte"
  import { get, writable } from "svelte/store"
  import { InterkitClient, util } from ".."

  /*
    provides a context with a store containing the elements specified
    consumed by elementList, elementSlider, map
  */

  export let sheetKey // the sheet to get the elements from

  export let referenceColumn // the column on that element that contains the references
    
  export let sortColumn // the column by which to sort the elements
  export let hideColumn // a column that filters elements 
  
  export let includeOnlyAnnotated // include elements with any of these properties 
  export let excludeAnnotated // exclude elements with any of these properties
  
  export let discoverableColumn // a column that filters elements unless they are explicitly discovered
  export let discoverAnnotation // a property that overrides the discoverableColumn
  
  const contextElement = getContext("element");
  console.log("DataLoaderMulti got reference element store from context", $contextElement)
  
  let unsubscribe;
  let unfilteredData;
  let providedData = writable([]);
  
  const elementProperties = InterkitClient.getGlobalStore("elementProperties")
  //console.log("ElementsContextProvider")

  const filterData = (data) => {
    console.log("filterData", $contextElement)
    if(!data) return [];

    // get the references pointing to our sheet from the contextElement
    if($contextElement && referenceColumn) {                

      // the contextElement and the referenceColumn are from the same sheet
      if($contextElement?.sheetKey == util.getSheetKey(referenceColumn)) {
        // we include data that is referenced by the referenceColumn on the contextElement
        let references = get(contextElement)?.values?.[util.colKey(referenceColumn)]?.rowKeys
        if(references) {
          data = data.filter(e => references.includes(e.key))
        } else {
          return []
        }
      // the contextElement and the referenceColumn are from different sheets
      } else {
        // we include data from our sheet that references the contextElement in the referenceColumn
        console.log("filtering", data, $contextElement, referenceColumn)
        data = data.filter(e => {
          let references = e?.row?.values?.[util.colKey(referenceColumn)]?.rowKeys
          return references?.includes($contextElement.key)
        })
      }
    }

    // opposite case: filter the data from our sheet to include only elements that have a reference to the contextElement

    // exclude elements that have true in hideColumn
    if(hideColumn) {
      data = data.filter(a => a.hideColumn != "true")    
    }

    
    // exclude elements with any of these properties set to true
    if(excludeAnnotated) {
      for(let property of excludeAnnotated.split(", ")) {
        data = data.filter(a => $elementProperties?.[a.key]?.[property] != "true")
      }
    }

    // include only elements with one of these properties set to true
    if(includeOnlyAnnotated) {
      //console.log("includeOnlyAnnotated")
      let filteredData = [];
      for(let element of data) {
        for(let property of includeOnlyAnnotated.split(", ")) {
          if($elementProperties?.[element.key]?.[property] == "true") {
            filteredData.push(element)
            break;
          }
        }
      }
      data = filteredData;
    }

    // check for discoverables and exclude if not yet discoverd
    if(discoverableColumn && discoverAnnotation) {
      //console.log("DataLoaderMulti filtering for discovered elements", data, $elementProperties, discoverableColumn, discoverAnnotation)
      let filteredData = [];
      for(let element of data) {
        if(element.discoverableColumn != "true"
            || (element.discoverableColumn == "true" && ($elementProperties?.[element.key]?.[discoverAnnotation] == "true"))) {
          filteredData.push(element)  
        }
      }
      data = filteredData;   
    }

    // sort elemets by sortcolumn
    if(sortColumn) {
      console.log("DataLoaderMulti sorting", data)
      data.sort((a, b) => { return (a.sortColumn || 0) - (b.sortColumn || 0) })
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

    if (!sheetKey) {
      console.warn('DataLoaderMulti: no sheetKey')
      return;
    }

    let rows = await InterkitClient.getRowSubStore(sheetKey, { sortColumn, hideColumn, discoverableColumn });

    // refilter data when data changes
    unsubscribe = rows.subscribe((data) => {
      //console.log("DataLoaderMulti got new data", sheetKey, data)
      unfilteredData = data;
      refilter();
    })
  }

  // refilter data if elementProperties or contextElement change
  $: {
    if($elementProperties || $contextElement) {
      //console.log("ElementsContextProvider detected change in elementProperties, refiltering")
      refilter();
    }
  }



  setContext("elements", {
    elements: providedData
  })

  onMount(initSubs);

  onDestroy(()=>{
    if(unsubscribe) unsubscribe();
  })

</script>

{#if !sheetKey}
<div class="blockly-error"><i>DataLoaderMulti: no sheetKey</i></div>
{/if}

<slot/>
