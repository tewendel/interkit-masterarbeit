<script>
  import { InterkitClient } from 'interkit'

  let username = "admin"
  let password = "password";

  let error = null;

  const submit = async e => {
    e.preventDefault();
    try {
      await InterkitClient.login({username, password})
      error = null
    } catch (e) {
      console.log(e)
      error = e.message
    }
  }

</script>

<form on:submit={submit}>  
  <input bind:value={username} type="text" autocomplete="username"/><br/>
  <input bind:value={password} type="password" autocomplete="current-password"/><br/>
  <input type="submit" value="login">
</form>
{#if error}
  <div class="error">{error}</div>
{/if}

{#if error}
  <div class="error">{error}</div>
{/if}

<style>
  div {
    padding: 10px;
  }
  input, button {
    margin: 5px;
  }
  .error {
    color: red;
  }
</style>