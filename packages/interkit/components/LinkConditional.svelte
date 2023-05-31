<script>
  import { useNavigate } from "svelte-navigator";

  export let condition = true;
  export let to;

	const navigate = useNavigate();
  
  const click = () => {
    console.log("Navigate to", to, condition, typeof condition)
    navigate(to)
  }
</script>

{#if condition}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="link" on:click={click}>
    <slot/>
  </div>
{:else}
  <slot/>
{/if}


<style>
  .link:hover {
    cursor: pointer;
  }
</style>