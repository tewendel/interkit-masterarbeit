<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AnonymousLogin from "interkit/components/AnonymousLogin.svelte";
import AppBase from "interkit/components/AppBase.svelte";
import Button from "interkit/components/Button.svelte";
import Chat from "interkit/components/Chat.svelte";
import ChatBoardsList from "interkit/components/ChatBoardsList.svelte";
import ChatRoute from "interkit/components/ChatRoute.svelte";
import HorizontalSpacer from "interkit/components/HorizontalSpacer.svelte";
import Icon from "interkit/components/Icon.svelte";
import Route from "interkit/components/Route.svelte";
import TopBarShell from "interkit/components/TopBarShell.svelte";
import styleTokens from "./styleTokens.json";
globalThis.styleTokens = styleTokens;
console.log('AppBase styleTokens', styleTokens);
initActions();
$: $translations, translations, t, $lang, lang, console.log('AppBase i18n $', { t, $translations, translations, $lang, lang });
console.log('AppBase i18n', { t, $translations, translations, $lang, lang });
</script>

<AppBase
   >
  <AnonymousLogin
     defaultLang="en"
     >
    <Route
       path="/"
       keepAlive={true}
    >
      <ChatBoardsList
         path="/chat"
      >
      </ChatBoardsList>
    </Route>
    <ChatRoute
       path="/chat"
    >
      <TopBarShell
      >
      <svelte:fragment slot="TopBar">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
          <Button
                type="secondary"
             size="medium"
             flex="normal"
                effect={{"effectType":"back"}}
          >
            <Icon
               type="Thin-Arrow-Left"
               inverse={false}
            >
            </Icon>
          </Button>
        </svelte:fragment>
        <svelte:fragment slot="center">
        </svelte:fragment>
        <svelte:fragment slot="right">
        </svelte:fragment>
        </HorizontalSpacer>
      </svelte:fragment>
      <svelte:fragment slot="Content">
        <Chat
           board="board1"
           messagesReportableDefault="TRUE"
           typingDurationTypeChoiceDefault="0.0"
           typingDurationTypeTextPerCharacter="0.075"
           >
        <svelte:fragment slot="Player">
        </svelte:fragment>
        </Chat>
      </svelte:fragment>
      </TopBarShell>
    </ChatRoute>
  </AnonymousLogin>
</AppBase>

<Route
   path="/"
   keepAlive={true}
>
  <ChatBoardsList
     path="/chat"
  >
  </ChatBoardsList>
</Route>

<ChatRoute
   path="/chat"
>
  <TopBarShell
  >
  <svelte:fragment slot="TopBar">
    <HorizontalSpacer
    >
    <svelte:fragment slot="left">
      <Button
            type="secondary"
         size="medium"
         flex="normal"
            effect={{"effectType":"back"}}
      >
        <Icon
           type="Thin-Arrow-Left"
           inverse={false}
        >
        </Icon>
      </Button>
    </svelte:fragment>
    <svelte:fragment slot="center">
    </svelte:fragment>
    <svelte:fragment slot="right">
    </svelte:fragment>
    </HorizontalSpacer>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <Chat
       board="board1"
       messagesReportableDefault="TRUE"
       typingDurationTypeChoiceDefault="0.0"
       typingDurationTypeTextPerCharacter="0.075"
       >
    <svelte:fragment slot="Player">
    </svelte:fragment>
    </Chat>
  </svelte:fragment>
  </TopBarShell>
</ChatRoute>
