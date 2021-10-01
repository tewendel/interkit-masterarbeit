<script>
  
  export let primary_color = "#27EBBC"
  export let text_color = "#000000"
  export let font_family = "inter"
  export let google_font = "Inter:wght@200;300;400;500"
  export let background_color = "#FFFFFF"
  export let background_color_highlight = "#E7EB27"

  import { onMount } from 'svelte'

  onMount(async () => {
  })

  const fontFamily = (font_family ? font_family + ", " : "") +  '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Roboto", sans-serif'
  
</script>

<div class="style" style={`
    --font-family: ${fontFamily}; 
    --color-primary: ${primary_color};
    --color-text: ${text_color};
    --color-background: ${background_color};
    --color-background-highlight: ${background_color_highlight};

    --font-size-headline-1: 30px;
    --font-size-buttons: 12px;
    --font-size-regular: 14px;
  `} >
  <slot />
</div>

<svelte:head>
  {#if google_font}
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href={`https://fonts.googleapis.com/css2?family=${google_font}&display=swap`} rel="stylesheet">
  {/if}
</svelte:head>

<style>
  .style {
    display: contents;
  }

  :global(html),
  :global(body) {
    height: 100%;
  }
</style>