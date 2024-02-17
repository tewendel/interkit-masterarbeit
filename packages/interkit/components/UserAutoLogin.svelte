<script>
  import { InterkitClient } from '../'

  // TODO shouldnt be necessary, derive from AppBase?
  export let defaultLang = 'en'
  export let defaultLangIndex = '0'
  export let username
  export let password
  defaultLangIndex = +defaultLangIndex || 0

  let userId = InterkitClient.userId;

  const createUser = async () => {
    const token = await InterkitClient.login({
      username,
      password,
      projectData: {
        lang: defaultLang,
        langIndex: defaultLangIndex
      }
    })
  }

  $: {
    console.log("UserLogin - user changed: ", $userId);
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

