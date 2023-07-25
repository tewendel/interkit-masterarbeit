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

  export let style

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


  <div class="CenterModal container {size}" {style}>
    <div class="CenterModal__Card modal-card">
      <div class="CenterModal__ImageHeader image-header">
        {#if imageKey}
          <div class="CenterModal__Image image">
            <AspectRatio aspectRatioType={aspectRatioType[size]}>
              <MediaFileImage 
                objectFit="cover" 
                fitDimension="both"   
                mediafileRef={{type: "mediafile", value: imageKey}} 
                style="border-radius: var(--centermodal-border-radius-inner);"
              />
            </AspectRatio>
          </div>
        {/if}

        <div class="CenterModal__Header header">
          <ModalHeader
            size={modalHeaderSize[size]}
            {label}
            {headline}
            {prompt}
          />
        </div>
      </div>
      {#if description}<div class="description">{description}</div>{/if}
      <div class="CenterModal__Buttons buttons">
        <ButtonBar hideHelpText>
          <slot name="buttons"/>
        </ButtonBar>
      </div>
    </div>
  </div>


<style>

  .container {
    --centermodal-border-radius-inner: var(--border-radius);
    --centermodal-border-radius: calc(var(--centermodal-border-radius-inner) + var(--inset) * 0.5rem);
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding:
      calc(var(--outset-y) * 0.5rem)
      calc(var(--outset-x) * 0.5rem);
    box-sizing: border-box;
  }

  .modal-card {
    width: 100%;
    background-color: var(--color-background-highlight);
    padding: calc(var(--inset) * 0.5rem);
    border-radius: var(--centermodal-border-radius);
    box-shadow: var(--box-shadow);
  }

  .container.medium .image {
    width: 6rem;
  }

  .container.small .image {
    width: 3.5rem;
  }

  .container.medium .image-header, .container.small .image-header {
    display: flex;
    gap: calc(var(--outset-y) * 0.5rem);
  }

  .container.medium .image-header :nth-child(1), .container.small .image-header :nth-child(1) {
    order: 2;
  }

  .container.medium .image-header :nth-child(2), .container.small .image-header :nth-child(2) {
    order: 1;
  }

  .header {
    padding:
      calc(var(--inset-y) * 1rem)
      0
      calc(var(--inset-y) * 0.5rem)
      calc(var(--inset-x) * 1rem);
  }

  .container.medium .header, .container.small .header {
    padding:
      calc(var(--inset-y) * 1rem)
      calc(var(--inset-x) * 0.5rem)
      calc(var(--inset-y) * 0.5rem)
      calc(var(--inset-x) * 1rem);
  }

  .description {
    padding:
      calc(var(--inset-y) * 0.5rem)
      calc(var(--inset-x) * 1rem)
      calc(var(--inset-y) * 1.5rem)
      calc(var(--inset-x) * 1rem);
    font: var(--font-content-body-2);
    letter-spacing: var(--letter-spacing-content-body-2);
    color: var(--color-text-soft);
  }



</style>
