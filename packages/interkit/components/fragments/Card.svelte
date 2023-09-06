<script>
  import { getContext } from "svelte"
  import AspectRatio from '../AspectRatio.svelte'
  import MediaFileImage from '../MediaFileImage.svelte'
  import CardHeader from "./CardHeader.svelte"
  import { getShowDummyDataStore, dummyLorem1Sentence } from '../dummyDataHelpers.js'  

  export let mainClass = ''
  
  export let variant = "full"; // full | large | medium | small | extra-small (card is just like small but with small header)
  export let state = "enabled"; // enabled | pressed | selected
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
    small: "square",
    "extra-small": "square"
  }

  const imageStyleForVariant = {
    full: "",
    large: "border-radius: calc(var(--border-radius) * 1.5); --card-border-radius: calc(var(--border-radius) * 1.5);",
    medium: "border-radius: calc(var(--border-radius) * 1.5); --card-border-radius: calc(var(--border-radius) * 1.5);",
    small: "border-radius: var(--border-radius); --card-border-radius: var(--border-radius);",
    "extra-small": "border-radius: var(--border-radius); --card-border-radius: var(--border-radius);"
  }

  const headerVariant = {
    full: "full",
    large: "large",
    medium: "medium",
    small: "medium",
    "extra-small": "small"
  }

  const DataCardContext = getContext("DataCard")

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="container {variant} {state} {hoverPointer ? "hoverPointer" : ""} Card
    {mainClass}
    {mainClass}--variant{variant}
    {mainClass}--state{state}
    {mainClass}--hoverpointer{hoverPointer}
  "
  on:click
  >
  <div class="header-wrapper">
    {#if imageRef?.value}
      <div class="image Card__image">
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
    <div class="header Card__header">
      <CardHeader 
        {rightArrow} 
        variant = {headerVariant[variant]}
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
    <div class="content-wrapper Card__content">
      <slot name="content"/>
    </div> 
  {/if}
  {#if !DataCardContext?.slots?.content && $showDummyData}
    <div class="content-wrapper Card__content">
      Content: {dummyLorem1Sentence}
    </div> 
  {/if}
</div>

<style>
  
  .container {
    background-color: var(--color-background);
    text-align: left;
  }

  .container:not(:last-child) {
    margin-bottom: calc(var(--outset-y) * 0.5rem);
  }

  .container:not(.full) {
    box-shadow: var(--box-shadow);
  }

  .container.selected {
    background-color: var(--color-background-highlight);
  }

  .header {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .container.hoverPointer:hover {
    cursor: pointer;
  }

  .container.full {
    padding-bottom: calc(var(--inset-y) * 0.5rem);
  }

  .container.full .header {
    padding: calc(var(--inset-y) * 0.75rem) calc(var(--inset-x) * 0.5rem) 0 calc(var(--inset-x) * 0.5rem);
  }

  .container.full .content-wrapper {
    padding:
      0
      calc(var(--inset-x) * 1rem)
      calc(var(--inset-y) * 1rem)
      calc(var(--inset-x) * 1rem);
  }

  .container.large,
  .container.medium,
  .container.small,
  .container.extra-small {
    --card-inset: calc(var(--inset) * 0.5rem);
    padding: var(--card-inset);
  }

  .container.large,
  .container.medium {
    /* parallels imageStyleForVariant */
    border-radius: calc(var(--border-radius) * 1.5 + var(--card-inset));
  }

  .container.small,
  .container.extra-small {
    /* parallels imageStyleForVariant */
    border-radius: calc(var(--border-radius) + var(--card-inset));
  }

  .container.large .image {
    margin-bottom: calc(var(--inset-y) * 0.5rem);
  }

  .container.medium .header-wrapper,
  .container.small .header-wrapper,
  .container.extra-small .header-wrapper {
    display: flex;
    flex-direction: row;
  }

  .container.medium .image {
    width: 6rem;
    height: 6rem;
    margin-right: calc(var(--inset-x) * 0.5rem);
    flex-shrink: 0;
  }

  .container.small .header,
  .container.medium .header {
    padding:
      calc(var(--inset-x) * 0.5rem)
      calc(var(--inset-x) * 0.25rem)
      calc(var(--inset-x) * 0.25rem)
      0;
    flex: 1;
    min-width: 0;
  }

  .container.small .image,
  .container.extra-small .image {
    width: 3.5rem;
    height: 3.5rem;
    margin-right: calc(var(--inset-x) * 0.25rem);
    flex-shrink: 0;
  }

  .container.small .header,
  .container.extra-small .header {
    padding-left: calc(var(--inset-x) * 0.125rem);
    flex: 1;
    min-width: 0;
  }

  .content-wrapper {
    font: var(--font-content-body-2);
    margin: calc(var(--inset-y) * 0.5rem) 0 0 0;
    padding:
      0
      calc(var(--inset-x) * 0.5rem)
      calc(var(--inset-y) * 0.25rem)
      calc(var(--inset-x) * 0.5rem);
  }

  .container.full .content-wrapper {
    padding-left: calc(var(--inset-x) * 1.5rem);
    padding-right: calc(var(--inset-x) * 1.5rem);
  }

  .container.small  .content-wrapper :global(.ButtonBar),
  .container.medium .content-wrapper :global(.ButtonBar),
  .container.large  .content-wrapper :global(.ButtonBar) {
    margin:
      calc(var(--inset-y) * 0.5rem)
      calc(var(--inset-x) * -0.5rem);
    width: calc(100% + var(--inset-y) * 1rem);
  }

  .container.full .content-wrapper :global(.ButtonBar) {
    margin:
      calc(var(--inset-y) * 0.5rem)
      calc(var(--inset-x) * -1rem);
    width: calc(100% + var(--inset-y) * 2rem);
  }

  .container .content-wrapper :global(.ButtonBar + .ButtonBar__HelpText) {
    margin-top: calc(var(--inset-y) * -0.5rem);
  }

</style>
