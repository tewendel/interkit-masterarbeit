<script>
  import { InterkitClient } from 'interkit'
  import { onMount } from 'svelte'
  import {BundleServer} from '../BundleServer'
  import { 
    Accordion, 
    AccordionItem, 
    Button,
    InlineLoading,
    UnorderedList, 
    ListItem,
    TextInput
  } from "carbon-components-svelte";
  import { currentProjectReadOnly } from '../admin';

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

  const push = async (remote) => {
    const res = await BundleServer.gitPush(projectId, remote)
    alert(res.status + "\n\n" + JSON.stringify(res))
  }

  const pull = async (remote) => {
    const res = await BundleServer.gitPull(projectId, remote)
    alert(res.status + "\n\n" + JSON.stringify(res))
  }

  $: unstagedFiles = $currentProject?.uiState?.git?.unstagedChanges || []
  $: log = $currentProject?.uiState?.git?.log || []
  $: remotes = $currentProject?.uiState?.git?.remotes || []
  $: diff = $currentProject?.uiState?.git?.diff || []

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
            <strong>{remote.remote}</strong> 
            <br>
            {remote.url}
            <br>
            <Button on:click={()=>push(remote.remote)} size="small" kind="tertiary">push</Button>
            <Button on:click={()=>pull(remote.remote)} size="small" kind="tertiary">pull</Button>
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
              <details>
                <summary>
                  {file}
                </summary>
                {#if diff.findIndex(d => d.fullpath == file) > -1}
                  <p>
                    {JSON.stringify(diff.find(d => d.fullpath == file))}
                    <!-- https://www.npmjs.com/package/diff -->
                  </p>
                {/if}
              </details>
            </ListItem>
          {/each}
          </UnorderedList>
        </AccordionItem>
      </Accordion>
    </section>
  {/if}

  {#if unstagedFiles && unstagedFiles.length > 0}
    <section>
      <Button 
        on:click={commitAll}
        disabled={$currentProjectReadOnly}
      >Commit all changed files</Button>
      <Button 
        disabled={loadingCheckoutHead || $currentProjectReadOnly} 
        kind="tertiary" 
        on:click={checkoutHead}
      >
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


