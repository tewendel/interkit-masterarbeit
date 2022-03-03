<script>
  import { InterkitClient } from 'interkit'
  import { onMount } from 'svelte'
  import {BundleServer} from './BundleServer'
  import { Accordion, AccordionItem, UnorderedList, ListItem } from "carbon-components-svelte";

  export let projectId
  export let currentProject
  export let open = false
  
  let commitInfo = "?"
  let bundleServerURL

  let selectedTab

  console.log($currentProject?.uiState)

  onMount( async () => {
    bundleServerURL = await InterkitClient.call("bundler.getUrl")
    BundleServer.connect(bundleServerURL)
  })

  $: unstagedFiles = $currentProject?.uiState?.git?.unstagedChanges || []

</script>
{#if open}
  {#if unstagedFiles}
    <Accordion>
      <AccordionItem title={unstagedFiles.length + " changed files"}>
        <UnorderedList>
        
        {#each unstagedFiles as file}
            <ListItem>
            {file}
            </ListItem>
        {/each}
        </UnorderedList>
      </AccordionItem>
    </Accordion>
  {/if}
{/if}

<style>
  p {
    margin: 1ex 0;
  }
</style>


