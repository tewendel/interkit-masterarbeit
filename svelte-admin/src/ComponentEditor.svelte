<script>
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import ComponentList from './ComponentList.svelte';
  import FileEditor from './FileEditor.svelte';

  export let projectId

  let currentComponent = null;
  
  const close = () => {
    currentComponent = null;
    currentFile = null;
  }

  const selectComponent = (component) => {
    currentComponent = component;
    shared = null;
    currentFile = null;
  }

  let shared;
  const updateShared = (yaml) => {
    console.log("update")
    shared = yaml
  }

  // for single file mode
  let currentFile = null;

  const selectFile = (file) => {
    currentFile = file;
    shared = null;
    currentComponent = null;
  }

  
</script>

<ComponentList {selectComponent} {currentComponent} {selectFile} {currentFile} {projectId}/>
  
{#if currentComponent}
  <h2>component: {currentComponent} <button on:click={close}>close</button></h2>

  <Tabs>
      <Tab label="config form" />
      <Tab label="yml editor" />
      <Tab label="svelte editor" />
    <div slot="content">
      <TabContent>
        <FileEditor file={currentComponent + ".yml"} config {projectId} {updateShared} {shared}/>
      </TabContent>
      <TabContent>
        <FileEditor file={currentComponent + ".yml"} {projectId} {updateShared} {shared}/>
      </TabContent>
      <TabContent>
        <FileEditor file={currentComponent + ".svelte"} {projectId}/>
      </TabContent>
    </div>
  </Tabs>

{/if}

{#if currentFile} 
  <h2>file: {currentFile} <button on:click={close}>close</button></h2>
  <FileEditor file={currentFile} {projectId}/>
{/if}



<style>

</style>
