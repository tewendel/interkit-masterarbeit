<script>

</script>

<span class="Button button" on:click>
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
  .button:empty {
    display: none;
  }
</style>