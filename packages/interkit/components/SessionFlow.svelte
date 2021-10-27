<script>
  import { onMount } from 'svelte'
  import { InterkitClient, util } from '../'
  import Flex2 from './Flex2.svelte'
  import Button from './Button.svelte'
  import Start from './SessionFlow/Start.svelte'
  import EnterCode from './SessionFlow/EnterCode.svelte'
  import EnterEmail from './SessionFlow/EnterEmail.svelte'

  export let restartTrigger
  export let restoredTrigger
  export let backgroundImageSrc
  export let logoImageSrc
  export let keyColumn
  export let contentColumn

  let step = "start"

  const setStep = newStep => step = newStep

  const bgImgStyleString = backgroundImageSrc ? `background-image:url(${backgroundImageSrc})` : ""

</script>

<div class="SessionFlow">
  <Flex2 style="background-color: var(--color-background-highlight); {bgImgStyleString}; background-repeat: no-repeat; background-size: cover;">
    <div slot="first" class="first">
      <div class="frame">
        {#if step == "enterCode"}
          <EnterCode 
            {restoredTrigger}
            {setStep}
            {keyColumn}
            {contentColumn}
          />
        {:else}
          <Start 
            {restartTrigger} 
            {setStep}
            {keyColumn}
            {contentColumn}
          />
        {/if}
      </div>
    </div>
    <div slot="second" class="second">

      <div class="logoContainer">
        <img alt="logo" src={logoImageSrc} on:click={() => setStep("start")} />
      </div>

    </div>
  </Flex2>
</div>

<style>
  .first, .second {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .first {
    padding: 20vw var(--distance-m) 0 var(--distance-m);
    align-items: stretch;
  }

  .second {
    padding: 10vw var(--distance-m);
  }

  .frame {
    background-color: var(--color-background);
    border-radius: var(--border-radius);
    border: solid black var(--border-width);
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: var(--distance-m);
    text-align: center;
  }

  .logoContainer {
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--border-radius-button);
    overflow: hidden;
    margin: 0 var(--distance-xl);
    padding: var(--distance-s);
    background-color: var(--color-background);
  }

</style>
