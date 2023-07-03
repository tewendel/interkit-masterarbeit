<script>
  import LayoutShellAudio from "./LayoutShellAudio.svelte";  
</script>

<LayoutShellAudio mainClass="LayoutShell">
  <svelte:fragment slot="TopBar"><slot name="TopBar"></slot></svelte:fragment>
  <svelte:fragment slot="Content"><slot name="Content"></slot></svelte:fragment>
  <svelte:fragment slot="BottomBar"><slot name="BottomBar"></slot></svelte:fragment>
</LayoutShellAudio>
