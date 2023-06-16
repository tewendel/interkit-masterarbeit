<script>
  import AspectRatio from '../AspectRatio.svelte'
  import MediaFileImage from '../MediaFileImage.svelte'
  import CardHeader from "./CardHeader.svelte"
  import { getShowDummyDataStore } from '../dummyDataHelpers.js'  
  
  export let variant = "full";
  export let rightArrow = false;
  
  export let headline;  
  export let imageRef;

  let showDummyData = getShowDummyDataStore();
  if($showDummyData) {
    imageRef = {}
  }

  const aspectRatioForVariant = {
    full: "element",
    large: "element",
    medium: "square",
    small: "square"
  }

  const imageStyleForVariant = {
    full: "",
    large: "border-radius: var(--border-radius);",
    medium: "border-radius: var(--border-radius);",
    small: "border-radius: var(--border-radius);",
  }

</script>

<div class="container {variant}">
  <div class="header-wrapper">
    <div class="image">
      {#if imageRef}
        <AspectRatio aspectRatioType={aspectRatioForVariant?.[variant]}>
          <MediaFileImage 
            objectFit="cover" 
            fitDimension="both" 
            mediafileRef={imageRef} 
            style={imageStyleForVariant?.[variant]}
          />    
        </AspectRatio>
      {/if}
    </div>
    <div class="header">
      <CardHeader 
        {rightArrow} 
        {variant}
        {headline}
      >
        <svelte:fragment slot="widgets">
          <slot name="widgets"/>
        </svelte:fragment>

      </CardHeader>
    </div>
  </div>
</div>

<style>
  
  .container {
    background-color: #FFFFFF;
  }

  .container.full .header {
    padding: 12px 8px 16px;
  }

  .container.large, .container.medium, .container.small {
    padding: 8px;
    border-radius: 24px;
  }

  .container.large:not(:last-child),
  .container.medium:not(:last-child),
  .container.small:not(:last-child) {
    margin-bottom: 8px;
  }

  .container.large .image {
    margin-bottom: 8px;
  }

  .container.medium .header-wrapper,
  .container.small .header-wrapper {
    display: flex;
    flex-direction: row;
  }

  .container.medium .image {
    width: 96px;
    height: 96px;
    margin-right: 4px;
    flex-shrink: 0;
  }

  .container.medium .header {
    padding-left: 4px;
    flex: 1;
  }

  .container.small .image {
    width: 56px;
    height: 56px;
    margin-right: 4px;
    flex-shrink: 0;
  }

  .container.small .header {
    padding-left: 4px;
    flex: 1;
  }


  


</style>