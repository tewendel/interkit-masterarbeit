<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AppBase from "interkit/components/AppBase.svelte";
import Button from "interkit/components/Button.svelte";
import HorizontalSpacer from "interkit/components/HorizontalSpacer.svelte";
import Icon from "interkit/components/Icon.svelte";
import ListItem from "interkit/components/ListItem.svelte";
import Route from "interkit/components/Route.svelte";
import Spacing from "interkit/components/Spacing.svelte";
import StaticText from "interkit/components/StaticText.svelte";
import TextFormat from "interkit/components/TextFormat.svelte";
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
  <Route
     path="/"
     keepAlive={false}
  >
    <TopBarShell
    >
    <svelte:fragment slot="TopBar">
      <HorizontalSpacer
      >
      <svelte:fragment slot="left">
      </svelte:fragment>
      <svelte:fragment slot="center">
      </svelte:fragment>
      <svelte:fragment slot="right">
        <Button
              type="link"
           size="medium"
           flex="normal"
           disabled={false}
           effect={{"effectType":"route","path":"/settings"}}
        >
          <Icon
             type="Full-Menu"
             inverse={false}
          >
          </Icon>
        </Button>
      </svelte:fragment>
      </HorizontalSpacer>
    </svelte:fragment>
    <svelte:fragment slot="Content">
      <Spacing
         top="m"
               left="m"
      >
        <StaticText
           text="Home"
        >
        </StaticText>
      </Spacing>
    </svelte:fragment>
    </TopBarShell>
  </Route>
  <Route
     path="/settings"
     keepAlive={false}
  >
    <TopBarShell
    >
    <svelte:fragment slot="TopBar">
      <HorizontalSpacer
      >
      <svelte:fragment slot="left">
          <Button
                type="link"
             size="medium"
             flex="normal"
             disabled={false}
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
        <TextFormat
           interfaceFormat="headline-4"
           contentFormat="none"
        >
          <StaticText
             text="Settings"
          >
          </StaticText>
        </TextFormat>
      </svelte:fragment>
      <svelte:fragment slot="right">
      </svelte:fragment>
      </HorizontalSpacer>
    </svelte:fragment>
    <svelte:fragment slot="Content">
      <ListItem
         text="About"
         effect={{"effectType":"route","path":"/about"}}
      >
        <Icon
           type="Thin-Arrow-Right"
           inverse={false}
        >
        </Icon>
      </ListItem>
      <ListItem
         text="Privacy"
         effect={{"effectType":"route","path":"/privacy"}}
      >
        <Icon
           type="Thin-Arrow-Right"
           inverse={false}
        >
        </Icon>
      </ListItem>
    </svelte:fragment>
    </TopBarShell>
  </Route>
  <Route
     path="/about"
     keepAlive={false}
  >
    <TopBarShell
    >
    <svelte:fragment slot="TopBar">
      <HorizontalSpacer
      >
      <svelte:fragment slot="left">
          <Button
                type="link"
             size="medium"
             flex="normal"
             disabled={false}
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
        <TextFormat
           interfaceFormat="headline-4"
           contentFormat="none"
        >
          <StaticText
             text="About"
          >
          </StaticText>
        </TextFormat>
      </svelte:fragment>
      <svelte:fragment slot="right">
      </svelte:fragment>
      </HorizontalSpacer>
    </svelte:fragment>
    <svelte:fragment slot="Content">
    </svelte:fragment>
    </TopBarShell>
  </Route>
  <Route
     path="/privacy"
     keepAlive={false}
  >
    <TopBarShell
    >
    <svelte:fragment slot="TopBar">
      <HorizontalSpacer
      >
      <svelte:fragment slot="left">
          <Button
                type="link"
             size="medium"
             flex="normal"
             disabled={false}
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
        <TextFormat
           interfaceFormat="headline-4"
           contentFormat="none"
        >
          <StaticText
             text="Privacy"
          >
          </StaticText>
        </TextFormat>
      </svelte:fragment>
      <svelte:fragment slot="right">
      </svelte:fragment>
      </HorizontalSpacer>
    </svelte:fragment>
    <svelte:fragment slot="Content">
    </svelte:fragment>
    </TopBarShell>
  </Route>
</AppBase>

<Route
   path="/"
   keepAlive={false}
>
  <TopBarShell
  >
  <svelte:fragment slot="TopBar">
    <HorizontalSpacer
    >
    <svelte:fragment slot="left">
    </svelte:fragment>
    <svelte:fragment slot="center">
    </svelte:fragment>
    <svelte:fragment slot="right">
      <Button
            type="link"
         size="medium"
         flex="normal"
         disabled={false}
         effect={{"effectType":"route","path":"/settings"}}
      >
        <Icon
           type="Full-Menu"
           inverse={false}
        >
        </Icon>
      </Button>
    </svelte:fragment>
    </HorizontalSpacer>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <Spacing
       top="m"
             left="m"
    >
      <StaticText
         text="Home"
      >
      </StaticText>
    </Spacing>
  </svelte:fragment>
  </TopBarShell>
</Route>

<Route
   path="/settings"
   keepAlive={false}
>
  <TopBarShell
  >
  <svelte:fragment slot="TopBar">
    <HorizontalSpacer
    >
    <svelte:fragment slot="left">
        <Button
              type="link"
           size="medium"
           flex="normal"
           disabled={false}
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
      <TextFormat
         interfaceFormat="headline-4"
         contentFormat="none"
      >
        <StaticText
           text="Settings"
        >
        </StaticText>
      </TextFormat>
    </svelte:fragment>
    <svelte:fragment slot="right">
    </svelte:fragment>
    </HorizontalSpacer>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <ListItem
       text="About"
       effect={{"effectType":"route","path":"/about"}}
    >
      <Icon
         type="Thin-Arrow-Right"
         inverse={false}
      >
      </Icon>
    </ListItem>
    <ListItem
       text="Privacy"
       effect={{"effectType":"route","path":"/privacy"}}
    >
      <Icon
         type="Thin-Arrow-Right"
         inverse={false}
      >
      </Icon>
    </ListItem>
  </svelte:fragment>
  </TopBarShell>
</Route>

<Route
   path="/about"
   keepAlive={false}
>
  <TopBarShell
  >
  <svelte:fragment slot="TopBar">
    <HorizontalSpacer
    >
    <svelte:fragment slot="left">
        <Button
              type="link"
           size="medium"
           flex="normal"
           disabled={false}
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
      <TextFormat
         interfaceFormat="headline-4"
         contentFormat="none"
      >
        <StaticText
           text="About"
        >
        </StaticText>
      </TextFormat>
    </svelte:fragment>
    <svelte:fragment slot="right">
    </svelte:fragment>
    </HorizontalSpacer>
  </svelte:fragment>
  <svelte:fragment slot="Content">
  </svelte:fragment>
  </TopBarShell>
</Route>

<Route
   path="/privacy"
   keepAlive={false}
>
  <TopBarShell
  >
  <svelte:fragment slot="TopBar">
    <HorizontalSpacer
    >
    <svelte:fragment slot="left">
        <Button
              type="link"
           size="medium"
           flex="normal"
           disabled={false}
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
      <TextFormat
         interfaceFormat="headline-4"
         contentFormat="none"
      >
        <StaticText
           text="Privacy"
        >
        </StaticText>
      </TextFormat>
    </svelte:fragment>
    <svelte:fragment slot="right">
    </svelte:fragment>
    </HorizontalSpacer>
  </svelte:fragment>
  <svelte:fragment slot="Content">
  </svelte:fragment>
  </TopBarShell>
</Route>
