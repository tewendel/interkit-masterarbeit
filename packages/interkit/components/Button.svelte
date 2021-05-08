<script>
  export let inverse = false
  export let nopadding = false
</script>

<span class="Button button" class:nopadding on:click class:inverse>
  <slot />
</span>

<style>
  .button {
    padding: 8px;
    border: 1px solid rgba(0, 0, 0, 0.87);
    border-radius: 16px;
    background-color: white;
    display: inline-flex;
    overflow: hidden;
  }

  .nopadding {
    padding: 0;
  }

  .button.inverse {
    background-color: black;
    color: white;
  }
  .button:empty {
    display: none;
  }
</style>