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
      placeholder={`Write twinish code here.\n\n[[ExampleButton]]`}
      ></textarea>
    <p style="font-size: 80%">generated code (live preview):</p>
    <CodeEditor
      style="background-color: transparent"
      code={jsCode}
      readOnly={true}
      />
  {:else}
    <div>
      <!-- this should never happen, NodeEditor should catch it -->
      <p>Error, no twine-ish code found!</p>
    </div>
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
