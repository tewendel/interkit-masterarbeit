<script>
  import { InterkitClient } from "interkit";
  import { onMount } from "svelte";
  import { BundleServer } from "../BundleServer";
  import {
    Accordion,
    AccordionItem,
    Button,
    CodeSnippet,
    Form,
    FormGroup,
    InlineLoading,
    UnorderedList,
    ListItem,
    StructuredList,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    Tag,
    TextInput,
  } from "carbon-components-svelte";

  import CheckmarkOutline from "carbon-icons-svelte/lib/CheckmarkOutline.svelte";
  import { currentProjectReadOnly } from "../admin";

  export let projectId;
  export let currentProject;
  export let open = false;

  let commitInfo = "?";
  let bundleServerURL;
  let commitMessage = "";
  let loadingCommit = false;
  let loadingCheckoutHead = false;

  let selectedTab;

  console.log($currentProject?.uiState);

  onMount(async () => {
    bundleServerURL = await InterkitClient.call("bundler.getUrl");
    BundleServer.connect(bundleServerURL);
  });

  const commitAll = async () => {
    loadingCommit = true;
    await BundleServer.gitCommitAll(
      projectId,
      commitMessage || `changed ${unstagedFiles.length} files`
    );
    loadingCommit = false;
  };

  const checkoutHead = async () => {
    loadingCheckoutHead = true;
    await BundleServer.gitCheckoutHead(projectId);
    loadingCheckoutHead = false;
    //await BundleServer.compileReloadPreview();
    window.location.reload(); // reload to reset non-reactive blockly editor and story editor. TODO just reload the files
  };

  const push = async (remote) => {
    const res = await BundleServer.gitPush(projectId, remote);
    alert(res.status + "\n\n" + JSON.stringify(res));
  };

  const pull = async (remote) => {
    const res = await BundleServer.gitPull(projectId, remote);
    alert(res.status + "\n\n" + JSON.stringify(res));
  };

  const dateFormat = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  $: unstagedFiles = $currentProject?.uiState?.git?.unstagedChanges || [];
  $: log = $currentProject?.uiState?.git?.log || [];
  $: remotes = $currentProject?.uiState?.git?.remotes || [];
  $: diff = $currentProject?.uiState?.git?.diff || [];
</script>

{#if open}
  {#if remotes.length > 0}
    <h3>Remotes</h3>
    <section>
      <UnorderedList>
        {#each remotes as remote}
          <ListItem>
            <strong>{remote.remote}</strong>
            <br />
            {remote.url}
            <br />
            <Button
              on:click={() => push(remote.remote)}
              size="small"
              kind="tertiary">push</Button
            >
            <Button
              on:click={() => pull(remote.remote)}
              size="small"
              kind="tertiary">pull</Button
            >
          </ListItem>
        {/each}
      </UnorderedList>
    </section>
  {/if}
  
  {#if unstagedFiles && unstagedFiles.length > 0}
    <h3>
      There are {unstagedFiles.length} changed files
    </h3>
    <section>
      <Accordion>
        <AccordionItem title="List of changed files">
          <UnorderedList>
            {#each unstagedFiles as file}
              <ListItem>
                <!--details-->
                <summary>
                  {file}
                </summary>
                {#if diff.findIndex((d) => d.fullpath == file) > -1}
                  <p>
                    {JSON.stringify(diff.find((d) => d.fullpath == file))}
                    <!-- https://www.npmjs.com/package/diff -->
                  </p>
                {/if}
                <!--/details-->
              </ListItem>
            {/each}
          </UnorderedList>
        </AccordionItem>
      </Accordion>
    </section>
  {:else}
    <h3>
      Nothing to commit <CheckmarkOutline />
    </h3>
    <section>
      <p>
        All files are commited to the repository. There are currently no changes 
        to files in this project.
      </p>
    </section>
  {/if}

  <section>
    {#if unstagedFiles && unstagedFiles.length > 0}
      <Form>
        <FormGroup>
          <h4>
            Save the files to the repository.
          </h4>
          <div style="margin-bottom:1em;">
          <TextInput
            labelText="Commit Message"
            bind:value={commitMessage}
            hideLabel
            size="sm"
            helperText="Add a message to describe the changes (optional)"
            placeholder="Enter commit message..."
          />
          </div>

          <Button on:click={commitAll} disabled={$currentProjectReadOnly}
          style="white-space:nowrap;"
            >
            Commit {unstagedFiles.length} changed files
            {#if loadingCommit}
              &nbsp;<InlineLoading />
            {/if}
            </Button
          >
        </FormGroup>

        <FormGroup noMargin>
          <h4>
            Discard all changes and restore files from last commit.
          </h4>
          <Button
          style="white-space:nowrap;"
            disabled={loadingCheckoutHead || $currentProjectReadOnly}
            kind="danger"
            title="Discard all changes and reset to last commit"
            on:click={checkoutHead}
          >
            Discard Changes
            {#if loadingCheckoutHead}
              &nbsp;<InlineLoading />
            {/if}
          </Button>
        </FormGroup>
      </Form>
    {/if}
  </section>

  {#if log && log.length > 0}
    <h3>Log of previous Commits</h3>
    <section>
      <Accordion>
        {#each log as entry}
          <AccordionItem>
            <h6 slot="title">
              <Tag>
                {entry.date.toLocaleDateString("en-UK", dateFormat)}
              </Tag>

              {entry.commit.message}
            </h6>
            <StructuredList condensed>
              <StructuredListBody>
                {#each [
                  ["ID",entry.oid],
                  ["Message",entry.commit?.message],
                ["Author Name",entry.commit?.author?.name],
                ["Author Email",entry.commit?.author?.email]
                ] as [key, value]}
                  <StructuredListRow>
                    <StructuredListCell noWrap>
                      {key}
                    </StructuredListCell>
                    <StructuredListCell>
                      {value}
                    </StructuredListCell>
                  </StructuredListRow>
                {/each}
              </StructuredListBody>
            </StructuredList>
              
            
          </AccordionItem>
        {/each}
      </Accordion>
    </section>
  {/if}

  <h3>Repository cloning</h3>
  <CodeSnippet style="margin-bottom:1em;" code="git clone {BundleServer.getGitServerURL({ projectId })}" />

{/if}

<style>
  section {
    margin: 1ex 0 2em 0;
  }
  p {
    margin: 1ex 0 1ex 0;
  }
  h4 {
    margin: 0 0 1ex 0;
  }
</style>
