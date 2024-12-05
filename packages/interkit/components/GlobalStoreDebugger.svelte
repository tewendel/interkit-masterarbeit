
<script>
  import { InterkitClient, util } from '..'

  export let globalStore = "audioPlayerElement"

  let content = null
  let type = "object"

  const store = InterkitClient.getGlobalStore(globalStore)

  if (store && store.subscribe) {
    store.subscribe( c => {
      content = c
      if (typeof content === "array") {
        type = "list"
      }
    })
  }
</script>

<div>
  {#if store}

    {#if type === "list"}
      {#if content}
        {#if content.length == 0}
          {globalStore} is an empty list
        {:else}
          <ul>
            {#if typeof content  === "array"}
              {#each content as row}
                <li class="item">
                  <details>
                    <summary>
                      {row.id}
                    </summary>
                    <p>
                      {JSON.stringify(row, null, 2)}
                    </p>
                  </details>
                </li>
              {/each}
            {:else}
              {JSON.stringify(content, null, 2)}
            {/if}
          </ul>
        {/if}
      {:else}
          nothing
      {/if}
    {:else}
      {#if content === undefined}
        "{globalStore}" exists, but its content is "undefined"
      {:else if !content}
        "{globalStore}" exists, but is empty
      {:else}
        <h4>"{globalStore}"</h4>
        {JSON.stringify(content, null, 2)}
      {/if}
    {/if}
  {:else}
    "{globalStore}" is not a global store
  {/if}
</div>

<style>
  div {
    border: var(--border-width) solid var(--color-border);
    background-image:
      repeating-linear-gradient(
        45deg,
        black,
        black 10px,
        yellow 10px,
        yellow 20px
      ),
      repeating-linear-gradient(
        -45deg,
        black,
        black 10px,
        yellow 10px,
        yellow 20px
      );
    background-size: 8px 100%, 8px 100%;
    background-repeat: no-repeat, no-repeat;
    background-position: 0 0, 100% 0;

    padding: 1rem;
    border-radius: 0.5rem;
    background-color: var(--color-background-backdrop);
    word-break: break-all;
    white-space: pre-wrap;
    font-family: monospace;
  }

  h4 {
    margin: 0 0 .4em 0;
    padding:0 0 .4em 0;
    font-weight: bold;
    border-width: 0 0 1px 0;
    border-style: solid;
    border-color: var(--color-border);
  }
</style>
