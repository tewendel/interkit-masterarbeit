<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AppBase from "interkit/components/AppBase.svelte";
import Route from "interkit/components/Route.svelte";
import Spacing from "interkit/components/Spacing.svelte";
import StaticText from "interkit/components/StaticText.svelte";
import Tab from "interkit/components/Tab.svelte";
import TabBar from "interkit/components/TabBar.svelte";
import styleTokens from "./styleTokens.json";
globalThis.styleTokens = styleTokens;
console.log('AppBase styleTokens', styleTokens);
initActions();
$: $translations, translations, t, $lang, lang, console.log('AppBase i18n $', { t, $translations, translations, $lang, lang });
console.log('AppBase i18n', { t, $translations, translations, $lang, lang });
</script>

<AppBase
   >
  <TabBar
  >
    <Tab
       text="Tab One"
       effect={{"effectType":"route","path":"/"}}
       >
    </Tab>
    <Tab
       text="Tab Two"
       effect={{"effectType":"route","path":"/2"}}
       >
    </Tab>
    <Tab
       text="Tab Three"
       effect={{"effectType":"route","path":"/3"}}
       >
    </Tab>
  </TabBar>
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
      <StaticText
         text="Some content"
      >
      </StaticText>
    </Route>
    <Route
       path="/2"
       keepAlive={false}
    >
      <StaticText
         text="More content"
      >
      </StaticText>
    </Route>
    <Route
       path="/3"
       keepAlive={false}
    >
      <StaticText
         text="Even more content"
      >
      </StaticText>
    </Route>
  </Spacing>
</AppBase>

<Route
   path="/"
   keepAlive={false}
>
  <StaticText
     text="Some content"
  >
  </StaticText>
</Route>

<Route
   path="/2"
   keepAlive={false}
>
  <StaticText
     text="More content"
  >
  </StaticText>
</Route>

<Route
   path="/3"
   keepAlive={false}
>
  <StaticText
     text="Even more content"
  >
  </StaticText>
</Route>
