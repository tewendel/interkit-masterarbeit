<script>
  import { getContext } from "svelte"
  import AspectRatio from '../AspectRatio.svelte'
  import MediaFileImage from '../MediaFileImage.svelte'
  import CardHeader from "./CardHeader.svelte"
  import { getShowDummyDataStore } from '../dummyDataHelpers.js'  
  
  export let variant = "full";
  export let rightArrow = false;
  export let hoverPointer;
  
  export let imageRef
  export let headline
  export let label1
  export let subtitle1
  export let label2
  export let subtitle2
  export let label3
  export let subtitle3
  export let description  
  
  let showDummyData = getShowDummyDataStore();
  if($showDummyData) {
    imageRef = {value: "123"}
  }

  const aspectRatioForVariant = {
    full: "large_overlay",
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

  const DataCardContext = getContext("DataCard")

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="container {variant} {hoverPointer ? "hoverPointer" : ""}" on:click>
  <div class="header-wrapper">
    {#if imageRef?.value}
      <div class="image">
          <AspectRatio aspectRatioType={aspectRatioForVariant?.[variant]}>
            <MediaFileImage 
              objectFit="cover" 
              fitDimension="both" 
              mediafileRef={imageRef} 
              style={imageStyleForVariant?.[variant]}
            />    
          </AspectRatio>
      </div>
    {/if}
    <div class="header">
      <CardHeader 
        {rightArrow} 
        {variant}
        {headline}
        {label1}
        {subtitle1}
        {label2}
        {subtitle2}
        {label3}
        {subtitle3}
        {description}
      >
        <svelte:fragment slot="chips">
          <slot name="chips"/>
        </svelte:fragment>
      </CardHeader>
    </div>
  </div>
  {#if DataCardContext?.slots?.content}
    <div class="content-wrapper">
      <slot name="content"/>
    </div> 
  {/if}
</div>

<style>
  
  .container {
    background-color: #FFFFFF;
  }

  .container.hoverPointer:hover {
    cursor:pointer;
  }

  .container.full {
    padding-bottom: 8px;
  }

  .container.full .header {
    padding: 12px 8px 0px 8px;
  }

  .container.full .content-wrapper {
    padding: 0px 16px 16px 16px;
  }

  .container.large, .container.medium, .container.small {
    padding: 8px;
    padding-bottom: 16px;
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

  .container.large .header-wrapper,
  .container.medium .header-wrapper,
  .container.small .header-wrapper {
    padding-bottom: 8px;
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
    min-width: 0;
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
    min-width: 0;
  }


  


</style>