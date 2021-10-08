<script>

 // get map context
import { getContext } from 'svelte';
import { MAP } from './Map.svelte';

export let name;
export let categoryNameColumn;
export let categoryColorColumn;
export let categoryUnlistedColumn;
export let elementRefColumn;
export let categoryOrderColumn;
export let filterKeyColumn; // the column where the unique key for each filter can be set
export let connectedLayerKeyColumn; // the column where a connected layer for a filter can be set

const { registerFilter } = getContext(MAP);

// register this filter to map context
registerFilter({name, categoryNameColumn, categoryColorColumn, elementRefColumn, categoryUnlistedColumn, categoryOrderColumn, filterKeyColumn, connectedLayerKeyColumn});

</script>

<!-- doesn't render anything on it's own -->


