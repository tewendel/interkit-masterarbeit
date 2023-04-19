<script>

  import { Button } from "carbon-components-svelte";
  import AddFilled from "carbon-icons-svelte/lib/AddFilled.svelte";
  import Help from "carbon-icons-svelte/lib/Help.svelte";
  

  export let blockName;
  export let imageSrc;
  export let add;
  export let help;

  let active = false;

  const toggleActive = () => {
    active = !active;
  }
  
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="container" on:click={toggleActive} class:active>
  <span title={blockName}>{blockName}</span>
  <div class="preview">
    {#if imageSrc}
      <img class="blockPreviewImage" src={imageSrc}>
    {:else}
      <div class="previewImagePlaceholder"></div>
    {/if}
    {#if active}
      <div class="buttons">
        <Button
          kind="ghost"
          size="small"
          icon={AddFilled}
          on:click={add}
          iconDescription="add"
        />
        <Button
          kind="ghost"
          size="small"
          icon={Help}
          on:click={help}
          iconDescription="docs"
        />
      </div>
    {/if}
  </div>
</div>

<style>
  .container {
    padding: 5px;
    margin-bottom: 5px;
  }
  .container span {
    text-overflow: "...";
    overflow: hidden;
    display: inline-block;
    width: 100%;
    padding-bottom: 2px;
  }
  .container:hover {
    cursor:pointer;
  }
  .active {
    background-color: #eee;
  }
  .preview, .blockPreviewImage, .previewImagePlaceholder, .buttons {
    display: flex;
  }
  .preview {
    flex-direction: row;
  }
  .buttons {
    flex-direction: column;
    flex: 0.25;
  }
  .blockPreviewImage {
    flex: 0.75;
  }
  .previewImagePlaceholder {
    width: 100%;
  }
  
</style>
