<script>
  import { Plugins } from '@capacitor/core';
  import {onMount, onDestroy } from 'svelte';

  export let onScan;

  const checkPermission = async () => {
    const { BarcodeScanner } = Plugins;

    // check or request permission
    const status = await BarcodeScanner.checkPermission({ force: true });
    console.log(JSON.stringify(status))

    if (status.granted) {
      // the user granted permission
      return true;
    }

    return false;
  };

  onMount(async ()=> {
    await checkPermission();
    const { BarcodeScanner } = Plugins;
    BarcodeScanner.hideBackground(); // make background of WebView transparent
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
    console.log(result);
    // if the result has content
    if (result.hasContent) {
      onScan(result.content)
    }
  })

</script>
