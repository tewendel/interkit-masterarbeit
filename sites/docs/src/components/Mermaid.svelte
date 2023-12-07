<script>
    import mermaid from 'mermaid';
    import { onMount } from 'svelte';

    export let code = '';
    export let legend = []

    let graph = null;
    let gantt = null;

    mermaid.initialize({
        startOnLoad: false,

        theme: 'forest',
        gantt: { axisFormatter: [
            ['%Y-%m-%d', (d) => {
                return d.getDay() === 1
            }]
        ] }
    });

    let rendered = false;

    onMount(() => {
      mermaid.run({
        nodes: [graph],
      })
      rendered = true;
    });
</script>

<div class="mermaid">
  <div bind:this={graph} class="graph" class:rendered>
    {code}
  </div>

  {#if legend.length > 0}
    <aside>
      <h5>
        Legend
      </h5>
      <dl>
      {#each legend as item}
        <dt>{item.abbr}</dt>
        <dd>{item.desc}</dd>
      {/each}
      </dl>
    </aside>
  {/if}
</div>

<style>
  .mermaid {
    border: 1px solid #ddd;
    padding: 1ex;
    background-color: #fafafa;
  }
  .graph {
    white-space: pre;
  }
  .graph:not(.rendered) {
    visibility: hidden;
  }
  aside {
    border: 1px solid #ddd;
    font-size: 70%;
    padding: 1em;
    width: min-content;
    white-space: nowrap;
    margin: 1ex 0 0 0;
  }
  h5 {
    margin:0 0 1ex 0;
  }
  dt {
    float: left;
    font-style: italic;
  }
</style>