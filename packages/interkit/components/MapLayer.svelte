<script>

 // get map context
import { getContext } from 'svelte';
import { MAP } from './Map.svelte';

export let name;
export let assetPath;
export let topLeft;
export let bottomRight;
export let audio;
export let hideLabels;
export let layerKey; // a unique key for this layer that can be referenced from a filter
export let connectedFilterKey; // the key of a filter that should be activated with this layer

const { registerLayer } = getContext(MAP);

// register this layer to map context
registerLayer({name, assetPath, topLeft, bottomRight, audio, hideLabels, layerKey, connectedFilterKey});

</script>

<!-- doesn't render anything on it's own -->


