<script>

  import CodeMirror from 'codemirror';
  import 'codemirror/lib/codemirror.css';
  import 'codemirror/addon/lint/lint.css';
  import 'codemirror/mode/javascript/javascript.js';
  import 'codemirror/mode/markdown/markdown.js';
  import 'codemirror/mode/handlebars/handlebars.js';
  import "codemirror/addon/lint/lint.js";
  import "codemirror/addon/lint/javascript-lint.js";

  import { createEventDispatcher, onMount, afterUpdate, onDestroy } from 'svelte';

  const dispatch = createEventDispatcher();

  let textArea;
  let editor;
  let editorChanged = false;

  export let code = "";
  export let readOnly = false;
  export let language = "javascript";
  export let lint = false;
  
  onMount(()=>{
    console.log("CodeEditor mount");
    //console.log(language);
    editor = CodeMirror.fromTextArea(textArea, {
      lineNumbers: true,
      mode: language,
      readOnly: readOnly ? true : false,
      lineWrapping: true,
      gutters: lint ? ["CodeMirror-lint-markers"] : [],
      lint: lint && {options: {esversion: 11, browser: true, asi: true}},
    });
    let charWidth = editor.defaultCharWidth();
    let basePadding = 4;
    editor.on("renderLine", function(cm, line, elt) {
      var off = CodeMirror.countColumn(line.text, null, cm.getOption("tabSize")) * charWidth;
      elt.style.textIndent = "-" + off + "px";
      elt.style.paddingLeft = (basePadding + off) + "px";
    });
    editor.refresh();
    editor.on("change", ()=>{
      editorChanged = true
      code = editor.getValue()
      dispatch('change', {code})
      dispatch('codechange', code)
    })
  })

  afterUpdate(()=>{
    if(!editorChanged) {
      editor.getDoc().setValue(code ? code : "");
      window.setTimeout(() => { editor.refresh() }, 200)
    }
    editorChanged = false;
  })

  onDestroy(()=> {
    editor.toTextArea();
  })

</script>

<svelte:head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jshint/2.13.4/jshint.min.js"></script>
</svelte:head>

<textarea bind:this={textArea} value={code}></textarea>  

<style>

  :global(.CodeMirror) {
    /* height: 500px !important; */
    height: 100%;
  }

</style>
