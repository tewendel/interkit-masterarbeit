<script>
  
  import { InterkitClient } from 'interkit'
  let username = "admin"
  let password = "password";

  const submit = async () => {
    await InterkitClient.login({username, password})
  }

</script>

<div>
  <input bind:value={username} type="text"/><br/>
  <input bind:value={password} type="password"/><br/>
  <button on:click={submit}>login</button>
</div>

<style>
  div {
    padding: 10px;
  }
  input, button {
    margin: 5px;
  }


</style>