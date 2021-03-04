<script>

export let open = false
export let name

const toggle = () => {
  open = !open
}

</script>

<div class="area">
  <h2>{name}<button on:click={toggle}>{open ? "close panel" : "open panel"}</button></h2>
  <div class="content" style="display: {open ? 'block' : 'none'}">
    <slot {open}></slot>
  </div>
</div>


<style>

  h2 {
    background-color: black;
    color: lightgray;
    padding: 10px;
    margin: 0;
  }

  button {
    margin-left: 5px;
    float: right;
  }

  .area {
    border: 1px solid gray;
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .content {
    margin: 10px;
    padding: 10px;
  }


</style>

