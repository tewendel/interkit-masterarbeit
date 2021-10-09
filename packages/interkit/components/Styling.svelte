<script>
  
  let primary_color = "#27EBBC"
  let font_family = "inter"
  let google_font = "Inter:wght@200;300;400;500"
  let background_color = "#FFFFFF"
  let background_color_highlight = "#E7EB27"

  export let colorText = 'inherit'
  export let colorTextHeadline = 'inherit'
  export let colorTextButtonPrimary = 'inherit'
  export let colorBackground = 'inherit'
  export let fontFamilyText = 'inherit'
  export let fontFamilyHeadline = 'inherit'
  export let borderRadius = 'inherit'
  export let borderRadiusButton = 'inherit'
  export let borderWidth = 'inherit'
  export let shadowAmount = 'inherit'

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

  // could be DRYer, but it's only two of them...

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
  --shadow-amount: ${shadowAmount};
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
  {#if googleFontHeadline}
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href={`https://fonts.googleapis.com/css2?family=${googleFontHeadline}&display=swap`} rel="stylesheet">
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
