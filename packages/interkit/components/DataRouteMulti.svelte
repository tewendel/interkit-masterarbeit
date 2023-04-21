<script>

  import { Route } from "svelte-navigator";
  import DataLoader from "./DataLoader.svelte"
  
  export let path;

  // props for DataLoader
  export let sheet;
  export let referenceElementStore // a store that contains an element that we use to filter this list
  export let referenceElementColumn // the column on that element that contains the references  
  export let sortColumn // the column by which to sort the elements
  export let hideColumn // a column that filters elements 
  export let excludePropertiesAny // exclude elements with any of these properties
  export let includePropertiesAny // include elements with any of these properties 
  export let discoverableColumn // a column that filters elements unless they are explicitly discovered
  export let discoverProperty // a property that overrides the discoverableColumn
    
</script>

<Route path={path}>
  <DataLoader 
    sheetKey = {sheet}
    {referenceElementStore} 
    {referenceElementColumn}
    {sortColumn}
    {hideColumn}
    {excludePropertiesAny}
    {includePropertiesAny}
    {discoverableColumn}
    {discoverProperty}
    >
    <slot/>
  </DataLoader>
</Route>
