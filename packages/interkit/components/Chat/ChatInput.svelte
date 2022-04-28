<script>
  import { createEventDispatcher } from 'svelte';
  import Button from '../Button.svelte'
  import Icon from '../Icon.svelte'

  let messageText = ""

  const dispatch = createEventDispatcher();

  const submit = () => {
    dispatch('submit', {
      messageText
    });
    messageText = ""
  }

  const handleKeydown = (event)=>{
    if (event.which === 13) {
      submit()
    }
  }

</script>

<div class="ChatInput container">
  <input class="ChatInput__input input" type="text" bind:value={messageText} on:keydown={handleKeydown}/>
  <Button on:click={submit} type="ghost">
    <Icon type="Full-Send"></Icon>
  </Button>
</div>

<style>
  .container {
    background-color: var(--color-background);
    display: flex;
    padding: var(--distance-s);
  }
  .input {
    flex: 1;
    padding: var(--distance-s);
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border);
    background-color: var(--color-background-highlight);
    margin-right: var(--distance-s);
  }
</style>