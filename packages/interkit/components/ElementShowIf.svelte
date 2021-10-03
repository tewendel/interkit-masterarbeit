<script>
  import { getContext } from "svelte"
  import { get } from 'svelte/store';
  import { InterkitClient, util } from '../'

  // get context from parent element, for example inside ContentElement
  const c = getContext("buttonBar");
  console.log("ElementShowIf element from buttonPayload", c?.buttonPayload)
  let element = c?.buttonPayload // this is a store

  // otherwise use global store if available
  let elementDetail = InterkitClient.getGlobalStore("elementDetail")
  if(!element && elementDetail) {
    console.log("ElementShowIf element from elementDetail", $elementDetail)
    element = elementDetail
  }
 
  //$: console.log("element store show if", $element)

  export let property;

  let elementProperties = InterkitClient.getGlobalStore("elementProperties");
  console.log("ElementShowIf getting elementProperties", elementProperties)
  let value;
  $: {
    value = $elementProperties?.[$element?.key]?.[property]
    console.log("updated value in ElementShowIf", $element?.key, property, value)
  }

</script>

<!-- showIf {uiKey} value: {value} -->
{#if value}
  <slot name="iftrue"></slot>
{:else}
  <slot name="else"></slot>
{/if}