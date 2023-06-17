<script>
  import definitions from './styleTokensConfig.json'
  
  export let googleFont = "Inter:wght@400;500;600;700;900" // regular medium semi-bold bold bolder
  export let googleFont2 = "Inter:wght@400;500;600;700;900"

  export let styleTokens = {}

  export let fontFamilyText = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Roboto", sans-serif'
  export let fontFamilyHeadline = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Roboto", sans-serif'
  export let fontSizeHeadline1 = '30px';

  import { onMount } from 'svelte'

  let tokens = {}

  onMount(async () => {
  })

  $: {
    // initialize with default values
    if (!styleTokens) styleTokens = {}
    for (let definition of definitions) {
      if(typeof styleTokens[definition.key] == "undefined") {
        tokens[definition.key] = definition.defaultValue
      } else {
        tokens[definition.key] = styleTokens[definition.key]
      }
    }
  }

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

  /* from tokens */

  --color-text: ${tokens.colorText};
  --color-text-strong: ${tokens.colorTextStrong};
  --color-text-soft: ${tokens.colorTextSoft};
  --color-background: ${tokens.colorBackground};
  --color-background-highlight: ${tokens.colorBackgroundHighlight};
  --color-background-backdrop: ${tokens.colorBackgroundBackdrop};
  --color-border: ${tokens.colorBorder};
  --color-dummy-asset: ${tokens.colorDummyAsset};
  --distance-scale-factor: ${parseFloat(tokens.distanceScaleFactor) || 1.0};

  --color-text-button-pressed: ${tokens.colorTextButtonPressed};
  --color-background-button-pressed: ${tokens.colorBackgroundButtonPressed};
  --color-text-button-danger: ${tokens.colorTextButtonDanger};
  --color-background-button-danger: ${tokens.colorBackgroundButtonDanger};
  --color-text-button-primary: ${tokens.colorTextButtonPrimary};
  --color-text-button-primary-pressed: ${tokens.colorTextButtonPrimaryPressed};
  --color-background-button-primary: ${tokens.colorBackgroundButtonPrimary};
  --color-background-button-primary-pressed: ${tokens.colorBackgroundButtonPrimaryPressed};
  --color-border-button-primary: ${tokens.colorBorderButtonPrimary};
  --color-border-button-primary-pressed: ${tokens.colorBorderButtonPrimaryPressed};
  
  --color-text-label1: ${tokens.colorTextLabel1};
  --color-background-label1: ${tokens.colorBackgroundLabel1};

  --color-background-chat-me: ${tokens.colorBackgroundChatMe};
  --color-background-chat-other: ${tokens.colorBackgroundChatOther};

  --border-width: ${tokens.borderWidth};
  --border-radius: ${tokens.borderRadius};
  --border-radius-button: ${tokens.borderRadiusButton};
  --border-radius-label: ${tokens.borderRadiusLabel};
  --box-shadow: ${tokens.boxShadow};

  /* deprecated ? */

  --color-text-headline: ${tokens.colorTextHeadline};
  --font-size-headline-1: ${tokens.fontSizeHeadline1};

  /* other vars */

  --font-family-text: ${fontFamilyText};
  --font-family-headline: ${fontFamilyHeadline};

  /* constant */

  --distance-base: 8px;
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
