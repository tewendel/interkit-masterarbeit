<script>
  import { onMount } from "svelte"
  import { executeTrigger } from '../'

  export let trigger

  onMount(()=>{
    console.log(`ActionTrigger triggered action "${trigger}"`)
    executeTrigger(trigger)
  })
</script>