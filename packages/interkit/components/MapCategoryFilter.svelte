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

const { registerFilter } = getContext(MAP);

// register this filter to map context
registerFilter({name, categoryNameColumn, categoryColorColumn, elementRefColumn, categoryUnlistedColumn, categoryOrderColumn});

</script>

<!-- doesn't render anything on it's own -->


