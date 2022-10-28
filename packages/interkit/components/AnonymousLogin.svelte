<script>
  import { onMount } from 'svelte'
  import { InterkitClient } from '../'

  // TODO shouldnt be necessary, derive from AppBase?
  export let defaultLang = 'en'
  export let defaultLangIndex = '0'
  defaultLangIndex = +defaultLangIndex || 0

  let userId = InterkitClient.userId;

  const createUser = async () => {
    const token = await InterkitClient.createProjectTokenUserAndLogin({
      projectData: {
        lang: defaultLang,
        langIndex: defaultLangIndex
      }
    })
  }

  $: {
    console.log("AnonymousLogin - user changed: ", $userId);
    if(!$userId) {
      createUser()  
    }
  }


</script>

{#if $userId}
  {#key $userId}
    <slot></slot>
  {/key}
{/if}

