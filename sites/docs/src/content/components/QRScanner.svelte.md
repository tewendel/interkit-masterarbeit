<script>
  import ComponentInfoYaml from "../../components/ComponentInfoYaml.svelte";
</script>

# QRScanner

You can specify a target for the scanner to look for by placing the scanner in an "element" context, for example using **DataLoaderSingle**.

In addition, the scanner can show helpful tips to help the user find the qr code. Each tip constists of text and image, shown in order. The data for these tips is drawn from a separate sheet.

When the QRScanner scans a qr code the `QRCodeScanned` action is triggered, with the following payload:
- `code` the scanned code
- `targetFound` a boolean indicating if a row was identified
- `elementRow` a data row if a target was identified

<ComponentInfoYaml component="QRScanner" />
