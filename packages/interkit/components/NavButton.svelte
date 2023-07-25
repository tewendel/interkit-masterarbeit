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
  setContext("iconHeight", "1.5rem")

  const iconFullStore = writable(active)
  $: iconFullStore.set(active)
  setContext("iconFull", iconFullStore)
  
</script>

  <WithEffect {effect} let:execute>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="NavButton container {withIcon} {active} {disabled ? "disabled" : ""}"
      class:NavButton--withicon={withIcon}
      class:NavButton--active={active}
      class:NavButton--disabled={disabled}
      on:click={()=>{if(!disabled) execute()}}
      >
      {#if withIcon}
        <div class="NavButton__Icon icon-container">
          <slot/>
        </div>
      {/if}
      {#if text}<span class="NavButton__Text">{text}</span>{/if}
    </div>
  </WithEffect>

<style>

  .container {
    /* height: var(--distance-xxl); */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: calc(var(--outset-x) * 0.125rem)
  }

  .container:hover {
    cursor: pointer;
  }

  .container span {
    font: var(--font-caption-bold);
    letter-spacing: var(--letter-spacing-caption-bold);
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
    border-radius: var(--border-radius-navbutton);
    padding:
      calc(var(--inset-y) * 0.25rem)
      calc(var(--inset-x) * 1rem);
    box-sizing: border-box;
  }

  .container.active .icon-container {
    background-color: var(--color-background-highlight);
  }

  .container.disabled {
    opacity: 0.4;
  }


</style>
