<script>

  import Route from "./Route.svelte";
  import DataLoaderMulti from "./DataLoaderMulti.svelte"
  
  export let path;
  export let keepAlive;

  // props for DataLoaderMulti
  export let sheet;
  export let referenceElementStore // a store that contains an element that we use to filter this list
  export let referenceElementColumn // the column on that element that contains the references  
  export let sortColumn // the column by which to sort the elements
  export let hideColumn // a column that filters elements 
  export let excludeAnnotated // exclude elements with any of these properties
  export let includeOnlyAnnotated // include elements with any of these properties 
  export let discoverableColumn // a column that filters elements unless they are explicitly discovered
  export let discoverProperty // a property that overrides the discoverableColumn
    
</script>

<Route path={path} {keepAlive}>
  <DataLoaderMulti 
    sheetKey = {sheet}
    {referenceElementStore} 
    {referenceElementColumn}
    {sortColumn}
    {hideColumn}
    {excludeAnnotated}
    {includeOnlyAnnotated}
    {discoverableColumn}
    {discoverProperty}
    >
    <slot/>
  </DataLoaderMulti>
</Route>
