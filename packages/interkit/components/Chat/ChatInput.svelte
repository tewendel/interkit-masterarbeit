<script>
  import { createEventDispatcher } from 'svelte';
  import Button from '../Button.svelte'
  import Icon from '../Icon.svelte'

  import Overlay from '../Overlay.svelte';
  import TopNavBarCustom from '../TopNavBarCustom.svelte';
  import OverlayFull from '../OverlayFull.svelte'

  import MediaRecorder from '../MediaRecorder.svelte';

  import { getShowDummyDataStore } from '../dummyDataHelpers.js' 
  let showDummyData = getShowDummyDataStore()

  let messageText = ""

  export let chatInterface
  export let userId
  export let boardId
  export let nodeId

  $: emptyInterface = !chatInterface.text && !chatInterface.image && !$showDummyData

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

<div class="ChatInput container" class:emptyInterface>
  {#if chatInterface?.photo || $showDummyData}
    <div class="ChatInput__ButtonsLeft left-button">
      <Button on:click={openCamera} type="link" dummyNoText>
        <Icon type="Full-Camera"></Icon>
      </Button>
    </div>
  {/if}
  {#if chatInterface?.text || $showDummyData}
    <input class="ChatInput__Input input" type="text" bind:value={messageText} on:keydown={handleKeydown}/>
    <Button on:click={submit} type="link" dummyNoText>
      <Icon type="Full-Send"></Icon>
    </Button>
  {/if}
</div>

{#if showCamera}
  <OverlayFull closeMethod={closeCamera} classes="ChatInput__OverlayFull">
    <div class="ChatInput__Camera camera-container">
      <MediaRecorder
        mode="image"
        meta={{ userGenerated: "yes", userId, boardId, nodeId }}
        onUploadSuccess={onCameraSuccess}
        cameraFacingMode={chatInterface?.cameraFacingMode}
      />
    </div>
  </OverlayFull>
{/if}

<style>
  .container {
    background-color: var(--color-background-backdrop);
    display: flex;
  }
  .container:not(.emptyInterface) {
    padding: var(--distance-s);
  }
  .input {
    flex: 1;
    padding: var(--distance-s);
    border-radius: var(--border-radius);
    border: var(--border-width) solid var(--color-border);
    background-color: var(--color-background);
    margin-right: var(--distance-m);
    min-width: 0; /* makes flex-shrink work for <input> https://stackoverflow.com/a/42421490/629238 */
  }
  .input:focus {
    border-color: var(--color-text);
  }
  .left-button {
    margin-right: var(--distance-m);
  }
  .camera-container {
    height: 100%;
    width: 100%;
    background-color: var(--color-background);
  }
</style>
