<script>
import initActions from "./actions.js"; 
initActions(); 
import AppBase from "interkit/components/AppBase.svelte";
import Chat from "interkit/components/Chat.svelte";
import SessionFlow from "interkit/components/SessionFlow.svelte";
import ShowIfLoggedIn from "interkit/components/ShowIfLoggedIn.svelte";
</script>

<AppBase
>
<svelte:fragment slot="viewport">
  <ShowIfLoggedIn
  >
  <svelte:fragment slot="iftrue">
    <Chat
       channel_key="test"
    >
    </Chat>
  </svelte:fragment>
  <svelte:fragment slot="else">
    <SessionFlow
       keyColumn="settings/contentKey"
       contentColumn="settings/content"
       restartTrigger="createNewUser"
          backgroundImageSrc="assets/background.png"
       logoImageSrc="assets/logo.png"
    >
    </SessionFlow>
  </svelte:fragment>
  </ShowIfLoggedIn>
</svelte:fragment>
<svelte:fragment slot="desktopFallback">
</svelte:fragment>
</AppBase>
