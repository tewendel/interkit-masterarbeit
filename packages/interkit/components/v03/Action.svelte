<script>
  import { onMount, setContext } from 'svelte'
  import { registerAction } from '../actions'

  let triggers = []
  let effects = []

  const registerTrigger = t => triggers.push(t)
  const registerEffect = m => effects.push(m)

  setContext("registerTrigger", registerTrigger )
  setContext("registerEffect", registerEffect )

  onMount(()=>{
    registerAction(
      triggers,
      effects
    )
  })

</script>

<slot name="triggers" />
<slot name="effects" />
