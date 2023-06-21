<script>

  import WithEffect from './WithEffect.svelte'
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { getShowDummyDataStore } from './dummyDataHelpers.js'  
  let showDummyData = getShowDummyDataStore();

  import { useLocation } from 'svelte-navigator';  
  let location;
  try {
    location = useLocation();
  } catch(e) {
    console.log(e)
  }

  export let effect;
  export let text;
  export let disabled;

  if($showDummyData) {
    text = "Btn Text"
  }

  $: active = (effect?.effectType == "route" && $location?.pathname == effect?.path) ? "active" : ""    
  
  let withIcon = $$slots.default ? "withIcon" : ""
  setContext("iconHeight", "24px")

  const iconFullStore = writable(active)
  $: iconFullStore.set(active)
  setContext("iconFull", iconFullStore)
  
</script>

  <WithEffect {effect} let:execute>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="container {withIcon} {active} {disabled ? "disabled" : ""}" on:click={()=>{if(!disabled) execute()}}>
      {#if withIcon}
        <div class="icon-container">
          <slot/>
        </div>
      {/if}
      <span>{text}</span>
    </div>
  </WithEffect>

<style>

  .container {
    height: var(--distance-xxl);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: var(--distance-tiny)
  }

  .container:hover {
    cursor: pointer;
  }

  .container span {
    font: var(--font-caption-bold);
  }

  .container.active:not(.withIcon) span {
    text-decoration: underline;
  }

  .container.withIcon span {
    font: var(--font-overline);
    letter-spacing: var(--letter-spacing-overline);
  }

  .icon-container {
    display: flex;
    justify-content: center;
    border-radius: calc(var(--border-radius) / 2);
    padding: var(--distance-xs) var(--distance-m);
    box-sizing: border-box;
  }

  .container.active .icon-container {
    background-color: var(--color-background-highlight);
  }

  .container.disabled {
    opacity: 0.4;
  }


</style>