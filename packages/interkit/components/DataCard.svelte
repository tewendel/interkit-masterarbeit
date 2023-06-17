<script>

  import Card from "./fragments/Card.svelte"
  import Label from "./Label.svelte"
  import MessageIndicator from "./fragments/MessageIndicator.svelte";
  import { getShowDummyDataStore } from './dummyDataHelpers.js'  
  import { getContext } from 'svelte';
  import { util } from '..'

  export let variant = "full";
  export let rightArrow = false;
  
  export let imageColumn;
  export let headlineColumn; 
  export let label1Column;
  export let subtitle1Column;
  export let label2Column;
  export let subtitle2Column;
  export let label3Column;
  export let subtitle3Column;
  export let descriptionColumn;

  let element = getContext("element");
  console.log("DataCard got element store from context", $element)
  if(!element) {
    console.warn("DataCard needs an element context, for example from DataList")
  }  

  $: imageRef = util.rowVal($element, imageColumn)
  $: headline = util.rowVal($element, headlineColumn)
  $: label1 = util.rowVal($element, label1Column)
  $: subtitle1 = util.rowVal($element, subtitle1Column)
  $: label2 = util.rowVal($element, label2Column)
  $: subtitle2 = util.rowVal($element, subtitle2Column)
  $: label3 = util.rowVal($element, label3Column)
  $: subtitle3 = util.rowVal($element, subtitle3Column)
  $: description = util.rowVal($element, descriptionColumn)

  let showDummyData = getShowDummyDataStore();

</script>

<Card 
  {variant} 
  {rightArrow}
  {imageRef}
  {headline}
  {label1}
  {subtitle1}
  {label2}
  {subtitle2}
  {label3}
  {subtitle3}
  {description}
>
  <svelte:fragment slot="chips">
    {#if $showDummyData && !$$slots.chips}
      <Label type="icon" variant="strong" icon="Full-Check"/>
      <MessageIndicator/>
    {:else}
      <slot name="chips"/>
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="content"><slot name="content"/></svelte:fragment>
</Card>