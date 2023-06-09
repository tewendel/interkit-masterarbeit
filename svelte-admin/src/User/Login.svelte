<script>
  import { InterkitClient } from 'interkit'

  import {
    Form,
    FormGroup,
    TextInput,
    PasswordInput,
    Button,
    ToastNotification
  } from "carbon-components-svelte";

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

<Form on:submit={submit}>
  <FormGroup>
    <TextInput bind:value={username} labelText="User name" autocomplete="username"/>
  </FormGroup>
  <FormGroup>
    <PasswordInput bind:value={password} labelText="Password" autocomplete="current-password"/>
  </FormGroup>
  <FormGroup>
    <Button type="submit">Login</Button>
  </FormGroup>
</Form>

{#if error}
  <ToastNotification
    title="Error"
    lowContrast
    hideCloseButton
    caption={error}
    />
{/if}
