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
  <button
    type="tab"
    on:click={execute}
    class="Tab container {active ? "active" : ""}"
    class:Tab--active={active}
    aria-selected={active}
    >{text}
  </button>
</WithEffect>

<style>

.container {
  height: calc(2rem + 1.5rem * var(--inset-y));
  font: var(--font-subtitle-1);
  letter-spacing: var(--letter-spacing-subtitle-1);
  /* padding-x was 1.5rem, but this is a lot and would make most 3-tab bars scroll.. */
  padding:
    calc(var(--inset-y) * 0.75rem)
    calc(var(--inset-x) * 0.75rem);
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
