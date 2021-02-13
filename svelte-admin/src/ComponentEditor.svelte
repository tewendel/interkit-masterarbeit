<script>
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import InterkitClient from '../../shared/interkit-client.js'
  import ComponentList from './ComponentList.svelte';
  import FileEditor from './FileEditor.svelte';

  export let projectId

  let currentComponent = null;
  
  const close = () => {
    currentComponent = null;
  }

  const selectComponent = (component) => {
    currentComponent = component;
  }

  let shared;
  const updateShared = (yaml) => {
    console.log("update")
    shared = yaml
  }
  
</script>

<ComponentList {selectComponent} {projectId}/>
  
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



<style>
  textarea {
    width: 400px;
    height: 150px;
  }
  
</style>
