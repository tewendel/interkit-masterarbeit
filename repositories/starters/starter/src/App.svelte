<script>
import initActions from "./actions.js"; 
initActions(); 
import AppBase from "interkit/components/AppBase.svelte";
import HeadlinePage from "interkit/components/HeadlinePage.svelte";
</script>

<AppBase
>
<svelte:fragment slot="viewport">
  <HeadlinePage
     headline="Welcome"
  >
  </HeadlinePage>
</svelte:fragment>
<svelte:fragment slot="desktopFallback">
</svelte:fragment>
</AppBase>
