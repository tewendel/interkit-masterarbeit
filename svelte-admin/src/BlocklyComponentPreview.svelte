<script>

  import { Button } from "carbon-components-svelte";
  import AddFilled from "carbon-icons-svelte/lib/AddFilled.svelte";
  import Help from "carbon-icons-svelte/lib/Help.svelte";

  import { docsURL } from './docs.js'

  export let blockName;
  const imageSrc = docsURL + "/images/component_previews/" + blockName + ".png";
  
  export let add;
  export let help;

  export let activeBlockPreview; // the blockName that is currently active

  $: active = activeBlockPreview == blockName;

  const toggleActive = () => {
    if(active) {
      activeBlockPreview = null;
    } else {
      activeBlockPreview = blockName;
    }
  }
  
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="container" on:click={toggleActive} class:active>
  <span title={blockName}>{blockName}</span>
  <div class="preview">
    <div class="previewImage" style="background-image: url({imageSrc})"></div>
    {#if active}
      <div class="buttons" on:click|stopPropagation={()=>{}}>
        <Button
          kind="ghost"
          size="small"
          tooltipPosition="top"
          icon={AddFilled}
          on:click={add}
          iconDescription="add"
        />
        <Button
          kind="ghost"
          size="small"
          tooltipPosition="top"
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
    padding-bottom: 0;
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
  .previewImage {
    width: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  
</style>
