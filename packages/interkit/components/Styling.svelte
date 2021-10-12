<script>
  
  export let googleFont = "Inter:wght@300;400;500"
  export let colorText = '##32332E'
  export let colorTextHeadline = '##32332E'
  export let colorTextButtonPrimary = 'white'
  export let colorBackground = 'white'
  export let fontFamilyText = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Roboto", sans-serif'
  export let fontFamilyHeadline = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Roboto", sans-serif'
  export let borderRadius = '16px'
  export let borderRadiusButton = '16px'
  export let borderWidth = '1px'
  export let boxShadow = 'none'

  import { onMount } from 'svelte'

  onMount(async () => {
  })

  /*
  const setCssVar = (varName, value) => {
    document.documentElement.style.setProperty('--' + varName, value)
  }

  $: {
    setCssVar('borderRadius', borderRadius)
  }
  */

  const baseFontStack = '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Roboto", sans-serif'

  
/*
  // detecting google fonts, but lacks precise definition

  const googleFont = /[\+:@]/.test(fontFamilyText) ? fontFamilyText : false
  if (googleFont) {
    // strip off weights and such
    fontFamilyText = fontFamilyText.match(/^[\w\+]+/)?.[0]?.replace('+', ' ')
  }
  if (fontFamilyText !== 'inherit') fontFamilyText += ', ' + baseFontStack

  const googleFontHeadline = /[\+:@]/.test(fontFamilyHeadline) ? fontFamilyHeadline : false
  if (googleFontHeadline) {
    fontFamilyHeadline = fontFamilyHeadline.match(/^[\w\+]+/)?.[0]?.replace('+', ' ')
  }
  if (fontFamilyHeadline !== 'inherit') fontFamilyText += ', ' + baseFontStack
*/
  
</script>

<div class="style" style={`
  --color-text: ${colorText};
  --color-text-headline: ${colorTextHeadline};
  --color-text-button-primary: ${colorTextButtonPrimary};
  --color-background: ${colorBackground};
  --font-family-text: ${fontFamilyText};
  --font-family-headline: ${fontFamilyHeadline};
  --border-radius: ${borderRadius};
  --border-radius-button: ${borderRadiusButton};
  --border-width: ${borderWidth};
  --box-shadow: ${boxShadow};
  /* derived defaults */
  --border-color: var(--color-text);
  --color-background-button-primary: var(--color-text);
  --color-text-button: var(--color-text);
  --color-background-button: var(--color-background);
  /* to inherit */
  font-family: var(--font-family-text);
  color: var(--color-text);
  `} >
  <slot />
</div>

<svelte:head>
  {#if googleFont}
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href={`https://fonts.googleapis.com/css2?family=${googleFont}&display=swap`} rel="stylesheet">
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
