<script>

  import { createEventDispatcher } from 'svelte'
  import { negIdRE } from 'interkit/project-boards-nodes.js'
  import CodeEditor from './CodeEditor.svelte'

  const dispatch = createEventDispatcher()

  const verbose = true

  export let code = ''

  let valid = false

  const preambleCode = 'export const twinterkitSource = \`\n'
  // need a strong marker here to allow stray backticks
  // dont use a star/multiline comment b/c the star would have to be escaped
  const postambleCode = '\n\` // end twinterkitSource\n'
  let twinyCode = ''
  let jsCode = ''

  const minimalSnippet = preambleCode + 'foo' + postambleCode

  const warningGeneratedCode = '/* Warning! This code has been generated in Twine-ish-mode.\n' +
    ' * Changes below might be overwritten when it is edited the next time,\n' + 
    ' * changes above will not work until you re-edit in twine-ish mode\n' +
    ' */\n\n'

  // multiline, \s\S matches newlines (. doesn't)
  const nodeCodeRE = new RegExp(preambleCode + '([\\s\\S]*?)' + postambleCode, 'm')

  const twinyOptionsRE = /\[\[.*?\]\]/g
  // lookbehind unsupported on webkit
  // match all twine-like passage links, non-greedy global with lookahead and -behind
  // ` abc [[def]] gh ij [[ k l ]] mno ` => [ 'def', ' k l ']
  // const twinyOptionsRE = /(?<=\[\[)(.*?)(?=\]\])/g

  const slugNegIdRE = new RegExp(negIdRE, 'ug')
  const nodeIdSlugify = str => str.replace(slugNegIdRE, '-')

  /** parse and convert our twine-ish syntax to interkit node syntax
   * (i.e. an onArrive and onMessage handler)
   * Empty lines separate paragraphs;
   * paragraphs make messages/sendTexts, unless they contain [[links]]
   * then they become sendChoices.
   * We support aliases ("link renaming" in Twin parlance. Their docs
   * are super confusing https://twinery.org/cookbook/starting/twine2/creatinglinks.html)
   * and our i18n on top. These are equivalent:
   * [[Label|Beschriftung->destNodeId]]
   * [[destNodeId<-Label|Beschriftung]]
   * [[Label|Beschriftung|destNodeId]]
   */
  const twiny2js = str => {
    const onArrive = []
    const onMessage = []
    const moveTos = []
    // twiny paragraphs are separated by empty lines, markdown style
    str.split('\n\n').forEach((twinyParagraph, paragraphIndex, twinyParagraphs) => {
      if (twinyParagraph.indexOf('[[') > -1) {
        /* paragraphs with [[link]] will sendChoice,
         * other text will be ignored */
        let options = twinyParagraph.replace(/\`/g, '').match(twinyOptionsRE)
          // unwrap matches from square brackets `[[ foo ]]`
          ?.map(_ => _.substr(2, _.length - 4))
        if (options) {
          const choices = {}
          // flag to later pick between sendTextT/sendText
          let hasT = false
          options.forEach(option => {
            option = option.trim()
            let destination
            const lastPipePos = option.lastIndexOf('|')
            const rightArrowPos = option.indexOf('->')
            const leftArrowPos = option.indexOf('<-')
            // chop off the "aliases" and use them as option Labels
            // (Labels can be pipe-sep)
            // chopped of part will be dest(…inationNodeId)
            if (rightArrowPos > -1) {
              // [[Label->destNodeId]]
              // [[Label|Beschriftung->destNodeId]]
              destination = option.substr(rightArrowPos + 2)
              option = option.substr(0, rightArrowPos)
            } else if (leftArrowPos > -1) {
              // [[destNodeId<-Label]]
              // [[destNodeId<-Label|Beschriftung]]
              destination = option.substr(0, leftArrowPos)
              option = option.substr(leftArrowPos + 2)
            } else if (lastPipePos > -1) {
              // [[Label|destNodeId]]
              // [[Label|Beschriftung|destNodeId]]
              destination = option.substr(lastPipePos + 1)
              option = option.substr(0, lastPipePos)
            } else {
              destination = option
            }
            // check remaining option string for pipe-separation
            if (option.indexOf('|') > -1) hasT = true
            choices['choice' + moveTos.length] = option
            moveTos.push(nodeIdSlugify(destination))
          })
          const choicesCode = JSON.stringify(choices, null, '    ')
            // properly, though hackily indent final closing curly
            .replace(/^}/m, '  }')
          const func = hasT ? 'sendChoiceT' : 'sendChoice'
          onArrive.push(`  api.${func}(${choicesCode})\n`)
        }
      } else if (twinyParagraph.substr(0, 1) === '`' && twinyParagraph.substr(-1) === '`') {
        /* paragraphs like `code` */
        const code = twinyParagraph.replace(/\`/g, '')
        // last paragraph goes to onMessage
        if (paragraphIndex === twinyParagraphs.length - 1) {
          onMessage.push(`  ${code}\n`)
        } else {
          onArrive.push(`  ${code}\n`)
        }
      } else {
        /* all other paragraphs */
        const func = twinyParagraph.indexOf('|') > -1
          ? 'sendTextT'
          : 'sendText'
        onArrive.push(`  api.${func}(\`${twinyParagraph.replace(/\`/g, '')}\`)\n`)
      }
    })
    // the code has to be pre-prettified, otherwise the NodeEditor modified comparison can trip 
    // because node.contents !== editorContents
    // could be solved by smarted pre-save-prettification
    return `export const onArrive = async (api) => {\n` +
      onArrive.join('') +
      `}\n\n` +
      `export const onMessage = async (msg, api) => {\n` +
      onMessage.join('') +
      `  switch (msg.payload.key) {\n` +
      moveTos.map((slug, index) =>
        `    case 'choice${index}':\n` +
        `      api.moveTo('${slug}')\n` +
        `      break\n`
      ).join('') +
      `  }\n` +
      `}`
    return ret
  }
  
  const build = code => {
    if (!code || (typeof code !== 'string')) return
    const m = code.match(nodeCodeRE)
    if (!m) {
      if (verbose) console.log('CodeEditorTwiny build, did not match', { code, nodeCodeRE })
      valid = false
      return
    } else {
      if (verbose) console.log('CodeEditorTwiny build, match', m)
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
