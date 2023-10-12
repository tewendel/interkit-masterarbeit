<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AnonymousLogin from "interkit/components/AnonymousLogin.svelte";
import AppBase from "interkit/components/AppBase.svelte";
import Button from "interkit/components/Button.svelte";
import DataLoaderSingle from "interkit/components/DataLoaderSingle.svelte";
import IfUIKey from "interkit/components/IfUIKey.svelte";
import IfUserVar from "interkit/components/IfUserVar.svelte";
import Route from "interkit/components/Route.svelte";
import ScrollContainer from "interkit/components/ScrollContainer.svelte";
import Spacing from "interkit/components/Spacing.svelte";
import StaticText from "interkit/components/StaticText.svelte";
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
    <ScrollContainer
    >
      <Spacing
         top="s"
         right="s"
         bottom="s"
         left="s"
      >
        <Button
           text="open a url"
              size="medium"
           flex="normal"
              effect={{"effectType":"linkTargetBlank","url":"http://google.com"}}
        >
        </Button>
      </Spacing>
      <Spacing
         top="s"
         right="s"
         bottom="s"
         left="s"
      >
        <Route
           path="/"
           keepAlive={false}
        >
          <Button
             text="navigate to a route"
                size="medium"
             flex="normal"
                effect={{"effectType":"route","path":"/test"}}
          >
          </Button>
        </Route>
        <Route
           path="/test"
           keepAlive={false}
        >
          <StaticText
             text="on route /test"
          >
          </StaticText>
          <Button
             text="navigate back"
                size="medium"
             flex="normal"
                effect={{"effectType":"back"}}
          >
          </Button>
        </Route>
      </Spacing>
        <Spacing
           top="s"
           right="s"
           bottom="s"
           left="s"
        >
          <IfUIKey
             storeType="UIKey"
             key="key1"
             value="on"
          >
          <svelte:fragment slot="iftrue">
            <Button
               text="toggle UIkey"
                  size="medium"
               flex="normal"
                  effect={{"effectType":"setUIKey","value":"off","key":"key1"}}
            >
            </Button>
            <StaticText
               text="key1 is on"
            >
            </StaticText>
          </svelte:fragment>
          <svelte:fragment slot="else">
            <Button
               text="toggle UIkey"
                  size="medium"
               flex="normal"
                  effect={{"effectType":"setUIKey","value":"on","key":"key1"}}
            >
            </Button>
            <StaticText
               text="key1 is off"
            >
            </StaticText>
          </svelte:fragment>
          </IfUIKey>
        </Spacing>
        <Spacing
           top="s"
           right="s"
           bottom="s"
           left="s"
        >
          <IfUserVar
             variable="status"
             value="alive"
          >
          <svelte:fragment slot="iftrue">
            <Button
               text="set userVar status to dead"
                  size="medium"
               flex="normal"
                  effect={{"effectType":"setUserVar","value":"dead","key":"status"}}
            >
            </Button>
            <StaticText
               text="user is alive"
            >
            </StaticText>
          </svelte:fragment>
          <svelte:fragment slot="else">
            <Button
               text="set userVar status to alive"
                  size="medium"
               flex="normal"
                  effect={{"effectType":"setUserVar","value":"alive","key":"status"}}
            >
            </Button>
            <StaticText
               text="user is dead"
            >
            </StaticText>
          </svelte:fragment>
          </IfUserVar>
        </Spacing>
        <Spacing
           top="s"
           right="s"
           bottom="none"
           left="s"
        >
          <DataLoaderSingle
             sheet="elements"
             rowKey="1"
             customKeyColumn="elements/number"
          >
          </DataLoaderSingle>
        </Spacing>
      <Spacing
         top="none"
         right="s"
         bottom="s"
         left="s"
      >
        <Button
           text="trigger an action"
              size="medium"
           flex="normal"
              effect={{"effectType":"actionTrigger","trigger":"test"}}
        >
        </Button>
      </Spacing>
    </ScrollContainer>
  </AnonymousLogin>
</AppBase>

<Route
   path="/"
   keepAlive={false}
>
  <Button
     text="navigate to a route"
        size="medium"
     flex="normal"
        effect={{"effectType":"route","path":"/test"}}
  >
  </Button>
</Route>

<Route
   path="/test"
   keepAlive={false}
>
  <StaticText
     text="on route /test"
  >
  </StaticText>
  <Button
     text="navigate back"
        size="medium"
     flex="normal"
        effect={{"effectType":"back"}}
  >
  </Button>
</Route>
