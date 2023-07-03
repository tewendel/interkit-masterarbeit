<script>
  import { getContext } from "svelte"
  import AspectRatio from '../AspectRatio.svelte'
  import Label from '../Label.svelte'
  import Icon from '../Icon.svelte'
  import MediaFileImage from '../MediaFileImage.svelte'  
  import ButtonBar from '../ButtonBar.svelte'
  
  import { getShowDummyDataStore } from '../dummyDataHelpers.js'  

  export let mainClass = ''
  
  export let variant = "rounded";
  export let rightArrow = false;
  export let hoverPointer;
  export let flexibleSize = true;
  
  export let imageRef
  export let headline
  export let label1
  export let subtitle1
  export let description  
  export let disabled
  
  let showDummyData = getShowDummyDataStore();
  if($showDummyData) {
    imageRef = {value: "123"}
    headline = "headline"
    label1 = "label1"
    subtitle1 = "subtitle1"
    description = "description"
  }
  
  const DataTileContext = getContext("DataTile")
  console.log("DataTileContext", DataTileContext);

  let imageStyle = variant == "rounded" ? "border-radius: var(--border-radius);" : "";

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<AspectRatio aspectRatioType="square" disabled={!flexibleSize} mainClass="Tile">
  <div
    class="container {variant}
      Tile__Container--hoverpointer{hoverPointer}
      Tile__Container--flexiblesize{flexibleSize}
      Tile__Container--disable{disabled}
    "
    class:hoverPointer
    class:flexibleSize
    class:disabled
    on:click>
    {#if imageRef?.value}
      <div class="Tile__Image image">
          <AspectRatio aspectRatioType="square">
            <MediaFileImage 
              objectFit="cover" 
              fitDimension="both" 
              mediafileRef={imageRef} 
              style={imageStyle}
            />    
          </AspectRatio>
      </div>
    {/if}
    <div class="Tile__Header header">
        {#if label1}<Label content={label1} variant="normal"/>{/if}
        {#if subtitle1}<span class="Tile__Subtitle1 subtitle1">{subtitle1}</span>{/if}
        {#if headline}<span class="Tile__Headline headline">{headline}</span>{/if}
        {#if DataTileContext?.slots?.chips || $showDummyData}
          <slot name="chips"/>
        {/if}
        {#if rightArrow}
          <span class="Tile__RightArrow right-arrow">
            <Icon type="Thin-Arrow-Right"/>
          </span>
        {/if}
        {#if description}<span class="Tile__Description description">{description}</span>{/if}      
    </div>

    {#if DataTileContext?.slots?.buttons || $showDummyData}
      <div class="Tile__Buttons buttons-wrapper">
        <ButtonBar hideHelpText>
          <slot name="buttons"/>
        </ButtonBar>
      </div> 
    {/if}
</div>
</AspectRatio>

<style>

  .container {
    width: 126px;
    height: 126px;
    position: relative;
    background-color: var(--color-background);
    display: flex;
    flex-direction: column;
    padding: var(--distance-s);
    box-shadow: var(--box-shadow);
    box-sizing: border-box;
  }

  .container.disabled {
    opacity: 0.5;
  }

  .container.hoverPointer:hover {
    cursor: pointer;
  }

  .container.flexibleSize {
    width: 100%;
    height: 100%;
  }

  .container.rounded {
    border-radius: var(--border-radius);
  }

  .image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .header {
    position: relative;
    flex-shrink: 1;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow-y: scroll;
  }

  .buttons-wrapper {
    position: relative;
    flex-shrink: 0;
  }

  .headline {
    font: var(--font-headline-5);
    letter-spacing: var(--letter-spacing-headline-5);
  }

  .subtitle1 {
    font: var(--font-caption);
  }

  .description {
    font: var(--font-subtitle-2);
    letter-spacing: var(--letter-spacing-subtitle-2);
  }
  
</style>
