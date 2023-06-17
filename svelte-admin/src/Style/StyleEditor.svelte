<script>
  import StyleTokensForm from '../InputModals/StyleTokensForm.svelte'

  export let currentStyleTokens = null

  const update = (e) => {
    console.log("StyleTokensForm dispatch", e.detail);
    currentStyleTokens = e.detail
  }
</script>

<StyleTokensForm on:update={update} bind:value={currentStyleTokens}/>
