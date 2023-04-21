<script>

  import { util } from '..'
  import AspectRatio from './AspectRatio.svelte'
  import MediaFileImage from './MediaFileImage.svelte'
  import LinkConditional from './LinkConditional.svelte';

  import { getContext } from 'svelte';
  let element = getContext("element");
  console.log("DataElementPreview got element store from context", $element)
  if(!element) {
    alert("DataElementPreview needs an element context, for example from DataList")
  }

  export let onSelectRoute
  
  export let titleColumn
  export let subtitleColumn
  export let imageColumn
  
  $: title = util.rowVal($element, titleColumn)
  $: subtitle = util.rowVal($element, subtitleColumn)
  $: imageRef = util.rowVal($element, imageColumn)

  export let subtitleTag // special Tag to show before subtitle
  
</script>

{#if $element}

  <LinkConditional condition={onSelectRoute} to="{onSelectRoute}/{$element.key}">
    <section class={`ContentElement ContentElement_List container`}>

      <figure class="ContentElement__Picture ContentElementAudio__Picture picture">
        <AspectRatio>
          <MediaFileImage objectFit="cover" fitDimension="both" mediafileRef={imageRef} />    
        </AspectRatio>
      </figure>
        
      <div class="content">

        {#key title}
          <h3 class="title">
            {title}
          </h3>
        {/key}

        <h4>
          {#if subtitleTag}
            <span class="subtitleTag">{subtitleTag}</span>
          {/if}
          
          {#if subtitle}
            <span class="subtitle">{subtitle}</span>
          {/if}
        </h4>

      </div>

    </section>
  </LinkConditional>

{/if}

<style>
  .container {
    margin: 0 var(--distance-m) var(--distance-m) var(--distance-m);
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

</style>
