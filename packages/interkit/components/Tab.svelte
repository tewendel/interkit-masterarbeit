<script>
  import { InterkitClient } from '../'
  import WithEffect from './WithEffect.svelte';
  import { useLocation } from 'svelte-navigator';  
  let location;
  try {
    location = useLocation();
  } catch(e) {
    console.log(e)
  }

  export let text;  
  export let effect;
  export let execOnMount = false; 

  const uiKey = effect?.key ? InterkitClient.getUiKeyStore(effect?.key) : undefined;
  $: active = 
    (effect?.effectType == "route" && $location?.pathname == effect?.path) ||
    (effect?.effectType == "setUIKey" && $uiKey == effect?.value)

</script>

<WithEffect {effect} {execOnMount} let:execute>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    on:click={execute}
    class="Tab container {active ? "active" : ""}"
    class:Tab--active={active}
    >{text}</div>
</WithEffect>

<style>

.container {
  height: 56px;  
  font: var(--font-subtitle-1);
  letter-spacing: var(--letter-spacing-subtitle-1);
  padding: 12px 24px;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.container:hover {
  cursor: pointer;
}

.container.active {
  font: var(--font-headline-5);
  letter-spacing: var(--letter-spacing-headline-5);
}


</style>
