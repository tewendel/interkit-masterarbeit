<script>
  import Button from '../Button.svelte'
  import {executeTrigger} from '../../actions'

  export let restartTrigger
  export let setStep = function(){}
</script>

<h2>
  Marta Phänomene
</h2>
<p>Finde die 16 </p>
<Button on:click={() => executeTrigger(restartTrigger)}>
  Neustarten
</Button>
Von vorne beginnen...
<Button on:click={() => setStep("enterCode")}>
  Forfahren
</Button>
Du hast