<script>
  import UserAvatarFilled from "carbon-icons-svelte/lib/UserAvatarFilled.svelte";
  import { Tooltip } from "carbon-components-svelte";
  import { projectId, currentProject, currentUser, currentProjectEditingUsers } from '../admin.js'

  export let path

  $: users = ($currentProjectEditingUsers || []).filter(u => u.id != $currentUser.id && u.tab == path) || []
</script>

<span>
  {#if users.length > 0}
    <span class="user">
      <UserAvatarFilled title="This tab is currently being edited by {users.map(u => u.username).join("&")}" />
    </span>
  {/if}
  <slot />
</span>

<style>
  span {
    position: relative;
  }
  .user {
    position: absolute;
    top:-10px;
    left: 50%;
    transform: translateX(-50%);
  }
</style>

