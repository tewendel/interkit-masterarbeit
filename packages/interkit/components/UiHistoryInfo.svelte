<script>
  import { InterkitClient } from '../'
  import Button from './Button.svelte'

  let uiHistoryStore = InterkitClient.getUiHistoryStore()
</script>

<ol>
  {#each $uiHistoryStore as entry}
    <li>
      <details>
        <summary>
          <span tite={entry.date.toLocaleString()}>
            {entry.id}
          </span>
          <Button on:click={ () => InterkitClient.restoreUiSnapshot(entry.id) } >
            restore
          </Button>
        </summary>
        <p>
          {JSON.stringify(entry.globalStores, null, 2)}
        </p>
      </details>
    </li>
  {/each}
</ol>

<style>
  details {
    font-size: 14px;
  }
  p {
    word-break:break-all;
    white-space:pre-wrap;
  }
</style>