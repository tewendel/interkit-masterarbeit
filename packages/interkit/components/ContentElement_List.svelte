<script>

  import { util } from '../'
  import AspectRatio from './AspectRatio.svelte'
  import MediaFileImage from './MediaFileImage.svelte'
  
  export let element; // must be used with a prop (ElementList oder ElementProvider)
  console.log("contentElement_List with prop", element);
  if(!element) {
    alert("this needs an element prop, for example from ElementList or ElementProvider")
  }
  
  export let titleColumn
  export let subtitleColumn
  export let imageColumn
  
  $: title = util.rowVal(element, titleColumn)
  $: subtitle = util.rowVal(element, subtitleColumn)
  $: imageRef = util.rowVal(element, imageColumn)

  export let subtitleTag // special Tag to show before subtitle
  
</script>

{#if element}

  <section class={`ContentElement container`}>

    <figure class="ContentElement__Picture ContentElementAudio__Picture picture">
      <AspectRatio>
        <MediaFileImage objectFit="cover" fitDimension="both" mediafileRef={imageRef} />    
      </AspectRatio>
    </figure>
      
    <div>

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

{/if}

<style>
  .subtitleTag {
    color: #888;
  }

</style>
