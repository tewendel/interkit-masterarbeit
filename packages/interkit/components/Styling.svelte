<script>
  import definitions from './styleTokensConfig.json'
  
  export let styleTokens = {}

  import { onMount } from 'svelte'

  let tokens = {}
  const globalTokens = {...globalThis?.styleTokens} || {}

  onMount(async () => {
  })

  $: {
    // generate local tokens and init with defaults
    for (let definition of definitions) {
      // first choice: styleTokens from props
      if(styleTokens && typeof styleTokens[definition.key] !== "undefined") {
        tokens[definition.key] = styleTokens[definition.key]
        continue
      }
      // second choice: global styleTokens
      if(globalTokens && typeof globalTokens[definition.key] !== "undefined") {
        tokens[definition.key] = globalTokens[definition.key]
        continue
      }
      // third choice: default value
      tokens[definition.key] = definition.defaultValue
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
  
/*
  // detecting google fonts, but lacks precise definition

  const googleFont = /[\+:@]/.test(fontFamilyContent) ? fontFamilyContent : false
  if (googleFont) {
    // strip off weights and such
    fontFamilyContent = fontFamilyContent.match(/^[\w\+]+/)?.[0]?.replace('+', ' ')
  }
  if (fontFamilyContent !== 'inherit') fontFamilyContent += ', ' + baseFontStack

  const googleFontHeadline = /[\+:@]/.test(fontFamilyHeadline) ? fontFamilyHeadline : false
  if (googleFontHeadline) {
    fontFamilyHeadline = fontFamilyHeadline.match(/^[\w\+]+/)?.[0]?.replace('+', ' ')
  }
  if (fontFamilyHeadline !== 'inherit') fontFamilyContent += ', ' + baseFontStack
*/
  
</script>

<div class="style Styling" style={`

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
  --color-text-link: ${tokens.colorTextLink};
  --color-background-button-danger: ${tokens.colorBackgroundButtonDanger};
  --color-background-button-danger-pressed: ${tokens.colorBackgroundButtonDangerPressed};
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

  --color-pagination: ${tokens.colorPagination};

  --border-width: ${tokens.borderWidth};
  --border-radius: ${tokens.borderRadius};
  --border-radius-button: ${tokens.borderRadiusButton};
  --border-radius-label: ${tokens.borderRadiusLabel};
  --box-shadow: ${tokens.boxShadow};


  /* other vars */

  --font-family-interface: ${tokens.fontFamilyInterface};
  --font-family-content: ${tokens.fontFamilyContent};

  /* constant */

  --distance-base: 8px;
  --distance-tiny: 2px;

  /* derived defaults */

  /* --border-color: var(--color-text); deprecated? */
  --color-background-button-primary: var(--color-text);
  --color-text-button: var(--color-text);
  --color-background-button: var(--color-background);

  --distance-xs: calc(var(--distance-base) * var(--distance-scale-factor) / 2.0);
  --distance-s: calc(var(--distance-base) * var(--distance-scale-factor) / 1);
  --distance-m: calc(var(--distance-base) * var(--distance-scale-factor) * 2);
  --distance-sm: calc(var(--distance-s) + var(--distance-m));
  --distance-l: calc(var(--distance-base) * var(--distance-scale-factor) * 4);
  --distance-xl: calc(var(--distance-base) * var(--distance-scale-factor) * 6);
  --distance-xxl: calc(var(--distance-base) * var(--distance-scale-factor) * 8);
  
  /* cheat sheet for translation from figma 
  2 -> tiny
  4 -> xs  
  8 -> s
  16 -> m
  24 -> sm
  32 -> l
  48 -> xl
  64 -> xxl
  */

  /**************************************/
  /* Typography - Interface             */
  /**************************************/

 /* Interface/Headline 1 */
  --font-headline-1: ${tokens.fontHeadline1};
  --letter-spacing-headline-1: ${tokens.letterSpacingHeadline1}
  
  /* Interface/Headline 2 */
  --font-headline-2: ${tokens.fontHeadline2};
  --letter-spacing-headline-2: ${tokens.letterSpacingHeadline2}

  /* Interface/Headline 3 */
  --font-headline-3: ${tokens.fontHeadline3};
  --letter-spacing-headline-3: ${tokens.letterSpacingHeadline3}
  
  /* Interface/Headline 4 */
  --font-headline-4: ${tokens.fontHeadline4};
  --letter-spacing-headline-4: ${tokens.letterSpacingHeadline4}
  
  /* Interface/Headline 5 */
  --font-headline-5: ${tokens.fontHeadline4};
  --letter-spacing-headline-5: ${tokens.letterSpacingHeadline5}
  
  /* Interface/Body 1 */
  --font-body-1: ${tokens.fontBody1};
  --letter-spacing-body-1: ${tokens.letterSpacingBody1}

  /* Interface/Body 2 */
  --font-body-2: ${tokens.fontBody2};
  --letter-spacing-body-2: ${tokens.letterSpacingBody2}
  
  /* Interface/Subtitle 1 */
  --font-subtitle-1: ${tokens.fontSubtitle1};
  --letter-spacing-subtitle-1: ${tokens.letterSpacingSubtitle1}
  
  /* Interface/Subtitle 2 */
  --font-subtitle-2: ${tokens.fontSubtitle2};
  --letter-spacing-subtitle-2: ${tokens.letterSpacingSubtitle2}

  /* Interface/Button */
  --font-button: ${tokens.fontButton};
  --letter-spacing-button: ${tokens.letterSpacingButton}

  /* Interface/Caption */
  --font-caption: ${tokens.fontCaption};
  --letter-spacing-caption: ${tokens.letterSpacingCaption}

  /* Interface/Caption - Bold */
  --font-caption-bold: ${tokens.fontCaptionBold};
  --letter-spacing-caption-bold: ${tokens.letterSpacingCaptionBold}

  /* Interface/Overline */
  --font-overline: ${tokens.fontOverline};
  --letter-spacing-overline: ${tokens.letterSpacingOverline}

  /**************************************/
  /* Typography - Content               */
  /**************************************/
  
  /* Content/Headline 1 */
  --font-content-headline-1: ${tokens.fontContentHeadline1};
  --letter-spacing-content-headline-1: ${tokens.letterSpacingContentHeadline1}

  /* Content/Headline 2 */
  --font-content-headline-2: ${tokens.fontContentHeadline2};
  --letter-spacing-content-headline-2: ${tokens.letterSpacingContentHeadline2}

  /* Content/Headline 3 */
  --font-content-headline-3: ${tokens.fontContentHeadline3};
  --letter-spacing-content-headline-3: ${tokens.letterSpacingContentHeadline3}

  /* Content/Headline 4 */
  --font-content-headline-4: ${tokens.fontContentHeadline4};
  --letter-spacing-content-headline-4: ${tokens.letterSpacingContentHeadline4}

  /* Content/Headline 5 */
  --font-content-headline-5: ${tokens.fontContentHeadline5};
  --letter-spacing-content-headline-5: ${tokens.letterSpacingContentHeadline5}
  
  /* Content/Body 1 */
  --font-content-body-1: ${tokens.fontContentBody1};
  --letter-spacing-content-body-1: ${tokens.letterSpacingContentBody1}

  /* Content/Body 2 */
  --font-content-body-2: ${tokens.fontContentBody2};
  --letter-spacing-content-body-2: ${tokens.letterSpacingContentBody2}

  

  /* to inherit */

  font-family: var(--font-family-interface);
  color: var(--color-text);

  `} >
  <slot />
</div>

<svelte:head>
  {#if tokens.googleFont}
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href={`https://fonts.googleapis.com/css2?family=${tokens.googleFont}&display=swap`} rel="stylesheet">
  {/if}
  {#if tokens.googleFont2}
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href={`https://fonts.googleapis.com/css2?family=${tokens.googleFont2}&display=swap`} rel="stylesheet">
  {/if}
</svelte:head>

<style>
  .style {
    display: contents;
    height: 100%;
  }
</style>
