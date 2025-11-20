<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AppBaseAdvanced from "interkit/components/AppBaseAdvanced.svelte";
import Button from "interkit/components/Button.svelte";
import HorizontalSpacer from "interkit/components/HorizontalSpacer.svelte";
import Icon from "interkit/components/Icon.svelte";
import Image from "interkit/components/Image.svelte";
import LangSwitch from "interkit/components/LangSwitch.svelte";
import LayoutShell from "interkit/components/LayoutShell.svelte";
import NavBar from "interkit/components/NavBar.svelte";
import NavButton from "interkit/components/NavButton.svelte";
import Route from "interkit/components/Route.svelte";
import ScrollContainer from "interkit/components/ScrollContainer.svelte";
import SectionShell from "interkit/components/SectionShell.svelte";
import Spacing from "interkit/components/Spacing.svelte";
import styleTokens from "./styleTokens.json";
globalThis.styleTokens = styleTokens;
console.log('AppBase styleTokens', styleTokens);
initActions();
$: $translations, translations, t, $lang, lang, console.log('AppBase i18n $', { t, $translations, translations, $lang, lang });
console.log('AppBase i18n', { t, $translations, translations, $lang, lang });
</script>

<Route
   path="/"
   keepAlive={false}
>
  <LayoutShell
  >
  <svelte:fragment slot="TopBar">
      <HorizontalSpacer
      >
      <svelte:fragment slot="left">
        <Spacing
                    >
          <Image
                         width="100%"
                   >
          </Image>
        </Spacing>
      </svelte:fragment>
      <svelte:fragment slot="center">
      </svelte:fragment>
      <svelte:fragment slot="right">
        <LangSwitch
              reloadAfterSwitch="yes"
        >
        </LangSwitch>
        <Button
              type="secondary"
           size="small"
           flex="normal"
           disabled={false}
              effect={undefined}
        >
          <Icon
             type="Thin-Menu"
             inverse={false}
          >
          </Icon>
        </Button>
      </svelte:fragment>
      </HorizontalSpacer>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <ScrollContainer
    >
      <SectionShell
      >
        <Spacing
                    >
        </Spacing>
      </SectionShell>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
              disabled={false}
           effect={undefined}
        >
          <Icon
             type="Thin-Dashboard"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
              disabled={false}
           effect={undefined}
        >
          <Icon
             type="Thin-Layer"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
              disabled={false}
           effect={undefined}
        >
          <Icon
             type="Thin-Hint"
             inverse={false}
          >
          </Icon>
        </NavButton>
      </NavBar>
  </svelte:fragment>
  </LayoutShell>
</Route>

<AppBaseAdvanced
   languages="de,en"
      enableWebPush={false}
      desktopFallbackMinWidth="600px"
>
<svelte:fragment slot="viewport">
  <Route
     path="/"
     keepAlive={false}
  >
    <LayoutShell
    >
    <svelte:fragment slot="TopBar">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
          <Spacing
                      >
            <Image
                           width="100%"
                     >
            </Image>
          </Spacing>
        </svelte:fragment>
        <svelte:fragment slot="center">
        </svelte:fragment>
        <svelte:fragment slot="right">
          <LangSwitch
                reloadAfterSwitch="yes"
          >
          </LangSwitch>
          <Button
                type="secondary"
             size="small"
             flex="normal"
             disabled={false}
                effect={undefined}
          >
            <Icon
               type="Thin-Menu"
               inverse={false}
            >
            </Icon>
          </Button>
        </svelte:fragment>
        </HorizontalSpacer>
    </svelte:fragment>
    <svelte:fragment slot="Content">
      <ScrollContainer
      >
        <SectionShell
        >
          <Spacing
                      >
          </Spacing>
        </SectionShell>
      </ScrollContainer>
    </svelte:fragment>
    <svelte:fragment slot="BottomBar">
        <NavBar
        >
          <NavButton
                disabled={false}
             effect={undefined}
          >
            <Icon
               type="Thin-Dashboard"
               inverse={false}
            >
            </Icon>
          </NavButton>
          <NavButton
                disabled={false}
             effect={undefined}
          >
            <Icon
               type="Thin-Layer"
               inverse={false}
            >
            </Icon>
          </NavButton>
          <NavButton
                disabled={false}
             effect={undefined}
          >
            <Icon
               type="Thin-Hint"
               inverse={false}
            >
            </Icon>
          </NavButton>
        </NavBar>
    </svelte:fragment>
    </LayoutShell>
  </Route>
</svelte:fragment>
<svelte:fragment slot="desktopFallback">
</svelte:fragment>
<svelte:fragment slot="networkHint">
</svelte:fragment>
</AppBaseAdvanced>

<Route
   path="/impressum"
   keepAlive={false}
>
</Route>
