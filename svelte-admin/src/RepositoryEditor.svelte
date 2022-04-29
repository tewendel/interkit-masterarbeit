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
  $: remotes = $currentProject?.uiState?.git?.remotes || []

</script>
{#if open}

  {#if remotes.length > 0}
    <h3>
      Remotes
    </h3>
    <section>
      <UnorderedList>
        {#each remotes as remote}
          <ListItem>
            <strong>{remote.remote}</strong> {remote.url}
          </ListItem>
        {/each}
      </UnorderedList>
    </section>
  {/if}

  {#if unstagedFiles && unstagedFiles.length > 0}
    <h3>
      Unstaged Changes
    </h3>
    <section>
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
    </section>
  {/if}

  {#if unstagedFiles && unstagedFiles.length > 0}
    <section>
      <Button on:click={commitAll}>Commit all changed files</Button>
      <Button disabled={loadingCheckoutHead} kind="tertiary" on:click={checkoutHead}>
        Discard Changes
        {#if loadingCheckoutHead}
          <InlineLoading />
        {/if}
      </Button>
      <TextInput labelText="Commit Message" bind:value={commitMessage} hideLabel placeholder="Enter commit message..." />
    </section>
  {/if}

  {#if log && log.length > 0}
    <h3>
      Commit Log
    </h3>
    <section>
      <Accordion>
        {#each log as entry}
          <AccordionItem title={entry.date + ": " + entry.commit.message}>
            <pre>
              {JSON.stringify(entry, null, 2)}
            </pre>
          </AccordionItem>
        {/each}
      </Accordion>
    </section>
  {/if}

{/if}

<style>
  section {
    margin: 1ex 0 1em 0;
  }
</style>


