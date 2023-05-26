<script>

  import { setContext } from 'svelte';
  import Icon from './Icon.svelte'
  import WithClickEffect from './WithClickEffect.svelte'
  
  export let nopadding = false
  export let type = "secondary" // primary | secondary | ghost | link | spacer
  export let size =  "medium" // small | medium | large // TODO inherit from ButtonBar?
  export let flex = "normal" // normal | fill
  export let height = "fixed" // fixed | auto
  export let text = undefined;
  export let selected = false  
  export let effect; // clickEffect object used to decide what happens on click

  // context for icons to know what path they are on
  setContext("button", {
    type,
    path: effect?.path    
  })

</script>

<WithClickEffect {effect}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <span
    on:click 
    class={`Button Button--${type} Button--${size} button ${type} ${size} ${flex} height-${height}`}
    class:primary={type==='primary'}
    class:selected={selected}
    class:Button--selected={selected}
    class:nopadding 
  >
    <slot/>
    { text || "" }
    {#if type == "list-item"}
      <div class="button-extra-icon">
        <Icon type="Thin-Arrow-Right"/> 
      </div>
    {/if}
  </span>
</WithClickEffect>

<style>

  .button {
    border: var(--border-width) solid var(--border-color);
    color: var(--color-text-button);
    border-radius: var(--border-radius-button);
    background-color: var(--color-background-button);
    box-shadow: var(--box-shadow);
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

  .button.normal {
    flex-grow: 0;
  }

  .button.fill {
    flex-grow: 1;
  }

  .button.small {
    min-height: 32px;
    padding: var(--distance-tiny) var(--distance-s);
    font: var(--font-button);
  }

  .button.small.height-fixed {
    height: 32px;
  }

  .button.medium {
    min-height: 40px;
    padding: var(--distance-tiny) var(--distance-m);
    font: var(--font-button);
  }

  .button.medium.height-fixed {
    height: 40px;
  }

  .button.large {
    min-height: 56px;
    padding: var(--distance-tiny) var(--distance-s-m);
    font: var(--font-headline-5);
  }

  .button.large.height-fixed {
    height: 56px;
  }

  .button.selected {
    background-color: var(--color-background-highlight);
  }

  .button.ghost {
    background-color: transparent;
  }

  .button.link {
    border: none;
    background-color: transparent;
    padding-left: var(--distance-xs);
    padding-right: var(--distance-xs);
  }

  .button.spacer {
    visibility: hidden;
    pointer-events: none;
  }

  .button.list-item {
    width: 100%;
    justify-content: left;
    font: var(--font-headline-4);
    border: none;
    border-bottom: var(--border-width) solid var(--border-color);
    border-radius: 0%;
  }

  .button.list-item .button-extra-icon {
    position: absolute;
    right: var(--distance-s);
    display: flex;
    align-items: center;
  }

  .button.nav-tab {
    border: none;
    border-radius: 0;
    font: var(--font-headline-3);
  }

  .button.nav-tab-selected {
    font-weight: bold;
  }

  .primary {
    color: var(--color-text-button-primary);
    background-color: var(--color-background-button-primary);
  }

  span.button {
    font-size: var(--font-size-buttons);
  }

  .nopadding {
    padding: 0;
  }

  .button:empty {
    display: none;
  }

  .button.noborder {
    border: none;
  }

</style>
