<script>
  import InterkitLiveReload from '../interkit-live-reload'
  import QRScanner from './QRScanner.svelte'

  let bundleZipUrl = `https://sebquack.uber.space/bundle.zip`;
  let doingUpdate = false;

  const doUpdate = async ()=> {
    doingUpdate = true;
    await InterkitLiveReload.downloadAndActivateBundle(bundleZipUrl)
  }

</script>

<h1>enter bundle zip url</h1>
<input type="text" bind:value={bundleZipUrl}/>
<button on:click={doUpdate}>Do Update</button>

{#if !doingUpdate}
  <QRScanner
    onScan={(url)=>{bundleZipUrl = url}}
  />
{/if}