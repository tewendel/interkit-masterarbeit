<script>
  import ComponentInfoYaml from "../../components/ComponentInfoYaml.svelte";
</script>

# QRScanner

![A QRScanner example](/images/component_previews/QRScanner.png)

Uses the phones camera to scan QR codes.

The scanner is a full screen overlay and should be displayed inside its own route. The close button invokes the "back" route (see [Routing](/components/Route)).

The QRScanner can be used in two different ways:

1. Scan one of many codes

Open a [DataRoute](/components/Route) corresponding to the scanned code. The user is able to scan all codes available in the supplied sheet.

2. Targeted action for a specific code

You might want to limit which codes can be scanned or process them in some other way. Use [action](/guides/actions] effect for fine-grained control. 

The scanner calls the action with the following payload:
- `code` the scanned code
- `targetFound` a boolean indicating if a row was identified
- `elementRow` a data row if a target was identified

You specify a target for the scanner to look for by placing the scanner in an "element" context, for example using [DataLoaderSingle](/components/DataLoader).

<ComponentInfoYaml component="QRScanner" />

