<script>

  import { onMount, createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let code = ''

  let div = null
  let lastNonEditableContent = ''

  onMount(() => {
    console.log('CodeEditorStringy mount')
    build(code)
  })

  const build = (code) => {
    const blocks = code.split(/(\'.*?\'|\".*?\")/g)
    const editor = []
    let newNonEditableContent = ''
    blocks.forEach(block => {
      const quot = block.substr(0, 1)
      if (quot === '"' || quot === "'") {
        editor.push(document.createTextNode(quot))
        /*const input = document.createElement('input')
        input.size = block.length - 2
        input.style.width = (block.length - 2) + 'ch'
        input.value = block.substr(1, block.length - 2)*/
        const span = document.createElement('span')
        span.contentEditable = true
        span.appendChild(document.createTextNode(block.substr(1, block.length - 2)))
        editor.push(span)
        editor.push(document.createTextNode(quot))
        newNonEditableContent += quot + quot
      } else {
        editor.push(document.createTextNode(block))
        newNonEditableContent += block
      }
    })
    if (newNonEditableContent !== lastNonEditableContent) {
      // rebuild editor DOM, focus/cursor is lost
      div.innerHTML = ''
      console.log('CodeEditorStringy build', { code, blocks, editor, div })
      editor.forEach(node => { div.appendChild(node) })
      lastNonEditableContent = newNonEditableContent
    } else {
      console.log('CodeEditorStringy build bail')
    }
  }

  $: if (div && code) build(code)

  const output = () => {
    code = div.textContent
    dispatch('codechange', code)
  }

</script>

<div
  bind:this={div}
  on:input={output}
  class="editor"
  >
  intializing...
</div>

<style>

  .editor {
    white-space: pre;
    border: 1px solid black;
    font-family: monospace;
    min-height: 300px;
    overflow: scroll;
    background: #ddd;
    line-height: 1.5;
  }

  .editor :global(span),
  .editor :global(input) {
    padding: 0;
    margin: 0;
    border: 0;
    background: white;
    /* need this border as a workaround for Firefox bug
     * (contenteditable span loses focus when keyboard-navigated to end of text)
     * https://bugzilla.mozilla.org/show_bug.cgi?id=1248186
     */
    border: 1px solid black;
  }

  .editor :global(span:empty::after) {
    content: ' Ø ';
    opacity: 0.5;
  }

</style>
