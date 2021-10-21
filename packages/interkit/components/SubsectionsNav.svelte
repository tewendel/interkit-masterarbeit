<script>
  
  import TopNavBar from './TopNavBar.svelte';
  import Icon from './Icon.svelte';
  import Button from './Button.svelte';
  import TopNavBarCustom from './TopNavBarCustom.svelte';

  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  import { executeTrigger } from '../actions.js'

  export let label;
  export let closeTrigger;

  const baseBack = () => {
    if(closeTrigger) executeTrigger(closeTrigger)  
  }

  let subsectionLabels = [label];
  let backMethods = [baseBack];

  setContext("TopNav", {
      configureNavBar: (label, fn) => {
        subsectionLabels.push(label);
        subsectionLabels = subsectionLabels;
        if(fn) {
          backMethods.push(fn);
        }
      }
  });
  
  const back = () => {
    if(backMethods.length > 1) {
      subsectionLabels.pop()
      subsectionLabels = subsectionLabels;
      backMethods[backMethods.length - 1]();
      backMethods.pop()
    } else {
      backMethods[0]();
    }
  }

  const close = () => {
    baseBack();
  }

</script>

<TopNavBarCustom>

  <svelte:fragment slot="left">

      <Button on:click={back}>
        <Icon type="arrow-left" />
      </Button>
      <span class="headline">{subsectionLabels[subsectionLabels.length - 1]}</span>

  </svelte:fragment>

  <svelte:fragment slot="content">
    <slot/>
  </svelte:fragment>

</TopNavBarCustom>

<style>
  span.headline {
    font-size: var(--font-size-headline-1);
  }
</style>
