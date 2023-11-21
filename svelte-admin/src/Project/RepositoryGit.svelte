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
    {:else}
    <p>
      No remotes configured.
    </p>
  {/if}

{/if}

<style>
  section {
    margin: 1ex 0 2em 0;
  }
  p {
    margin: 1ex 0 1ex 0;
  }
</style>
