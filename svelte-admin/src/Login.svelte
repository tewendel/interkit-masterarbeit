<script>
  
  import { InterkitClient } from 'interkit'
  let username = "admin"
  let password = "password";

  const submit = async e => {
    e.preventDefault();
    await InterkitClient.login({username, password})
  }

</script>

<form on:submit={submit}>  
  <input bind:value={username} type="text"/><br/>
  <input bind:value={password} type="password"/><br/>
  <input type="submit" value="login">
</form>

<style>
  div {
    padding: 10px;
  }
  input, button {
    margin: 5px;
  }


</style>