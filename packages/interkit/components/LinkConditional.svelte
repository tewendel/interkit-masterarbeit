<script>
  export let condition;
  export let to;

  import { useNavigate } from "svelte-navigator";
	const navigate = useNavigate();
  
  const click = () => {
    console.log("LinkConditional", to)
    navigate(to)
  }
</script>

{#if condition}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div on:click={click}>
    <slot/>
  </div>
{:else}
  <slot/>
{/if}