<script>
  import { getContext } from "svelte"
  import { get } from 'svelte/store';


  // get context from parent element, for example ContentElement
  const c = getContext("buttonBar");
  console.log("element", c?.buttonPayload)
  const element = c?.buttonPayload // this is a store

  //$: console.log("element store show if", $element)

  import { InterkitClient } from '../'
  export let property;

  let elementProperties = InterkitClient.getGlobalStore("elementProperties");
  $: value = $elementProperties?.[$element.key]?.[property]

</script>

<!-- showIf {uiKey} value: {value} -->
{#if value}
  <slot name="iftrue"></slot>
{:else}
  <slot name="else"></slot>
{/if}