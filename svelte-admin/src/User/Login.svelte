<script>
  import { InterkitClient } from 'interkit'
  import PlaygroundNotice from '../Atoms/PlaygroundNotice.svelte';

  import {
    Form,
    FormGroup,
    TextInput,
    PasswordInput,
    Button,
    ToastNotification
  } from "carbon-components-svelte";

  let username = "author"
  let password = "password";
  let isPlayground

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

<div style="max-width: 320px; display: flex; flex-direction: column;; text-align: center; margin-top: -1em; margin-bottom: 1em;">
  <PlaygroundNotice large bind:isPlayground>
    {#if isPlayground}
      <div class="playground-notice">
        ⚠️ This playground instance will reset and <b>DELETE</b> all projects regularly. 
        It is intended for testing, learning and exploration. 
        Do NOT start anything permanent here.
      </div>
    {/if}
  </PlaygroundNotice>
</div>    

<Form on:submit={submit}>
  <FormGroup>
    <TextInput bind:value={username} labelText="User name" autocomplete="username" disabled={isPlayground}/>
  </FormGroup>
  <FormGroup>
    <PasswordInput bind:value={password} labelText="Password" autocomplete="current-password" disabled={isPlayground}/>
  </FormGroup>
  <FormGroup>
    <Button type="submit">
      {#if isPlayground}
        Enter Playground
      {:else}
        Login
      {/if}
    </Button>
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

<style lang="scss">

  @use '@carbon/styles/scss/theme';
  @use '@carbon/type';

  .playground-notice {
    @include type.type-style("heading-01");
  }
</style>