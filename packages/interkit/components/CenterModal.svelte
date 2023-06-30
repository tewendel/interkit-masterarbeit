<script>

  import ModalHeader from "./fragments/ModalHeader.svelte"
  import ButtonBar from "./ButtonBar.svelte"
  import MediaFileImage from "./MediaFileImage.svelte";
  import AspectRatio from "./AspectRatio.svelte";
  import { getShowDummyDataStore } from './dummyDataHelpers.js'

  export let imageKey
  export let label
  export let headline
  export let prompt
  export let description

  export let size

  const aspectRatioType = {
    large: "element",
    medium: "square",
    small: "square",
  }

  const modalHeaderSize = {
    large: "large",
    medium: "medium",
    small: "medium"
  }

  let showDummyData =  getShowDummyDataStore();
  if($showDummyData) {
    description = "Description lorem ipsum..."
    imageKey = "123"
  }

</script>


  <div class="CenterModal container {size}">
    <div class="modal-card">
      <div class="image-header">
        {#if imageKey}
          <div class="image">
            <AspectRatio aspectRatioType={aspectRatioType[size]}>
              <MediaFileImage 
                objectFit="cover" 
                fitDimension="both"   
                mediafileRef={{type: "mediafile", value: imageKey}} 
                style="border-radius: calc(var(--border-radius) - 8px);"
              />
            </AspectRatio>
          </div>
        {/if}

        <div class="header">
          <ModalHeader
            size={modalHeaderSize[size]}
            {label}
            {headline}
            {prompt}
          />
        </div>
      </div>
      {#if description}<div class="description">{description}</div>{/if}
      <div class="buttons">
        <ButtonBar hideHelpText>
          <slot name ="buttons"/>
        </ButtonBar>
      </div>
    </div>
  </div>


<style>

  .container {
    
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--distance-s);
    box-sizing: border-box;
  }

  .modal-card {
    width: 100%;
    background-color: var(--color-background-highlight);
    padding: var(--distance-s);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
  }

  .container.medium .image {
    width: 96px;
  }

  .container.small .image {
    width: 56px;
  }

  .container.medium .image-header, .container.small .image-header {
    display: flex;
    gap: var(--distance-s);
  }

  .container.medium .image-header :nth-child(1), .container.small .image-header :nth-child(1) {
    order: 2;
  }

  .container.medium .image-header :nth-child(2), .container.small .image-header :nth-child(2) {
    order: 1;
  }

  .header {
    padding: 16px 0px 8px 16px; 
  }

  .container.medium .header, .container.small .header {
    padding: 16px 8px 8px 16px; 
  }

  .description {
    padding: 8px 16px 24px 16px; 
    font: var(--font-content-body-2);
    letter-spacing: var(--letter-spacing-content-body-2);
    color: var(--color-text-soft);
  }



</style>