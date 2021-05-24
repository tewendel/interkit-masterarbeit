<script>
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  export let icon = "";
  export let pageOpen
  export let onClick;

</script>

<nav class="TopNavBar" class:pageOpen>
  {#if icon}
    <span class="TopNavBar__Button button">
      <Button on:click={onClick}>
        <Icon type={icon} />
      </Button>
    </span>
  {/if}
  <span class="TopNavBar__Label label" on:click={onClick}>
    <slot />
  </span>
</nav>

<style>
  nav {
    display: flex;
    height: 55px;
    width: 100%;
    align-content: left;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 1px solid black;
  }

  .label, .button {
    margin: 8px;
  }

  .label {
    flex: 1;
    font-size: 24px;
    line-height: 32px;
  }

  nav span:hover {
    cursor: pointer;
  }

</style>