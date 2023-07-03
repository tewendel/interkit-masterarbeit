<script>
  import InterkitClient from '../interkit-client';
  import { getContext, setContext, onMount } from 'svelte'
  import { useNavigate } from 'svelte-navigator';
  import { executeTrigger } from '../actions'
  
  export let effect;
  export let execOnMount = false;
  
  const elementContext = getContext("element");

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

