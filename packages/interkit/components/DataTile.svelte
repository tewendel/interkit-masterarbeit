<script>

  import { setContext } from "svelte";
  import Tile from "./fragments/Tile.svelte"
  import Label from "./Label.svelte"
  import Button from "./Button.svelte"
  import MessageIndicator from "./fragments/MessageIndicator.svelte";
  import { getShowDummyDataStore } from './dummyDataHelpers.js'  
  import { getContext } from 'svelte';
  import { util } from '..'
  import WithEffect from "./WithEffect.svelte";

  export let variant = "rounded";
  export let rightArrow = false;
  export let disabled = false;
  export let flexibleSize;
  
  export let effect
  export let imageColumn;
  export let headlineColumn; 
  export let label1Column;
  export let subtitle1Column;
  export let descriptionColumn;

  let element = getContext("element");
  console.log("DataTile got element store from context", $element)
  if(!element) {
    console.warn("DataTile needs an element context, for example from DataList")
  }  

  $: imageRef = util.rowVal($element, imageColumn)
  $: headline = util.rowVal($element, headlineColumn)
  $: label1 = util.rowVal($element, label1Column)
  $: subtitle1 = util.rowVal($element, subtitle1Column)
  $: description = util.rowVal($element, descriptionColumn)

  let showDummyData = getShowDummyDataStore();

  setContext("DataTile", {slots: $$slots})
</script>

<WithEffect {effect} let:execute>
  <Tile 
    {variant} 
    {rightArrow}
    {imageRef}
    {headline}
    {label1}
    {subtitle1}
    {description}
    {disabled}
    {flexibleSize}
    on:click={() => {if(!disabled) execute()}}
    hoverPointer={effect && effect?.effectType != "none" ? true : false}
  >
    <svelte:fragment slot="chips">
      {#if $showDummyData && !$$slots.chips}
        <Label type="icon" variant="strong" icon="Full-Check"/>
        <MessageIndicator/>
      {:else}
        <slot name="chips"/>
      {/if}
    </svelte:fragment>
    <svelte:fragment slot="buttons">
      {#if $showDummyData && !$$slots.buttons}
        <Button variant="ghost">Open</Button>
      {:else}
        <slot name="buttons"/>
      {/if}
    </svelte:fragment>
  </Tile>
</WithEffect>