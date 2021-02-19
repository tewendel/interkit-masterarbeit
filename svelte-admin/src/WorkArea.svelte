<script>

export let open = false
export let name

const toggle = () => {
  open = !open
}

</script>

<div class="area">
  <h2>{name}<button on:click={toggle}>{open ? "close" : "open"}</button></h2>
  <div style="display: {open ? 'block' : 'none'}">
    <slot></slot>
  </div>
</div>


<style>

  h2 {
    margin-top: 0;
    margin-bottom:5px;
  }

  button {
    margin-left: 5px;
  }

  .area {
    border: 1px solid gray;
    margin: 10px;
    padding: 10px;
  }


</style>

