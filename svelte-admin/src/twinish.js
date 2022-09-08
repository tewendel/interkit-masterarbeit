import beautify from 'js-beautify'

import { negIdRE } from 'interkit/project-boards-nodes.js'

const verbose = true

const preambleCode = 'export const twinterkitSource = \`\n'
// need a strong marker here to allow stray backticks
// dont use a star/multiline comment b/c the star would have to be escaped
const postambleCode = '\n\` // end twinterkitSource\n'
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

const wrapTwiny = (text, jsCode) =>
  preambleCode + text + postambleCode + '\n' +
    warningGeneratedCode +
    jsCode

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
    } else if (twinyParagraph.substr(0, 8) === '[script]') {
      /* paragraphs like [script]code */
      // strip off starting [script] tag
      const code = twinyParagraph.substr(8)
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

const extractTwiny = code => {
  const m = code.match(nodeCodeRE)
  if (!m) {
    if (verbose) console.log('twinish extractTwiny, did not match', { code, nodeCodeRE })
    throw new Error('notwiny')
  }
  if (verbose) console.log('CodeEditorTwiny build, match', m)
  return m[1]
}

const beautifyOpts = {
  indent_size: 2
}

const isTwinish = code => {
  if (typeof code !== 'string') return 'no'
  let twinyCode
  try {
    twinyCode = extractTwiny(code)
  } catch (err) {
    if (err.message === 'notwiny') {
      return 'none'
    }
    throw err
  }
  const js = twiny2js(twinyCode)
  const rewrappedJs = wrapTwiny(twinyCode, js)
  const beautifiedCode = beautify(code, beautifyOpts)
  const beautifiedJs = beautify(rewrappedJs, beautifyOpts)
  if (verbose) console.log('twinish isTwinish', { beautifiedCode, beautifiedJs })
  return beautifiedCode === beautifiedJs
    ? 'sync'
    : 'broken'
}

export {
  minimalSnippet,
  wrapTwiny,
  twiny2js,
  extractTwiny,
  isTwinish
}

