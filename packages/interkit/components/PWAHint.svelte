<script>

  import { lang, t } from '../i18n.js'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'
  import Overlay from './Overlay.svelte'
  import Spacing from './Spacing.svelte'
  import AccordeonShell from './AccordeonShell.svelte'

  export let buttonText
  // TODO use --var
  export let overlayStyle = 'background-color: white'

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
  <Overlay customStyle={overlayStyle}>
    <Spacing top="s" left="s" bottom="s" right="s">
      <Button size="small" on:click={() => { showOverlay = false }}>
        <Icon type="Full-Close" />
      </Button>
      <!-- TODO add scroll -->
      {t('$pwahint_intro', '…', 'en')}
      <div class="accordeons">
        <AccordeonShell state={guessPlatform === 'desktopchrome' ? 'open' : 'closed'}>
          <svelte:fragment slot="label">
            Chrome (desktop browser)
          </svelte:fragment>
          <svelte:fragment slot="content">
            instructions for chrome
          </svelte:fragment>
        </AccordeonShell>
        <AccordeonShell state={guessPlatform === 'ios' ? 'open' : 'closed'}>
          <svelte:fragment slot="label">
            iOS
          </svelte:fragment>
          <svelte:fragment slot="content">
            instructions for iOS
          </svelte:fragment>
        </AccordeonShell>
      </div>
    </Spacing>
  </Overlay>
{/if}

<style>

.accordeons {
  display: flex;
  flex-direction: column;
  flex-gap: 1em; /* TODO use --var */
}

</style>

