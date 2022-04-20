
<script>
  import { getContext } from 'svelte'

  export let context = "items"
  export let type = "list"

  let ctx = getContext(context)

  let items = null

  if (ctx.subscribe) {
    context.subscribe( i => items = i)
  }
</script>

{#if context.subscribe}
  (context is a store)
{/if}

{#if type === "list"}
  {#if items}
    {#if items.length == 0}
      empty list
    {:else}
      <ul>
        {#if typeof items  === "array"}
          {#each items as row}
            <li class="item">
              <details>
                <summary>
                  {row.id}
                </summary>
                <p>
                  {JSON.stringify(row)}
                </p>
              </details>
            </li>
          {/each}
        {:else}
          {JSON.stringify(items)}
        {/if}
      </ul>
    {/if}
  {:else}
      nothing
  {/if}
{:else}
  {JSON.stringify(items)}
{/if}
