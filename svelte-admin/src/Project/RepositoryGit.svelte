<script>
  import { InterkitClient } from "interkit";
  import { onMount } from "svelte";
  import { BundleServer } from "../BundleServer";
  import {
    Button,
    CodeSnippet,
    InlineNotification,
    UnorderedList,
    ListItem,
  } from "carbon-components-svelte";

  import { currentProjectReadOnly } from "../admin";

  export let projectId;
  export let currentProject;
  export let open = false;

  let bundleServerURL;

  // get commit hash from current image tag
  const matches = INTERKIT_IMAGE_TAG.match(/([a-z0-9]{7})/)
  const commitHash = matches ? matches[0] : "v04" // default to branch
  const interkitPackageUrl = `https://gitlab.interkit.app/interkit/interkit-experiments/-/jobs/artifacts/${commitHash}/raw/interkit.tar.gz?job=publish-package`

  console.log($currentProject?.uiState);

  onMount(async () => {
    bundleServerURL = await InterkitClient.call("bundler.getUrl");
    BundleServer.connect(bundleServerURL);
  });

  const push = async (remote) => {
    const res = await BundleServer.gitPush(projectId, remote);
    alert(res.status + "\n\n" + JSON.stringify(res));
  };

  const pull = async (remote) => {
    const res = await BundleServer.gitPull(projectId, remote);
    alert(res.status + "\n\n" + JSON.stringify(res));
  };

  $: unstagedFiles = $currentProject?.uiState?.git?.unstagedChanges || [];
  $: remotes = $currentProject?.uiState?.git?.remotes || [];
</script>

{#if open}
  <h3>Git Server</h3>
  <section>
    <h5>
      Git URL
    </h5>
    <p>
      Use this URL to clone the repository to your local machine or to import it from another interkit instance.
    </p>
    <CodeSnippet style="margin-bottom:1em;" code="{BundleServer.getGitServerURL({ projectId })}" />
    {#if !$currentProjectReadOnly}
      <h5>
        Push authentication (Experimental)
      </h5>
      <p>
        <InlineNotification
          hideCloseButton
          kind="warning"
          title="Warning"
          subtitle="Push overwrites the repository on this server and resets all unstaged changes. Pull and merge before push. Commit any important changes before."
        />
        Username: <code>admin</code><br>
        Password: <code>&lt;admin password&gt;</code>
      </p>
    {/if}
  </section>

    <h3>Remotes</h3>
  {#if remotes.length > 0}
    <section>
      <UnorderedList>
        {#each remotes as remote}
          <ListItem>
            <strong>{remote.remote}</strong>
            <br />
            {remote.url}
            <br />
            {#if !$currentProjectReadOnly}
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
            {/if}
          </ListItem>
        {/each}
      </UnorderedList>
    </section>
    {:else}
    <p>
      No remotes configured.
    </p>
  {/if}

  <hr style="margin-top: 2rem" />
  <section>
  <h4>
    Standalone (Eject)
  </h4>
  <p>
    To make a cloned project work standalone, install the interkit package (note that it will still connect to this interkit server).
  </p>
  <CodeSnippet code='npm i "{interkitPackageUrl}"' />
  </section>

{/if}

<style>
  section {
    margin: 1ex 0 2em 0;
  }
  p {
    margin: 1ex 0 1ex 0;
  }
</style>
