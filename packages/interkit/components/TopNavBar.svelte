<script>
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  export let label;
  export let back = false;
  export let onClick;

</script>

<nav class:back class="TopNavBar">
  <span class="TopNavBar__Button button">
    <Button on:click={onClick}>
      <Icon type={back ? "arrow-left" : "settings"} />
    </Button>
  </span>
  <span class="TopNavBar__Label label">
    {label}
  </span>
</nav>

<style>
  nav {
    display: flex;
    height: 55px;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
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

  nav.back {
    justify-content: left;
  } 

  nav span:hover {
    cursor: pointer;
  }

</style>