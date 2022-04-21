<script>

  import { createEventDispatcher } from 'svelte'
  import CodeEditor from './CodeEditor.svelte'

  const dispatch = createEventDispatcher()

  export let code = ''

  let onMessage = ''
  let onArrive = ''
  let blocks = []

  const split = code => {
    let ret = code.split(/((?:\n?[ \t]*\}[^\}]*)?export const[^\{]+\{[ \t]*\n*)/m)
    const last = ret.pop()
    const lastBracket = last.lastIndexOf('}')
    if (lastBracket > -1) {
      ret.push(last.substr(0, lastBracket))
      ret.push(last.substr(lastBracket))
    }
    return ret
  }

  $: blocks = split(code)

  const update = () => {
    dispatch('codechange', blocks.join(''))
  }

</script>

<div class="root">
  {#if !blocks || blocks.length === 0}
    no blocks detected, please use a different editor mode
  {:else}
    {#each blocks as block, i}
      {#if i % 2 === 0 && i > 0}
        <CodeEditor
          code={block}
          on:codechange={evt => { blocks[i] = evt.detail; update() }}
          />
      {:else}
        <pre class="block">{block}</pre>
      {/if}
    {/each}
  {/if}
</div>

<style>

  .root {
    padding: 0 1em;
  }

  .block {
    font-family: monospace;
    white-space: pre-wrap;
    line-height: 1.5;
    background: #ddd;
    padding: 0.5em 0;
  }

  .root :global(.CodeMirror) {
    height: 250px !important;
  }

</style>
