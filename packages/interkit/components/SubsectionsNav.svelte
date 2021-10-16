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
        backMethods.push(fn);
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

</script>

<TopNavBarCustom>

  <svelte:fragment slot="left">

      <Button on:click={back}>
        <Icon type="arrow-left" />
      </Button>
      {subsectionLabels[subsectionLabels.length - 1]}

  </svelte:fragment>


  <svelte:fragment slot="content">
    <slot/>
  </svelte:fragment>

</TopNavBarCustom>

