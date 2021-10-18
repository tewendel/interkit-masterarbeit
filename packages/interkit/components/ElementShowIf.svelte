<script>
  import { getContext } from "svelte"
  import { get } from 'svelte/store';
  import { InterkitClient, util } from '../'

  // you can pass in an element via slot props (used in ElementList)
  export let element;
  if(element) console.log("ElementShowIf got element through prop", element)

  // get context from parent element, for example inside ContentElement
  /*const c = getContext("buttonBar");
  //console.log("ElementShowIf element from buttonPayload", c?.buttonPayload)
  let elementStore = c?.buttonPayload // this is a store*/

  /*// otherwise use global store if available
  let elementDetail = InterkitClient.getGlobalStore("elementDetail")
  if(!elementStore && elementDetail) {
    //console.log("ElementShowIf element from elementDetail", $elementDetail)
    elementStore = elementDetail
  }*/
 
  //$: console.log("element store show if", $elementStore)

  export let property;

  let elementProperties = InterkitClient.getGlobalStore("elementProperties");
  console.log("ElementShowIf getting elementProperties", $elementProperties)
  let value;
  $: {
    if(element) {
      value = $elementProperties?.[element?.key]?.[property]  
      console.log("updated value from element", element, property, value)
    } /*else {
      value = $elementProperties?.[$elementStore?.key]?.[property]  
    }*/
    //console.log("updated value in ElementShowIf", element, $elementStore, property, value)
  }

</script>

<!-- showIf {uiKey} value: {value} -->
{#if value}
  <slot name="iftrue"></slot>
{:else}
  <slot name="else"></slot>
{/if}