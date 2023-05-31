<script>
  import { getContext } from "svelte"
  import { InterkitClient } from '../'

  export let key
  export let value

  const elementContext = getContext("element")
  const dataAnnotations = InterkitClient.getGlobalStore("elementProperties");

  $: {
    console.log("IfDataAnnotation", key, value, $elementContext, $dataAnnotations)
  }
  
  let currentValue;
  $: {
    if($elementContext) {
      currentValue = $dataAnnotations?.[$elementContext?.key]?.[key]  
    }
  }

</script>

{#if currentValue == value}
  <slot name="iftrue"></slot>
{:else}
  <slot name="else"></slot>
{/if}