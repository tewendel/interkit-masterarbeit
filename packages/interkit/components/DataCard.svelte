<script>

  import Card from "./fragments/Card.svelte"
  import Label from "./Label.svelte"
  import MessageIndicator from "./fragments/MessageIndicator.svelte";
  import { getShowDummyDataStore } from './dummyDataHelpers.js'  
  import { getContext } from 'svelte';
  import { util } from '..'

  export let variant = "full";
  export let rightArrow = false;
  export let headlineColumn; 

  let element = getContext("element");
  console.log("DataCard got element store from context", $element)
  if(!element) {
    console.warn("DataCard needs an element context, for example from DataList")
  }  
  $: headline = util.rowVal($element, headlineColumn)

  let showDummyData = getShowDummyDataStore();

</script>

<Card 
  {variant} 
  {rightArrow}
  {headline}
>
  <svelte:fragment slot="widgets">
    {#if $showDummyData && !$$slots.widgets}
      <Label type="icon" variant="strong" icon="Full-Check"/>
      <MessageIndicator/>
    {:else}
      <slot name="widgets"/>
    {/if}
  </svelte:fragment>
</Card>