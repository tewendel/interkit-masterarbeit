<script>
  import UserAvatarFilled from "carbon-icons-svelte/lib/UserAvatarFilled.svelte";
  import { Tooltip } from "carbon-components-svelte";
  import { projectId, currentProject, currentUser, currentProjectEditingUsers } from '../admin.js'

  export let path // the path of this tab
  export let tab // path of currently selected tab

  $: users = ($currentProjectEditingUsers || []).filter( u => {
    const howManyOnThistab = u.tabs.filter(t => t == path).length
    if (u.id == $currentUser.id) {
      if ( tab == path ) {
        // same user, different connection on same tab
        return howManyOnThistab > 1
      } else {
        // same user, different connection on different tab
        return howManyOnThistab > 0
      }
    } else {
      // different user
      return howManyOnThistab > 0
    }
  })

</script>

<span>
    <span class="user" class:active={users.length > 0}>
      <UserAvatarFilled title="This tab is currently being visited by {users.map(u => u.username).join(" & ")}" />
    </span>
  <slot />
</span>

<style>
  span {
    position: relative;
  }
  .user {
    position: absolute;
    top:-30px;
    left: 50%;
    transform: translateX(-50%);
    transition: top 0.2s 2s ease-in-out; /* delay is required because of network latency - the client does not know which connection it has, so the tab seems occupied for a while, until the server responds */
  }
  .user.active {
    top: -10px;
  }
</style>

