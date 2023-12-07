<script>
  import {
    ButtonSet,
    Button,
  } from "carbon-components-svelte";
  import { navigateTab } from '../Layout/ProjectWorkspace.svelte'
  import ReportsNotificationBadge from "../Messages/ReportsNotificationBadge.svelte";
  import RepositoryNotificationBadge from "../Project/RepositoryNotificationBadge.svelte";
  import {
    projectId,
    currentProject,
    previewOverrideStyleTokens,
    currentProjectReadOnly,
    projectTabPath,
  } from "../admin.js";

  export let contentMain;

  const buttonStyle = (slug, contentM) => {
    let style = "color: black; width: 100%; ";
    if (contentM == slug) {
      style += "background-color:lightgrey; font-weight:500;";
    }
    return style
  };

  const navigate = (path) => {
    navigateTab(path, true)
    projectTabPath.set(path)
  }

  const buttonProps = {
    kind: "ghost",
    size: "small",
  }

</script>

<div class="design-sidebar-container">
  
  <Button
    {...buttonProps}
    style={buttonStyle(null, contentMain)}
    on:click={() => navigate("")}
  >
    Start
  </Button>

  <Button
    {...buttonProps}
    style={buttonStyle("users", contentMain)}
    on:click={() => navigate("users")}
  >
    Users
  </Button>

  <Button
    {...buttonProps}
    style={buttonStyle("messages", contentMain)}
    on:click={() => navigate("messages")}
  >
    Messages
    <ReportsNotificationBadge {projectId} />
  </Button>

  <Button
    {...buttonProps}
    style={buttonStyle("schedule", contentMain)}
    on:click={() => navigate("schedule")}
  >
    Schedule
  </Button>  

  <Button
    {...buttonProps}
    style={buttonStyle("repository", contentMain)}
    on:click={() => navigate("repository")}
  >
    Repository
    <RepositoryNotificationBadge  />
  </Button>

  <Button
    {...buttonProps}
    style={buttonStyle("project", contentMain)}
    on:click={() => navigate("project")}
  >
    Settings
  </Button>

</div>

<style lang="scss">
  h6 {
    padding: 16px 16px 8px 16px;
  }
</style>
