<script>

import WithEffect from "./WithEffect.svelte";
import QRScannerInternal from './QRScannerInternal.svelte'
    
export let elementKeyColumn; // the column on a sheet to select an element (optional)

// columns for tips sheet
export let tipQrKeyColumn;
export let tipImageColumn;
export let tipTextColumn;
export let tipOrderColumn;

export let closeTrigger;
export let onScanEffect;

</script>

<WithEffect effect={onScanEffect}>
  <QRScannerInternal
    mainClass="QRScanner"
    {elementKeyColumn}
    {tipQrKeyColumn}
    {tipImageColumn}
    {tipTextColumn}
    {tipOrderColumn}
    {closeTrigger}
  >
    <slot name="map"/>
  </QRScannerInternal>
</WithEffect>
