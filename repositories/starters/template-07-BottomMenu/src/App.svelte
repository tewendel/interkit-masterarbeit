<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AppBase from "interkit/components/AppBase.svelte";
import BottomBarShell from "interkit/components/BottomBarShell.svelte";
import Icon from "interkit/components/Icon.svelte";
import NavBar from "interkit/components/NavBar.svelte";
import NavButton from "interkit/components/NavButton.svelte";
import Route from "interkit/components/Route.svelte";
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
  <BottomBarShell
  >
  <svelte:fragment slot="Content">
    <Route
       path="/"
       keepAlive={false}
    >
      <Spacing
         top="m"
         right="m"
         bottom="m"
         left="m"
      >
        <StaticText
           text="home screen"
        >
        </StaticText>
      </Spacing>
    </Route>
    <Route
       path="/something"
       keepAlive={false}
    >
      <Spacing
         top="m"
         right="m"
         bottom="m"
         left="m"
      >
        <StaticText
           text="something else"
        >
        </StaticText>
      </Spacing>
    </Route>
    <Route
       path="/other"
       keepAlive={false}
    >
      <Spacing
         top="m"
         right="m"
         bottom="m"
         left="m"
      >
        <StaticText
           text="another screen"
        >
        </StaticText>
      </Spacing>
    </Route>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
           text="home"
           disabled={false}
           effect={{"effectType":"route","path":"/"}}
        >
          <Icon
             type="Thin-Dashboard"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text="something"
           disabled={false}
           effect={{"effectType":"route","path":"/something"}}
        >
          <Icon
             type="Thin-Archiv"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text="other"
           disabled={false}
           effect={{"effectType":"route","path":"/other"}}
        >
          <Icon
             type="Thin-Map"
             inverse={false}
          >
          </Icon>
        </NavButton>
      </NavBar>
  </svelte:fragment>
  </BottomBarShell>
</AppBase>

<Route
   path="/"
   keepAlive={false}
>
  <Spacing
     top="m"
     right="m"
     bottom="m"
     left="m"
  >
    <StaticText
       text="home screen"
    >
    </StaticText>
  </Spacing>
</Route>

<Route
   path="/something"
   keepAlive={false}
>
  <Spacing
     top="m"
     right="m"
     bottom="m"
     left="m"
  >
    <StaticText
       text="something else"
    >
    </StaticText>
  </Spacing>
</Route>

<Route
   path="/other"
   keepAlive={false}
>
  <Spacing
     top="m"
     right="m"
     bottom="m"
     left="m"
  >
    <StaticText
       text="another screen"
    >
    </StaticText>
  </Spacing>
</Route>
