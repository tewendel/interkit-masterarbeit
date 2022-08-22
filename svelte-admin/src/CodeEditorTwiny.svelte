<script>

  import { createEventDispatcher } from 'svelte'
  import { negIdRE } from 'interkit/project-boards-nodes.js'
  import CodeEditor from './CodeEditor.svelte'

  const dispatch = createEventDispatcher()

  const verbose = true

  export let code = ''

  let valid = false

  const preambleCode = 'export const twinterkitSource = \`\n'
  const postambleCode = '\n\`\n'
  let twinyCode = ''
  let jsCode = ''

  const minimalSnippet = preambleCode + 'foo' + postambleCode

  const warningGeneratedCode = '/* Warning! This code has been generated in Twine-ish-mode.\n' +
    ' * Changes below might be overwritten when it is edited the next time,\n' + 
    ' * changes above will not work until you re-edit in twine-ish mode\n' +
    ' */\n\n'

  // multiline, \s\S matches newlines (. doesn't)
  const nodeCodeRE = new RegExp(preambleCode + '([\\s\\S]*?)' + postambleCode, 'm')

  // match all twine-like passage links, non-greedy global with lookahead and -behind
  // ` abc [[def]] gh ij [[ k l ]] mno ` => [ 'def', ' k l ']
  const twinyOptionsRE = /(?<=\[\[)(.*?)(?=\]\])/g

  const slugNegIdRE = new RegExp(negIdRE, 'ug')
  const nodeIdSlugify = str => str.replace(slugNegIdRE, '-')

  const twiny2js = str => {
    str = str.replace(/\`/g, '')
    const onArrive = []
    const moveTos = []
    str.split('\n\n').forEach(twinyParagraph => {
      if (twinyParagraph.indexOf('[[') > -1) {
        const options = twinyParagraph.match(twinyOptionsRE)
        if (options) {
          const choices = {}
          let hasT = false
          options.forEach(option => {
            choices['choice' + moveTos.length] = option
            option = option.trim()
            const pipePos = option.indexOf('|')
            if (pipePos > -1) {
              hasT = true
              option = option.substr(0, pipePos)
            }
            moveTos.push(nodeIdSlugify(option))
          })
          const choicesCode = JSON.stringify(choices, null, '    ')
            .replace(/^}/m, '  }')
          const func = hasT ? 'sendChoiceT' : 'sendChoice'
          onArrive.push(`  api.${func}(${choicesCode})\n`)
          return
        }
      }
      const func = twinyParagraph.indexOf('|') > -1
        ? 'sendTextT'
        : 'sendText'
      onArrive.push(`  api.${func}(\`${twinyParagraph}\`)\n`)
      return 
    })
    // the code has to be pre-prettified, otherwise the NodeEditor modified comparison can trip 
    // because node.contents !== editorContents
    // could be solved by smarted pre-save-prettification
    return `export const onArrive = async (api) => {\n` +
      onArrive.join('') +
      `}\n\n` +
      `export const onMessage = async (msg, api) => {\n` +
      `  switch (msg.payload.text) {\n` +
      moveTos.map((slug, index) => `    case 'choice${index}':\n      api.moveTo('${slug}')\n      break\n`).join('') +
      `  }\n` +
      `}`
  }
  
  const build = code => {
    console.trace('CodeEditorTwiny build')
    if (!code || (typeof code !== 'string')) return
    const m = code.match(nodeCodeRE)
    if (verbose) console.log('CodeEditorTwiny build, match', m)
    if (!m) {
      valid = false
      return
    }
    twinyCode = m[1]
    jsCode = twiny2js(twinyCode)
    valid = true
    if (verbose) console.log('CodeEditorTwiny build, done', { twinyCode, jsCode })
    /*
    return preambleCode + twinyCode + postambleCode + '\n' +
      warningGeneratedCode +
      jsCode
    */
  }

  const twinyInput = text => {
    jsCode = twiny2js(text)
    const d = preambleCode + text + postambleCode + '\n' +
      warningGeneratedCode +
      jsCode
    if (verbose) console.log('CodeEditorTwiny twinyInput', { text, jsCode, d })
    dispatch('codechange', d)
  }

  $: build(code)

  const prependMinimalSnippet = () => {
    code = minimalSnippet + code
  }

</script>

<div class={`root root--${valid ? 'valid' : 'invalid'}`}>
  {#if valid}
    <!--<pre>{preambleCode}</pre>-->
    <textarea
      class="twinycode"
      value={twinyCode}
      on:input={evt => twinyInput(evt.target.value) }
      ></textarea>
    <!--<pre>{postambleCode}</pre>-->
    <p>generated code (live preview):</p>
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
