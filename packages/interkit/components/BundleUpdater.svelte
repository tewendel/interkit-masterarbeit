<script>
  import InterkitLiveReload from '../interkit-live-reload'
  //import QRScanner from './QRScanner.svelte'
 
  import QRScannerCap from './QRScannerCap.svelte'
  import InterkitLogo from './InterkitLogo.svelte'

  let bundleZipUrl = `https://sebquack.uber.space/bundle.zip`;
  let doingUpdate = false;

  const doUpdate = async ()=> {
    doingUpdate = true;
    await InterkitLiveReload.downloadAndActivateBundle(bundleZipUrl)
  }

</script>

<div class="info">
  <div class="content">
    Scanne den QR Code im Interkit-Redaktionssystem, um das Projekt zu laden!
    <!--<label>enter bundle zip url</label>
    <input type="text" bind:value={bundleZipUrl}/>
    <button on:click={doUpdate}>Do Update</button><br>-->
  </div>
  <a href="https://interkit.app"><InterkitLogo/></a>
</div>

{#if !doingUpdate}
  <!--QRScanner
    onScan={(url)=>{bundleZipUrl = url}}
  /-->
  <QRScannerCap
    onScan={(url)=>{
      bundleZipUrl = url;
      doUpdate();
    }}
  />
{/if}

<style>
  * {
    font-family: sans-serif;
  }

  :global(body) {
    margin: 0;
    padding: 0;
  }

  .info {
    background-color: #fff;
    position:  absolute;
    bottom: 0px;
    width:  100%;
    margin: 0;
    padding:  15px;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    align-items: center;

  }

  .content {
    text-align: center;
    padding-bottom: 15px;
  }



</style>


