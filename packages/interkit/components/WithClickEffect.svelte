<script >
  import { getContext } from 'svelte'
  import { useNavigate } from 'svelte-navigator';
  import { executeTrigger } from '../actions'

  export let effect;

  const elementContext = getContext("element");

  let navigate;
  try {
    navigate = useNavigate();
  } catch(e) {
    console.log(e)
  }

  const handleClickEffect = () => {
    
    console.log("handling effect", effect)
    
    const effectType = effect.effectType;
    if(!effectType || effectType == "none") return

    if(effectType == "route" || effectType == "back") {
      if(effectType == "route" && effect.path) {
        navigate(effect.path)
      }
      if(effectType == "back") {
        navigate(-1)
      }
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
  }

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={handleClickEffect}>
  <slot></slot>
</div>