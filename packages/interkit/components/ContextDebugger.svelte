
<script>
  import { getContext } from 'svelte'

  export let context = "element"

  let ctx = getContext(context)

  let content = null
  let type = "object"

  if (ctx && ctx.subscribe) {
    ctx.subscribe( c => {
      content = c
      if (typeof content === "array") {
        type = "list"
      }
    })
  }
</script>

<div>
  {#if ctx}
    {#if !ctx.subscribe}
      ("{context}" exists, but is not a store)
    {/if}

    {#if type === "list"}
      {#if content}
        {#if content.length == 0}
          {context} is an empty list
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
                      {JSON.stringify(row)}
                    </p>
                  </details>
                </li>
              {/each}
            {:else}
              {JSON.stringify(content)}
            {/if}
          </ul>
        {/if}
      {:else}
          nothing
      {/if}
    {:else}
      {#if content === undefined}
        "{context}" exists, but its content is "undefined"
      {:else if !content}
        "{context}" exists, but is empty
      {:else}
        {JSON.stringify(content)}
      {/if}
    {/if}
  {:else}
    "{context}" is not a context
  {/if}
</div>

<style>
  div {
    border: 1px solid #ccc;
    padding: 1em;
    border-radius: 0.5em;
    background-color: #eee;
  }
</style>