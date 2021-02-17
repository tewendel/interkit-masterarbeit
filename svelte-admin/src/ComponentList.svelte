<script>

  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import InterkitClient from '../../shared/interkit-client.js'

  export let selectComponent;
  export let currentComponent;
  export let projectId;
  
  let files = [];
  let newFilename;
  const createFile = async (filename) => {
    await InterkitClient.call("file.create", {filename: newFilename, projectId})
    await loadFiles();  
    newFilename = null;
  }

  const loadFiles =  async () => {
    files = await InterkitClient.call("project.list", {projectId})  
  }

  // show only components with .svelte
  $: components = files.filter(f=>f.includes(".svelte")).map(f=>f.replace(".svelte", ""))

  $: setup(projectId)
  
  const setup = async (projectId) => {
    await loadFiles()  
  }
  

</script>




<Tabs>
      <Tab label="components" />
      <Tab label="files" />
    <div slot="content">
      <TabContent>
        <ul>
          {#each components as component}
            <li class="{currentComponent == component ? 'active' : ''}" on:click={()=>{selectComponent(component)}}>{component}</li>
          {/each}
          </ul>
      </TabContent>
      
      <TabContent>
        <ul>
          {#each files as file}
            <li on:click={()=>{selectComponent(file.split(".")[0])}}>{file}</li>
          {/each}
        </ul>
        <br>
        <input bind:value={newFilename}>
        <button on:click={createFile}>create file</button><br>

      </TabContent>
    
    </div>
  </Tabs>



<style>
  li:hover {
    cursor: pointer;
  }

  li.active {
    font-weight: bold;
  }
</style>