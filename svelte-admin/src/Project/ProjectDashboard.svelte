<script>
  import { Button, ButtonSet, Toggle, Tag } from "carbon-components-svelte";
  import Copy from "carbon-icons-svelte/lib/Copy.svelte";
  import {
    currentProject,
    secondaryTabIndex,
    secondaryTabSpecialDoc,
    currentProjectReadOnly,
    projectManagerTab,
  } from "../admin.js";
  import { InterkitClient } from "interkit";
  import { docsGo } from "../docs";
  import { push } from "svelte-spa-router";
  import Markdown from "../Atoms/Markdown.svelte";

  export let projectId;

  const userIsRole = InterkitClient.userIsRole;

  const filterDocLink = (url) => {
    const docsURL = "https://docs.interkit.app";
    if (url.includes(docsURL)) {
      let docsPath = url.replace(docsURL, "");
      console.log("docsGo with", docsPath);
      docsGo(docsPath);
    } else {
      window.open(url, "_blank");
    }
  };

  const info = (file) => {
    secondaryTabIndex.set(1);
    secondaryTabSpecialDoc.set($currentProject.uiState.metafile[file].html);
  };

  const duplicateProject = async () => {
    console.log("duplicating project", projectId);
    const newId = await InterkitClient.call("project.duplicate", { projectId });
    if (newId) {
      projectManagerTab.set(0);
      push("/" + newId);
    } else {
      alert("There was an error, creating the new project.");
    }
  };
</script>

<div class="ProjectDashboard markdownContent">
  <ButtonSet style="justify-content: end">
    <!--Button
        kind="tertiary"
        size="small"
        on:click={() => info('readme')}
        icon={Information}
        disabled={!$currentProject?.uiState?.metafile?.readme?.html}
        >
        Show Readme
      </Button-->
    {#if $currentProject?.uiState?.metafile?.project?.html}
      <!--Button
          kind="ghost"
          size="field"
          on:click={() => info('project')}
          style="max-width: none; margin-left: 1px"
          icon={OpenPanelFilledRight}
          disabled={!$currentProject?.uiState?.metafile?.project?.html}
          >
          Show this text on the right
        </Button-->
    {/if}
  </ButtonSet>
  <div class="content">
    {#if $currentProject?.uiState?.metafile?.project?.html}
      <div
        on:click={(e) => {
          filterDocLink(e.target.href);
          e.preventDefault();
        }}
      >
      <Markdown source={$currentProject?.uiState?.metafile?.project?.html} />
      </div>
    {:else}
      <h1>
        Welcome to {$currentProject?.name}
      </h1>
      This project/template does not provide an information file (project.md).
    {/if}
    {#if $currentProject?.isTemplate}
      <div style="margin-top: 2em;">
        <p>This project is a <Tag>template</Tag></p>
        {#if $userIsRole?.admin}
          <p>
            As an admin user, you can deactivate readonly mode to make changes
            directly to the template.
            <Toggle
              labelText="Read only mode"
              toggled={$currentProjectReadOnly}
              on:toggle={(e) => {
                if (!e.detail.toggled) {
                  currentProjectReadOnly.set(false);
                } else {
                  currentProjectReadOnly.set(true);
                }
              }}
            />
          </p>
        {/if}
        <p>
          You can create a new project based on this template
          <Button size="small" icon={Copy} on:click={duplicateProject}
            >Create</Button
          >
        </p>
      </div>
    {/if}
  </div>
</div>

<style>

  h1 {
    margin-bottom: 10px;
  }

  .content {
    padding: 0 1rem;
    margin: 1rem 0;
  }

  :global(.markdownContent h2) {
    margin-bottom: 0.25em;
    font-weight: bold;
  }
  
  :global(.markdownContent h4) {
    margin-top: 1em;
    margin-bottom: 0.5em;
    font-weight: bold;
  }

  :global(.markdownContent ul) {
    list-style: disc;
    margin-left: 1em;
  }

  :global(.markdownContent li) {
    margin-bottom: 1em;
  }
</style>