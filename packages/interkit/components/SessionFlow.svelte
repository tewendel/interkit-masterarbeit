<script>
  import Flex2 from './Flex2.svelte'
  import Button from './Button.svelte'
  import Start from './SessionFlow/Start.svelte'
  import EnterCode from './SessionFlow/EnterCode.svelte'
  import EnterEmail from './SessionFlow/EnterEmail.svelte'

  export let restartTrigger
  export let restoredTrigger
  export let backgroundImageSrc
  export let logoImageSrc
  export let textElements

  let step = "start"

  const setStep = newStep => step = newStep

  //const text

</script>

<Flex2 style="background-color: white; background-image:url({backgroundImageSrc})">
  <div slot="first" class="first">
    <div class="frame">
      {#if step == "enterCode"}
        <EnterCode 
          {restoredTrigger}
          {setStep}
        />
      {:else}
        <Start 
          {restartTrigger} 
          {setStep}
        />
      {/if}
    </div>
  </div>
  <div slot="second" class="second">

      Marta

  </div>
</Flex2>

<style>
  .first, .second {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .first {
    padding: 20vw 20px 0 20px;
    align-items: stretch;
  }

  .second {
    padding: 10vw 20px;
  }

  .frame {
    background-color: white;
    border-radius: var(--border-radius);
    border: solid black var(--border-width);
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px;
    text-align: center;
  }
</style>