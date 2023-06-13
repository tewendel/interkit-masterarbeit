<script>
  import { HighlightSvelte } from "svelte-highlight";
  //import { typescript } from "svelte-highlight/languages";
  import "svelte-highlight/styles/github.css";

  export let code = "";
</script>

<HighlightSvelte {code} />