<script>
  
  export let googleFont = "Inter:wght@400;500;600;700" // regular medium semi-bold bold
  export let googleFont2 = "Inter:wght@400;500;600;700"
  export let colorText = '#32332e'
  export let colorTextHeadline = '#32332e'
  export let colorTextButtonPrimary = 'white'
  export let colorBackground = 'white'
  export let colorBackgroundHighlight = '#F0F6F6'
  export let colorBorder = 'black'
  export let fontFamilyText = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Roboto", sans-serif'
  export let fontFamilyHeadline = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Roboto", sans-serif'
  export let borderRadius = '16px'
  export let borderRadiusButton = '16px'
  export let borderWidth = '1px'
  export let boxShadow = 'none'
  export let distanceScaleFactor = '1.0'

  export let fontSizeHeadline1 = '30px';

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

  /* from user */

  --color-text: ${colorText};
  --color-text-headline: ${colorTextHeadline};
  --color-text-button-primary: ${colorTextButtonPrimary};
  --color-background: ${colorBackground};
  --color-background-highlight: ${colorBackgroundHighlight};
  --color-border: ${colorBorder};
  --font-family-text: ${fontFamilyText};
  --font-family-headline: ${fontFamilyHeadline};
  --border-radius: ${borderRadius};
  --border-radius-button: ${borderRadiusButton};
  --border-width: ${borderWidth};
  --box-shadow: ${boxShadow};
  --distance-scale-factor: ${parseFloat(distanceScaleFactor) || 1.0};
  --font-size-headline-1: ${fontSizeHeadline1};
  --distance-base: 8px;

  /* constant */

  --distance-tiny: 2px;

  /* derived defaults */

  --border-color: var(--color-text);
  --color-background-button-primary: var(--color-text);
  --color-text-button: var(--color-text);
  --color-background-button: var(--color-background);

  --distance-xs: calc(var(--distance-base) * var(--distance-scale-factor) / 2.0);
  --distance-s: calc(var(--distance-base) * var(--distance-scale-factor) / 1);
  --distance-m: calc(var(--distance-base) * var(--distance-scale-factor) * 2);
  --distance-l: calc(var(--distance-base) * var(--distance-scale-factor) * 4);
  --distance-xl: calc(var(--distance-base) * var(--distance-scale-factor) * 6);
  
  --font-headline-1: 400 48px/56px var(--font-family-headline);
  --font-headline-2: 400 30px/36px var(--font-family-headline);
  --font-headline-3: 400 24px/32px var(--font-family-headline);
  --font-headline-4: 700 20px/24px var(--font-family-headline);
  --font-headline-5: 700 16px/24px var(--font-family-headline);
  --font-body-1: 400 16px/24px var(--font-family-text);
  --font-body-2: 400 14px/21px var(--font-family-text);
  --font-subtitle-1: 400 16px/24px var(--font-family-text);
  --font-subtitle-2: 500 14px/24px var(--font-family-text);
  --font-button: 600 12px/16px var(--font-family-text);
  --font-caption: 400 12px/16px var(--font-family-text);
  --font-caption-bold: 700 12px/16px var(--font-family-text);
  --font-overline: 500 10px/12px var(--font-family-text);

  --letter-spacing-headline-2: -0.5px;
  --letter-spacing-headline-3: -0.25px;
  --letter-spacing-headline-4: -0.25px;
  --letter-spacing-headline-5: -0.02em;
  --letter-spacing-body-1: -0.25px;
  --letter-spacing-subtitle-1: -0.15px;
  --letter-spacing-subtitle-2: 0.1px;
  --letter-spacing-overline: 1.5px;

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
  {#if googleFont2}
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href={`https://fonts.googleapis.com/css2?family=${googleFont2}&display=swap`} rel="stylesheet">
  {/if}
</svelte:head>

<style>
  .style {
    display: contents;
    height: 100%;
  }

  :global(html),
  :global(body) {
    height: 100%;
  }
</style>
