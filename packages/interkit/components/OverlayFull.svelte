<script>

import Button from './Button.svelte'
import Overlay from './Overlay.svelte'
import Absolute from "./Absolute.svelte";
import Icon from './Icon.svelte'
import WithEffect from './WithEffect.svelte';

export let closeEffect;
export let closeMethod;
export let customStyle;

let execute;

const close = () => {
  if(closeMethod) closeMethod();
  if(closeEffect) execute();
}

</script>

<WithEffect effect={closeEffect} bind:execute>
  <Overlay 
    zIndex=2
    {customStyle}
  >
    <slot/>
  </Overlay>
  <Overlay 
    zIndex=3
  >
    <Absolute
      top="var(--distance-s)"  
      left="var(--distance-s)"
    >
      <Button text="" on:click={close} type="secondary" size="small" dummyNoText>
        <Icon type="Full-Close"/>
      </Button>
    </Absolute>
  </Overlay>
</WithEffect>
