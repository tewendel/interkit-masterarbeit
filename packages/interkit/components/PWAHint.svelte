<script>

  import { lang, t } from '../i18n.js'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'
  import Overlay from './Overlay.svelte'
  import Spacing from './Spacing.svelte'
  import AccordeonShell from './AccordeonShell.svelte'
  import ScrollContainer from './ScrollContainer.svelte'

  export let buttonText
  export let overlayStyle = 'background-color: var(--color-background)'
  export let truepwa = true

  let showOverlay = false

  const ua = navigator.userAgent.toLowerCase()
  let guessPlatform = 'none'
  if (/chrom/.test(ua)) {
    if (/android/.test(ua)) {
      guessPlatform = 'androidchrome'
    } else {
      guessPlatform = 'desktopchrome'
    }
  } else if (/ipad|iphone/.test(ua)) {
    guessPlatform = 'ios'
  }
  // TODO check fucking Edge

</script>

<Button
  text={buttonText}
  on:click={() => { showOverlay = true }}
  />

{#if showOverlay}
  <Overlay customStyle={overlayStyle} zIndex="10000">
    <div style="position: absolute; right: calc(var(--outset-x) * 1rem); top: calc(var(--outset-y) * 1rem);">
      <Button size="small" on:click={() => { showOverlay = false }}>
        <Icon type="Full-Close" />
      </Button>
    </div>
    <ScrollContainer>
    <Spacing top="xxl" left="s" bottom="s" right="s"
      style="max-width: 30em; margin-left: auto; margin-right: auto">
      <Spacing bottom="m">
        {t('$pwahint_intro', '…', 'en')}
      </Spacing>
      <div class="accordeons">
        <AccordeonShell state={guessPlatform === 'ios' ? 'open' : 'closed'}>
          <svelte:fragment slot="label">
            iOS
          </svelte:fragment>
          <svelte:fragment slot="content">
            {t('$pwahint_ios_1', '…', 'en')}
            <img class="screenshot" src={`./pwa-hint/ios-010-${$lang || 'en'}.png`} alt="Screenshot" />
            {t('$pwahint_ios_2', '…', 'en')}
            <img class="screenshot" src={`./pwa-hint/ios-020-${$lang || 'en'}.png`} alt="Screenshot" />
            {t('$pwahint_ios_3', '…', 'en')}
            <img class="screenshot" src={`./pwa-hint/ios-040-${$lang || 'en'}.png`} alt="Screenshot" />
            {t('$pwahint_ios_4', '…', 'en')}
            <!-- TODO: forgot to take en screenshot here -->
            <img class="screenshot" src={`./pwa-hint/ios-050-de.png`} alt="Screenshot" />
          </svelte:fragment>
        </AccordeonShell>
        <AccordeonShell state={guessPlatform === 'androidchrome' ? 'open' : 'closed'}>
          <svelte:fragment slot="label">
            Android Chrome
          </svelte:fragment>
          <svelte:fragment slot="content">
            {#if truepwa}
              {t('$pwahint_android_0', '…', 'en')}
            {/if}
            {t('$pwahint_android_1', '…', 'en')}
            <img class="screenshot" src={`./pwa-hint/android-010-${$lang || 'en'}.png`} alt="Screenshot" />
            {t('$pwahint_android_2', '…', 'en')}
            {#if truepwa}
              {t('$pwahint_android_3', '…', 'en')}
              <img class="screenshot" src={`./pwa-hint/android-032-${$lang || 'en'}.png`} alt="Screenshot" />
            {:else}
              {t('$pwahint_android_4', '…', 'en')}
              <img class="screenshot" src={`./pwa-hint/android-020-${$lang || 'en'}.png`} alt="Screenshot" />
            {/if}
            {t('$pwahint_android_5', '…', 'en')}
            <img class="screenshot" src={`./pwa-hint/android-040-${$lang || 'en'}.png`} alt="Screenshot" />
            {t('$pwahint_android_6', '…', 'en')}
            <img class="screenshot" src={`./pwa-hint/android-050-${$lang || 'en'}.png`} alt="Screenshot" />
            {t('$pwahint_android_7', '…', 'en')}
            <img class="screenshot" src={`./pwa-hint/android-060-${$lang || 'en'}.png`} alt="Screenshot" />
          </svelte:fragment>
        </AccordeonShell>
        {#if truepwa}
          <AccordeonShell state={guessPlatform === 'desktopchrome' ? 'open' : 'closed'}>
            <svelte:fragment slot="label">
              Chrome (desktop browser)
            </svelte:fragment>
            <svelte:fragment slot="content">
              {t('$pwahint_chrome_1', '…', 'en')}
              <img class="screenshot screenshot--wide" src={`./pwa-hint/chrome-010.png`} alt="Screenshot" />
              {t('$pwahint_chrome_2', '…', 'en')}
              <img class="screenshot screenshot--wide" src={`./pwa-hint/chrome-020.png`} alt="Screenshot" />
              {t('$pwahint_chrome_3', '…', 'en')}
            </svelte:fragment>
          </AccordeonShell>
        {/if}
      </div>
    </Spacing>
    </ScrollContainer>
  </Overlay>
{/if}

<style>

._workaround_ {}

.accordeons {
  display: flex;
  flex-direction: column;
  gap: calc(var(--outset-y) * 1rem);
}

.screenshot {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 16em;
  max-height: 70vh;
  object-fit: contain;
}

.screenshot--wide {
  max-width: 20em;
}

</style>

