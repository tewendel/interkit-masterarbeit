<script>
  import { createEventDispatcher } from 'svelte';
  import Button from '../Button.svelte'
  import Icon from '../Icon.svelte'

  import Overlay from '../Overlay.svelte';
  import TopNavBarCustom from '../TopNavBarCustom.svelte';

  import MediaRecorder from '../MediaRecorder.svelte';

  let messageText = ""

  export let chatInterface
  export let userId
  export let boardId
  export let nodeId

  const dispatch = createEventDispatcher();

  const submit = () => {
    if(messageText && messageText != "") {
      dispatch('submit', {
        messageText
      });
      messageText = ""
    }
  }

  const handleKeydown = (event)=>{
    if (event.which === 13) {
        submit()
    }
  }

  let showCamera = false
  const openCamera = () => {
    showCamera = true;
  }
  const closeCamera = () => {
    showCamera = false;
  }
  const onCameraSuccess = (result) => {
    console.log("onCameraSuccess", result)
    showCamera = false;
    dispatch('imageSubmit', {
        imageKey: result?.key
    });
  }

</script>

<div class="ChatInput container">
  {#if chatInterface?.photo }
    <div class="left-button">
      <Button on:click={openCamera} type="ghost">
        <Icon type="Full-Camera"></Icon>
      </Button>
    </div>
  {/if}
  {#if chatInterface?.text}
    <input class="ChatInput__input input" type="text" bind:value={messageText} on:keydown={handleKeydown}/>
    <Button on:click={submit} type="ghost">
      <Icon type="Full-Send"></Icon>
    </Button>
  {/if}
</div>

{#if showCamera}
<Overlay>
  <TopNavBarCustom>
    <svelte:fragment slot="left">
        <Button type="link" on:click={closeCamera}>
          <Icon type="arrow-left" />
        </Button>
    </svelte:fragment>
    <svelte:fragment slot="content">
      <div style="padding-top: var(--distance-s)">
        <MediaRecorder
          mode="image"
          meta={{ userGenerated: "yes", userId, boardId, nodeId }}
          onUploadSuccess={onCameraSuccess}
        />
      </div>
    </svelte:fragment>
  </TopNavBarCustom>
</Overlay>
{/if}

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
  .left-button {
    margin-right: var(--distance-s);
  }
</style>
