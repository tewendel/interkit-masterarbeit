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

const { registerLayer } = getContext(MAP);

// register this layer to map context
registerLayer({name, assetPath, topLeft, bottomRight, audio, hideLabels});

</script>

<!-- doesn't render anything on it's own -->


