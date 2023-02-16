<script>

  import { createEventDispatcher } from 'svelte'
  import CodeEditor from './CodeEditor.svelte'
  import {
    minimalSnippet,
    wrapTwiny,
    extractTwiny,
    twiny2js
  } from './twinish.js'

  const dispatch = createEventDispatcher()

  const verbose = true

  export let code = ''

  let valid = false
  let synced = false
  let twinyCode = ''
  let jsCode = ''
  
  const build = code => {
    if (!code || (typeof code !== 'string')) return
    try {
      twinyCode = extractTwiny(code)
    } catch (err) {
      if (err.message === 'notwiny') {
        valid = false
        return
      }
      throw err
    }
    jsCode = twiny2js(twinyCode)
    valid = true
    if (verbose) console.log('CodeEditorTwiny build, done', { twinyCode, jsCode })
  }

  const twinyInput = text => {
    jsCode = twiny2js(text)
    const d = wrapTwiny(text, jsCode)
    if (verbose) console.log('CodeEditorTwiny twinyInput', { text, jsCode, d, sync: text === d })
    dispatch('codechange', d)
  }

  $: build(code)

  const prependMinimalSnippet = () => {
    code = minimalSnippet + code
  }

</script>

<div class={`root root--${valid ? 'valid' : 'invalid'}`}>
  {#if valid}
    <textarea
      class="twinycode"
      value={twinyCode}
      on:input={evt => twinyInput(evt.target.value) }
      ></textarea>
    <p style="font-size: 80%">generated code (live preview):</p>
    <CodeEditor
      style="background-color: transparent"
      code={jsCode}
      readOnly={true}
      />
  {:else}
    <div>
      <p>no twine-ish code found!</p>
      <p>
        <button on:click={prependMinimalSnippet}>try to twinify it</button>
      </p>
      <p>
        <b>Warning!</b> After the click, this will prepend some
        code to the node, but eventually, it will overwrite your code.
      </p>
    </div>
    <CodeEditor bind:code />
  {/if}
</div>

<style>

pre {
  font-family: monospace;
}

.twinycode {
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  height: 250px;
  border: none;
  font-family: monospace;
}

.root {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.root--valid :global(.CodeMirror) {
  background: transparent;
  height: 300px !important;
}

p {
  margin: 0.5em 0;
  padding: 0 0.5em;
}

</style>
