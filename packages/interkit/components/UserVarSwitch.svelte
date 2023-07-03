<script>

  import { InterkitClient } from '../'
  import { get } from "svelte/store"
  
  const projectDataStore = InterkitClient.userProjectDataStore

  let userId = InterkitClient.userId

  export let userVarName;

  const setUserVar = (value) => {
    InterkitClient.call('user.setUserVar', {
      userId: get(userId),
      varName: userVarName,
      value
    })
  }

  const toggle = () => {
    if(get(projectDataStore)?.userVars?.[userVarName]) {
      localValue = false
      setUserVar(false)
    } else {
      localValue = true
      setUserVar(true)
    }
  }

  let localValue;

  $: {
    localValue = $projectDataStore?.userVars?.[userVarName]
  }

</script>

<div class="switch" on:click={toggle} class:on={localValue}></div>
    
<style>

  .switch {
    background-image: url("./icons/SwitchOff.svg");
    width: 36px;
    height: 22px;
  }
  .switch:hover {
    cursor: pointer;
  }
  .switch.on {
    background-image: url("./icons/SwitchOn.svg");
  }




</style>
