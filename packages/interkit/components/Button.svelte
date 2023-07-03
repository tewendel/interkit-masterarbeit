<script>
  import WithEffect from './WithEffect.svelte'
  import { setContext } from 'svelte';
  import { getShowDummyDataStore } from './dummyDataHelpers.js'  
  let showDummyData = getShowDummyDataStore();
  
  export let mainClass = ''
  export let text = undefined;
  export let type = "secondary" // primary | secondary | ghost | link
  export let size =  "medium" // small | medium | large 
  export let flex = "normal" // normal | fill
  export let height = "fixed" // fixed | auto
  export let disabled = false;
  export let effect; // effect object used to decide what happens on click
  export let selected = false // used by Chat choice
  export let dummyNoText = false

  setContext("iconHeight", size == "large" ? "32px" : null)

</script>

<WithEffect {effect} let:execute>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <span
    on:click
    on:click={()=>{if(!disabled) execute()}} 
    class={`${mainClass} Button Button--${type} Button--${size} Button--flex${flex} Button--height${height} button ${type} ${size} ${flex} height-${height} ${disabled ? "disabled": ""}`}
    class:primary={type==='primary'}
    class:Button--disabled={disabled}
    class:Button--selected={selected}
  >
    <slot/>
    {#if $showDummyData && !dummyNoText}
      Btn Text
    {:else}
      { text || "" }
    {/if}
  </span>
</WithEffect>

<style>

  ._workaround_ {}

  .button {
    border: var(--border-width) solid var(--color-border);
    color: var(--color-text-button);
    border-radius: var(--border-radius-button);
    background-color: var(--color-background-button);
    /*box-shadow: var(--box-shadow);*/
    display: inline-flex;
    gap: var(--distance-xs);
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    -webkit-user-select: none;
    -moz-user-select: none;   
    -ms-user-select: none;    
    user-select: none;        
    text-align: center;
    text-decoration: none;
    box-sizing: border-box;
  }

  span.button {
    font-size: var(--font-size-buttons);
  }

  /* flex */

  .button.normal {
    flex-grow: 0;
  }

  .button.fill {
    flex-grow: 1;
  }

  /* size */

  .button.small {
    min-height: 32px;
    padding: var(--distance-tiny) var(--distance-s);
    font: var(--font-button);
    border-radius: calc(var(--border-radius-button) * 0.75);
    gap: 4px;
  }

  .button.small.height-fixed {
    height: 32px;
  }

  .button.medium {
    min-height: 40px;
    padding: var(--distance-tiny) var(--distance-m);
    font: var(--font-button);
    gap: 4px;
  }

  .button.medium.height-fixed {
    height: 40px;
  }

  .button.large {
    min-height: 56px;
    padding: var(--distance-m) var(--distance-sm);
    font: var(--font-headline-5);
    border-radius: calc(var(--border-radius-button) * 1.5);
    gap: 8px;
  }

  .button.large.height-fixed {
    height: 56px;
  }

  /* type */

  .button.primary {
    color: var(--color-text-button-primary);
    background-color: var(--color-background-button-primary);
    border-color: var(--color-border-button-primary);
  }

  .Button--selected.primary,
  .button.primary:active {
    background-color: var(--color-background-button-primary-pressed);
  }

  
  .Button--selected.secondary,
  .button.secondary:active {
    background-color: var(--color-background-button-pressed);
  }

  .button.ghost {
    background-color: transparent;
  }

  .Button--selected.ghost,
  .button.ghost:active {
    background-color: var(--color-background-button-pressed);
  }

  .button.link {
    border: none;
    box-shadow: none;
    background-color: transparent;
    padding-left: var(--distance-xs);
    padding-right: var(--distance-xs);
  }

  .button.link:active {
    background-color: var(--color-background-button-pressed);
  }

  .button.danger {
    background-color: var(--color-background-button-danger);
    border: none;
    box-shadow: none;
  }

  .button.danger:active {
    background-color: var(--color-background-button-danger-pressed);
  }

  .button.disabled {
    opacity: 0.5;
  }



</style>
