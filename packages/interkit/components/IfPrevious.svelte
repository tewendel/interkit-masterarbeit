<script>
  import { getContext } from 'svelte'
  import { useNavigate } from 'svelte-navigator';

  let navigate;
  try {
    navigate = useNavigate();
  } catch(e) {
    console.log(e)
  }

  const elementContext = getContext("element");
  const elementsContext = getContext("elements")?.elements;

  let result = false

  const updateResult = () => {

    // check for elements context
    console.log("elements", $elementsContext)
    const elements = $elementsContext

    // check for element context
    console.log("element", $elementContext)
    const currentElement = $elementContext

    if(elements && currentElement) {

      // find the current element of elements
      let currentElementIndex;
      for(const [index, element] of elements.entries()) {
        if(element.key == currentElement.key) {
          currentElementIndex = index
        }
      }
      console.log("found current key", currentElementIndex)

      // check if there is a next element
      if(currentElementIndex > 0) {
        result = true
      } else {
        result = false
      }
    } else {
      result = false
    }
  }

  $: $elementContext, $elementsContext, updateResult()

</script>

{#if result}
  <slot name="iftrue"></slot>
{:else}
  <slot name="else"></slot>
{/if}