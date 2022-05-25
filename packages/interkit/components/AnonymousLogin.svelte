<script>
  import { onMount } from 'svelte'
  import { InterkitClient } from '../'

  let userId = InterkitClient.userId;

  const createUser = async () => {
    const token = await InterkitClient.createProjectTokenUserAndLogin()  
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

