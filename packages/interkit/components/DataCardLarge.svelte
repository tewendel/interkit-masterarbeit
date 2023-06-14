<script>

  import { InterkitClient, util } from '..'
  import { getShowDummyDataStore } from './dummyDataHelpers.js'
  import AspectRatio from './AspectRatio.svelte'
  import MediaFileImage from './MediaFileImage.svelte'
  import LinkConditional from './LinkConditional.svelte';
  import Icon from './Icon.svelte'

  import { getContext } from 'svelte';
  let element = getContext("element");
  console.log("DataCardLarge got element store from context", $element)
  if(!element) {
    console.warn("DataCardLarge needs an element context, for example from DataList")
  }

  export let onSelectRoute
  
  export let titleColumn
  export let subtitleColumn
  export let imageColumn

  export let checkedAnnotation = "checked"
  const elementProperties = InterkitClient.getGlobalStore("elementProperties")

  $: title = util.rowVal($element, titleColumn)
  $: subtitle = util.rowVal($element, subtitleColumn)
  $: imageRef = util.rowVal($element, imageColumn)
  
  export let subtitleTag // special Tag to show before subtitle

  let showDummyData =  getShowDummyDataStore();
  const dummyData = {
    title: "Title",
    subtitleTag: "Tag",
    subtitle: "Subtitle"
  }
  
</script>

{#if $element || $showDummyData}

  <LinkConditional condition={onSelectRoute} to="{onSelectRoute}/{$element?.key}">
    <section class={`ContentElement ContentElement_List container`}>

      <figure class="ContentElement__Picture ContentElementAudio__Picture picture">
        <AspectRatio>
          <MediaFileImage objectFit="cover" fitDimension="both" mediafileRef={imageRef} />    
        </AspectRatio>
      </figure>
        
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

        {#if $showDummyData || $elementProperties?.[$element?.key]?.[checkedAnnotation] == "true"}
          <div class="check-icon">
              <Icon type="check" height="24px"/>
          </div>
        {/if}

      </div>

    </section>
  </LinkConditional>

{/if}

<style>
  .container {
    margin: 0;
  }
  .content {
    padding: var(--distance-m) var(--distance-l) var(--distance-s) var(--distance-m);
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
  .content {
    position: relative;
  }
  .check-icon {
    position: absolute;
    top: var(--distance-m);
    right: var(--distance-m);
  }

</style>
