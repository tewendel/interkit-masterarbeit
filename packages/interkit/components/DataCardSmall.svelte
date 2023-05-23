<script>

  import { getContext } from 'svelte';
  import { writable } from 'svelte/store'
  import { showDummyDataStoreGenerator } from './dummyDataHelpers.js'
  
  import { InterkitClient, util } from '..'
  import AspectRatio from './AspectRatio.svelte'
  import MediaFileImage from './MediaFileImage.svelte'
  import LinkConditional from './LinkConditional.svelte';
  
  import Icon from './Icon.svelte'
  
  let element = getContext("element");
  if(!element) {
    console.warn("DataCardSmall needs an element context, for example from DataList")
  }
  
  export let titleColumn
  export let subtitleColumn
  export let imageColumn
  export let onSelectRoute

  export let checkedProperty = "checked"
  const elementProperties = InterkitClient.getGlobalStore("elementProperties")

  
  $: title = util.rowVal($element, titleColumn)
  $: subtitle = util.rowVal($element, subtitleColumn)
  $: imageRef = util.rowVal($element, imageColumn)

  export let subtitleTag // special Tag to show before subtitle

  const dummyData = {
    title: "Title",
    subtitleTag: "Tag",
    subtitle: "Subtitle"
  }

  let showDummyData = showDummyDataStoreGenerator()
  
</script>

{#if $element || $showDummyData}

<LinkConditional condition={onSelectRoute} to="{onSelectRoute}/{$element?.key}">
  <section class={`ContentElement container`}>
      
    {#if imageRef || $showDummyData}
      <figure class="ContentElement__Picture ContentElementAudio__Picture picture">
        <AspectRatio aspectRatioType="square">
          <MediaFileImage objectFit="cover" fitDimension="both" mediafileRef={imageRef} />    
        </AspectRatio>
      </figure>
    {/if}

    <div class="content">

      {#key title}
      <h3 class="title">
        {$showDummyData ? dummyData.title : title}
      </h3>
      {/key}

      <h4>
        {#if subtitleTag || $showDummyData}
          <span class="subtitleTag">{$showDummyData ? dummyData.subtitleTag : subtitleTag}</span>
        {/if}
        
        {#if subtitle || $showDummyData}
          <span class="subtitle">{$showDummyData ? dummyData.subtitle : subtitle}</span>
        {/if}
      </h4>
            
    </div>

    {#if $elementProperties?.[element?.key]?.[checkedProperty]}
      <div class="check-icon">
          <Icon type="check" height="24px"/>
      </div>
    {/if}

  </section>
  </LinkConditional>

{/if}

<style>
  .container {
    display: flex;
    padding: var(--distance-xs)
  }
  .content {
    padding: var(--distance-m) var(--distance-m) var(--distance-m) 0;
  }
  .content:first-child {
    padding-left: var(--distance-m);
  }

  .check-icon {
    position: absolute;
    top: var(--distance-m);
    right: var(--distance-m);
  }
  .picture {
    margin: var(--distance-s);
    border-radius: var(--border-radius-button);
    overflow: hidden;
    width: 96px;
    height: 96px;
  }
  .title {
    font: var(--font-content-headline-3);
    letter-spacing: var(--letter-spacing-content-headline-3);
    padding-bottom: var(--distance-tiny);
  }
  .subtitleTag {
    font: var(--font-headline-5);
    letter-spacing: var(--letter-spacing-headline-5);
    filter: brightness(2.75);
    padding-right: var(--distance-s);
  }
  .subtitle {
    font: var(--font-headline-5);
    letter-spacing: var(--letter-spacing-headline-5);
  }
  .special {
    margin-top: var(--distance-s);
    font: var(--font-subtitle-2);
    letter-spacing: var(--letter-spacing-subtitle-2);
  }

</style>
