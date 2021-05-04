<script>
  export let inverse = false
</script>

<span class="Button button" on:click class:inverse>
  <slot />
</span>

<style>
  .button {
    padding: 8px;
    border: 1px solid rgba(0, 0, 0, 0.87);
    border-radius: 16px;
    background-color: white;
    display: inline-block;
    overflow: hidden;
  }

  .button.inverse {
    background-color: black;
    color: white;
  }
  .button:empty {
    display: none;
  }
</style>