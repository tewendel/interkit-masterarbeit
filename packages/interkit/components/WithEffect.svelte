<script >
  import { getContext, setContext } from 'svelte'
  import { useNavigate } from 'svelte-navigator';
  import { executeTrigger } from '../actions'
  import InterkitClient from '../interkit-client';

  export let effect;

  const elementContext = getContext("element");

  let navigate;
  try {
    navigate = useNavigate();
  } catch(e) {
    console.log(e)
  }

  const handleClickEffect = (payload) => {
    
    console.log("handling effect", effect)
    
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

    if(effectType == "dataRouteSingle" && effect.path && payload?.elementKey) {
      navigate(effect.path + "/" + payload?.elementKey)
    }

    if(effectType == "link" && effect.url) {
      window.open(effect.url, '_self');
    }
    if(effectType == "linkTargetBlank" && effect.url) {
      window.open(effect.url, '_blank');
    }

    if(effectType == "actionTrigger" && effect.trigger) {
      executeTrigger(effect.trigger, elementContext ? $elementContext : undefined)
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

  const execute = (payload) => {
    console.log("received effect", payload)
    handleClickEffect(payload);
  }
  setContext("effect", {execute});

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="click-effect">
  <slot {execute}></slot>
</div>

<style>
  .click-effect {
    display: contents; /* the wrapper should not have an effect on styling */
  }
</style>