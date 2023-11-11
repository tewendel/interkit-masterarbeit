<script>

  import { createEventDispatcher } from 'svelte'
  import CodeEditor from '../Atoms/CodeEditor.svelte'
  import Arrival from "carbon-icons-svelte/lib/Arrival.svelte";
  import EmailNew from "carbon-icons-svelte/lib/EmailNew.svelte";

  const dispatch = createEventDispatcher()

  export let code = ''
  export let readOnly = false

  let onMessage = ''
  let onArrive = ''
  let blocks = []

  const split = code => {
    if (typeof code !== 'string') return []
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
    <p>no blocks detected, please use a different editor mode</p>
  {:else}
    {#each blocks as block, i}
      {#if i % 2 === 0 && i > 0}
        <CodeEditor
          code={block}
          {readOnly}
          on:codechange={evt => { blocks[i] = evt.detail; update() }}
          />
      {:else}
        {@const handlerName = block.match(/on[A-Z][a-z]+/)?.[0]}
        {#if handlerName}
        <h4 style="background-color: #eee; padding: 1ex 1em;">
          {#if handlerName === 'onMessage'}
            <EmailNew />
          {:else if handlerName === 'onArrive'}
            <Arrival />
          {/if}          
            {handlerName}
          </h4>
        {/if}
      {/if}
    {/each}
  {/if}
</div>

<style>

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

  p {
    margin: 1em 0;
    padding: 0 1em;
  }

</style>
