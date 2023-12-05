<script>
  import InterkitClient from '../interkit-client';
  import { getContext, setContext, onMount } from 'svelte'
  import { useNavigate } from 'svelte-navigator';
  import { executeTrigger } from '../actions'
  
  export let effect;
  export let execOnMount = false;
  
  const elementContext = getContext("element");
  const elementsContext = getContext("elements")?.elements;

  let navigate;
  try {
    navigate = useNavigate();
  } catch(e) {
    console.log(e)
  }

  const handleClickEffect = (payload) => {
    
    console.log("handling effect", {effect, payload, context: $elementContext})
    
    const effectType = effect?.effectType;
    if(!effectType || effectType == "none") return

    if(effectType == "route" || effectType == "back") {
      if(effectType == "route" && effect.path) {
        navigate(effect.path)
      }
      if(effectType == "back") {
        navigate(-1)
      }
    }

    if(effectType == "dataRouteSingle" && effect.path && (payload?.elementKey || $elementContext?.key)) {
      // if a key is provided via the payload, use that (eg qr scanner)
      if(payload?.elementKey) {
        console.log("dataRouteSingle using key from payload")
        navigate(effect.path + "/" + payload?.elementKey)
      }
      // otherwise, use the key from element context (eg button)
      else if($elementContext?.key) {
        console.log("dataRouteSingle using key from context")
        navigate(effect.path + "/" + $elementContext?.key)
      }
    }

    if(effectType == "link" && effect.url) {
      window.open(effect.url, '_self');
    }
    if(effectType == "linkTargetBlank" && effect.url) {
      window.open(effect.url, '_blank');
    }

    if(effectType == "actionTrigger" && effect.trigger) {
      executeTrigger(effect.trigger, payload ? payload : (elementContext ? $elementContext : undefined))
    }

    if(effectType == "setUIKey" && effect.key && effect.value) {
      let store = InterkitClient.getUiKeyStore(effect.key)
      store.set(effect.value)
    }

    if(effectType == "setUserVar" && effect.key && effect.value) {
      InterkitClient.setUserVar(effect.key, effect.value)
    }

    if(effectType == "setDataAnnotation" && effect.key && effect.value) {
      if($elementContext) {
        InterkitClient.setElementProperty($elementContext?.key, effect.key, effect.value)
      }
    }

    if(effectType == "next") {

      // check for elements context
      console.log("elements", $elementsContext)
      const elements = $elementsContext

      // check for element context
      console.log("element", $elementContext)
      const currentElement = $elementContext

      if(elements && currentElement) {

        // find the next element of elements
        let currentElementIndex;
        for(const [index, element] of elements.entries()) {
          if(element.key == currentElement.key) {
            currentElementIndex = index
          }
        }
        console.log("found current key", currentElementIndex)

        // check if there is a next element
        if(elements.length > currentElementIndex + 1) {
          const nextElement = elements[currentElementIndex + 1]

          const nextPath = effect.path + "/" + nextElement?.key
          console.log("navigating to", nextPath)

          // go to the specified path with next element key
          navigate(nextPath)
        }
      }
    }

    if(effectType == "previous") {

      // check for elements context
      console.log("elements", $elementsContext)
      const elements = $elementsContext

      // check for element context
      console.log("element", $elementContext)
      const currentElement = $elementContext

      if(elements && currentElement) {

        // find the next element of elements
        let currentElementIndex;
        for(const [index, element] of elements.entries()) {
          if(element.key == currentElement.key) {
            currentElementIndex = index
          }
        }
        console.log("found current key", currentElementIndex)

        // check if there is a next element
        if(currentElementIndex > 0) {
          const nextElement = elements[currentElementIndex - 1]

          const nextPath = effect.path + "/" + nextElement?.key
          console.log("navigating to", nextPath)

          // go to the specified path with next element key
          navigate(nextPath)
        }
      }

    }
  }

  export const execute = (payload) => {
    console.log("received effect", payload)
    handleClickEffect(payload);
  }
  setContext("effect", {execute});

  onMount(()=>{
    if(execOnMount) execute();
  })

</script>

<slot {execute}></slot>

