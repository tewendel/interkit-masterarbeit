<script>
  import { InterkitClient } from 'interkit'
  import { onMount } from 'svelte'
  import {BundleServer} from './BundleServer'
  import { 
    Accordion, 
    AccordionItem, 
    Button,
    InlineLoading,
    UnorderedList, 
    ListItem,
    TextInput
  } from "carbon-components-svelte";

  export let projectId
  export let currentProject
  export let open = false
  
  let commitInfo = "?"
  let bundleServerURL
  let commitMessage = ""
  let loadingCheckoutHead = false

  let selectedTab

  console.log($currentProject?.uiState)

  onMount( async () => {
    bundleServerURL = await InterkitClient.call("bundler.getUrl")
    BundleServer.connect(bundleServerURL)
  })

  const commitAll = async () => {
    BundleServer.gitCommitAll(projectId, commitMessage || `changed ${unstagedFiles.length} files`)
  }

  const checkoutHead = async () => {
    loadingCheckoutHead = true
    await BundleServer.gitCheckoutHead(projectId)
    loadingCheckoutHead = false
    await BundleServer.compileReloadPreview()
    window.location.reload() // TODO just reload the files
  }

  $: unstagedFiles = $currentProject?.uiState?.git?.unstagedChanges || []
  $: log = $currentProject?.uiState?.git?.log || []

</script>
{#if open}

  {#if unstagedFiles && unstagedFiles.length > 0}
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

  {#if unstagedFiles && unstagedFiles.length > 0}
    <Button on:click={commitAll}>Commit all changed files</Button>
    <Button disabled={loadingCheckoutHead} kind="tertiary" on:click={checkoutHead}>
      Discard Changes
      {#if loadingCheckoutHead}
        <InlineLoading />
      {/if}
    </Button>
    <TextInput labelText="Commit Message" bind:value={commitMessage} hideLabel placeholder="Enter commit message..." />
  {/if}

  {#if log && log.length > 0}
    <Accordion>
      {#each log as entry}
        <AccordionItem title={entry.date + ": " + entry.commit.message}>
          <pre>
            {JSON.stringify(entry, null, 2)}
          </pre>
        </AccordionItem>
      {/each}
    </Accordion>
  {/if}

{/if}

<style>
  p {
    margin: 1ex 0;
  }
</style>


