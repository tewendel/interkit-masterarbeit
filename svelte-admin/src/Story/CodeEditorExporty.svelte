<script>

  import { createEventDispatcher } from 'svelte'
  import { Button } from "carbon-components-svelte"
  import CodeEditor from '../Atoms/CodeEditor.svelte'
  import Arrival from "carbon-icons-svelte/lib/Arrival.svelte";
  import EmailNew from "carbon-icons-svelte/lib/EmailNew.svelte";

  const dispatch = createEventDispatcher()

  export let code = ''
  export let readOnly = false
  export let setEditorMode

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
            <span class="handlerBar">
              <span>
                <EmailNew />
                {handlerName}
              </span>
              <span class="args">api, msg</span>
            </span>
            
          {:else if handlerName === 'onArrive'}
            <span class="handlerBar">
              <span>
                <Arrival />
                {handlerName} 
              </span>
              <span class="args">api</span>
            </span>
          {:else}
              <Button
                on:click={() => setEditorMode(1)}
                kind="tertiary"
                size="small"
                style="margin: 0.5em auto"
                >
                See all code in the Full tab
              </Button>
          {/if}          
            
          </h4>
        {/if}
      {/if}
    {/each}
  {/if}
</div>

<style lang="scss">
  @use '@carbon/type';

  .block {
    font-family: monospace;
    white-space: pre-wrap;
    line-height: 1.5;
    background: #ddd;
    padding: 0.5em 0;
  }

  .root {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .root :global(.CodeMirror:first-of-type) {
    height: 35%;
  }

  p {
    margin: 1em 0;
    padding: 0 1em;
  }

  .handlerBar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .args {
    @include type.type-style("heading-compact-02");
    color: #666;
  }

</style>
