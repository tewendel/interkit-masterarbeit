<script>
  import LayoutShellAudio from "./LayoutShellAudio.svelte";  
</script>

<LayoutShellAudio>
  <svelte:fragment slot="TopBar"><slot name="TopBar"></slot></svelte:fragment>
  <svelte:fragment slot="Content"><slot name="Content"></slot></svelte:fragment>
</LayoutShellAudio>
