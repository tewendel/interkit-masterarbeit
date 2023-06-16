<script>
  
  export let googleFont = "Inter:wght@400;500;600;700;900" // regular medium semi-bold bold bolder
  export let googleFont2 = "Inter:wght@400;500;600;700;900"
  export let colorText = '#32332e'
  export let colorTextHeadline = '#32332e'
  export let colorTextButtonPrimary = 'white'
  export let colorBackground = 'white'
  export let colorBackgroundHighlight = '#E5E5E5'
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
  --distance-xxl: calc(var(--distance-base) * var(--distance-scale-factor) * 8);
  
  /* cheat sheet for translation from figma 
  2 -> tiny
  4 -> xs  
  8 -> s
  16 -> m
  24 -> s+m
  32 -> l
  48 -> xl
  64 -> xxl
  */

  /**************************************/
  /* Typography - Interface             */
  /**************************************/

  /* Interface/Headline 1 */
  --font-headline-1: 400 48px/56px var(--font-family-headline);
  
  /* Interface/Headline 2 */
  --font-headline-2: 400 30px/36px var(--font-family-headline);
  --letter-spacing-headline-2: -0.5px;

  /* Interface/Headline 3 */
  --font-headline-3: 400 24px/28px var(--font-family-headline);
  --letter-spacing-headline-3: -0.25px;
  
  /* Interface/Headline 4 */
  --font-headline-4: 700 20px/24px var(--font-family-headline);
  --letter-spacing-headline-4: -0.25px;
  
  /* Interface/Headline 5 */
  --font-headline-5: 700 16px/24px var(--font-family-headline);
  --letter-spacing-headline-5: -0.02em;
  
  /* Interface/Body 1 */
  --font-body-1: 400 16px/24px var(--font-family-text);
  --letter-spacing-body-1: 0.25px;
  
  /* Interface/Body 2 */
  --font-body-2: 400 14px/21px var(--font-family-text);
  --letter-spacing-body-2: 0.25px;
  
  /* Interface/Subtitle 1 */
  --font-subtitle-1: 400 16px/21px var(--font-family-text);
  --letter-spacing-subtitle-1: 0.15px;
  
  /* Interface/Subtitle 2 */
  --font-subtitle-2: 500 14px/18px var(--font-family-text);
  --letter-spacing-subtitle-2: 0.1px;

  /* Interface/Button */
  --font-button: 600 12px/16px var(--font-family-text);

  /* Interface/Caption */
  --font-caption: 400 12px/16px var(--font-family-text);

  /* Interface/Caption - Bold */
  --font-caption-bold: 700 12px/16px var(--font-family-text);

  /* Interface/Overline */
  --font-overline: 500 10px/12px var(--font-family-text);
  --letter-spacing-overline: 1.5px;

  /**************************************/
  /* Typography - Content               */
  /**************************************/
  
  /* Content/Headline 1 */
  --font-content-headline-1: 900 48px/56px var(--font-family-headline);
  --letter-spacing-content-headline-1: -1px;

  /* Content/Headline 2 */
  --font-content-headline-2: 900 30px/36px var(--font-family-headline);
  --letter-spacing-content-headline-2: -0.5px;

  /* Content/Headline 3 */
  --font-content-headline-3: 900 24px/28px var(--font-family-headline);
  --letter-spacing-content-headline-3: -0.5px;

  /* Content/Headline 4 */
  --font-content-headline-4: 900 20px/24px var(--font-family-headline);
  
  /* Content/Body 1 */
  --font-content-body-1: 400 16px/24px var(--font-family-text);
  --letter-spacing-content-body-1: 0.25px;

  /* Content/Body 2 */
  --font-content-body-2: 400 14px/24px var(--font-family-text);
  --letter-spacing-content-body-2: 0px;

  

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
</style>
