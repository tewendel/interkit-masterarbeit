<script>

    import { InterkitClient } from '../'
    import util from '../util.js'

    export let globalStore
    export let sheetColumn

    console.log("property", sheetColumn)
    let element = globalStore ? InterkitClient.getGlobalStore(globalStore) : null;
    let spanValue;

    $: {
        if($element?.values) {
            spanValue = $element?.values[util.colKey(sheetColumn)]
        }
    }


</script>

{#if spanValue}
    <span>
        {spanValue}
    </span>
{/if}
