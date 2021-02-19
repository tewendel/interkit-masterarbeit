<script>
  import config from './Style.yml'

  import { onMount } from 'svelte'

  onMount(async () => {
  })

  const fontFamily = (config.font_family.value ? config.font_family.value + ", " : "") +  '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Roboto", sans-serif'
  
</script>

<div class="syle" style={`
    --font-family: ${fontFamily}; 
    --color-primary: ${config.primary_color.value};
    --ion-font-family: ${fontFamily};
    --ion-color-primary: ${config.primary_color.value};
  `} >
  <slot />
</div>

<svelte:head>
  {#if config.google_font.value}
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href={`https://fonts.googleapis.com/css2?family=${config.google_font.value}&display=swap`} rel="stylesheet">
  {/if}
</svelte:head>