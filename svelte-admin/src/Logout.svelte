<script>
  
  import { InterkitClient } from 'interkit'

  const click = async () => {
    await InterkitClient.logout()
  }

</script>

<div>
  <button on:click={click}>Logout</button>
</div>

<style>
  div {
    padding: 10px;
  }
  input, button {
    margin: 5px;
  }


</style>