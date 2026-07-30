<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AccordeonShell from "interkit/components/AccordeonShell.svelte";
import AnonymousLogin from "interkit/components/AnonymousLogin.svelte";
import AppBaseAdvanced from "interkit/components/AppBaseAdvanced.svelte";
import AudioPlayer from "interkit/components/AudioPlayer.svelte";
import Button from "interkit/components/Button.svelte";
import ButtonBar from "interkit/components/ButtonBar.svelte";
import CenterModal from "interkit/components/CenterModal.svelte";
import ColumnShell from "interkit/components/ColumnShell.svelte";
import DataCard from "interkit/components/DataCard.svelte";
import DataCell from "interkit/components/DataCell.svelte";
import DataList from "interkit/components/DataList.svelte";
import DataLoaderMulti from "interkit/components/DataLoaderMulti.svelte";
import DataLoaderSingle from "interkit/components/DataLoaderSingle.svelte";
import DataRouteSingle from "interkit/components/DataRouteSingle.svelte";
import HorizontalSpacer from "interkit/components/HorizontalSpacer.svelte";
import Icon from "interkit/components/Icon.svelte";
import IfUIKey from "interkit/components/IfUIKey.svelte";
import Image from "interkit/components/Image.svelte";
import InlineAudioButton from "interkit/components/InlineAudioButton.svelte";
import Label from "interkit/components/Label.svelte";
import LangSwitch from "interkit/components/LangSwitch.svelte";
import LayoutShell from "interkit/components/LayoutShell.svelte";
import LayoutShellAudio from "interkit/components/LayoutShellAudio.svelte";
import ListItem from "interkit/components/ListItem.svelte";
import NavBar from "interkit/components/NavBar.svelte";
import NavButton from "interkit/components/NavButton.svelte";
import OverlayFull from "interkit/components/OverlayFull.svelte";
import PopoutAudioButton from "interkit/components/PopoutAudioButton.svelte";
import Route from "interkit/components/Route.svelte";
import ScrollContainer from "interkit/components/ScrollContainer.svelte";
import SectionShell from "interkit/components/SectionShell.svelte";
import SlideInModal from "interkit/components/SlideInModal.svelte";
import Spacing from "interkit/components/Spacing.svelte";
import StaticText from "interkit/components/StaticText.svelte";
import Tab from "interkit/components/Tab.svelte";
import TabBar from "interkit/components/TabBar.svelte";
import TextFormat from "interkit/components/TextFormat.svelte";
import WikidataEmbedPersonNew from "./components/WikidataEmbedPersonNew.svelte";
import WikidataEmbedSubjectBird from "./components/WikidataEmbedSubjectBird.svelte";
import WikidataEmbedSubjectNew from "./components/WikidataEmbedSubjectNew.svelte";
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
      <Image
         mediafileKey="08f9aa8a-aafe-4fde-9e06-f2c43b6f17b5"
                  width="50%"
               >
      </Image>
    </svelte:fragment>
    <svelte:fragment slot="center">
    </svelte:fragment>
    <svelte:fragment slot="right">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
        </svelte:fragment>
        <svelte:fragment slot="center">
        </svelte:fragment>
        <svelte:fragment slot="right">
          <ButtonBar
             justify="right"
             >
            <LangSwitch
                  reloadAfterSwitch="yes"
            >
            </LangSwitch>
            <Button
                  type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel={$lang ? ($translations[$lang] && $translations[$lang]["$menu"] ? $translations[$lang]["$menu"] : "menu") : "…"}   effect={{"effectType":"route","path":"/menu"}}
            >
              <Icon
                 type="Full-Menu"
                 inverse={false}
              >
              </Icon>
            </Button>
          </ButtonBar>
        </svelte:fragment>
        </HorizontalSpacer>
    </svelte:fragment>
    </HorizontalSpacer>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <ScrollContainer
    >
      <SectionShell
      >
        <TextFormat
           interfaceFormat="headline-3"
           contentFormat="none"
        >
          <StaticText
             text={$lang ? ($translations[$lang] && $translations[$lang]["$app_title"] ? $translations[$lang]["$app_title"] : "app_title") : ($translations.en && $translations.en["$app_title"] ? $translations.en["$app_title"] : "…")}>
          </StaticText>
        </TextFormat>
        <TextFormat
           interfaceFormat="body-1"
           contentFormat="none"
        >
          <StaticText
             text={$lang ? ($translations[$lang] && $translations[$lang]["$home_intro"] ? $translations[$lang]["$home_intro"] : "home_intro") : ($translations.en && $translations.en["$home_intro"] ? $translations.en["$home_intro"] : "…")}>
          </StaticText>
        </TextFormat>
      </SectionShell>
      <SectionShell
      >
        <CenterModal
           size="large"
           imageKey="b910238c-edf8-499e-b187-6a7cef0912a6"
           label={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_date"] ? $translations[$lang]["$exhibition_date"] : "exhibition_date") : "…"}   headline={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : "…"}   prompt={$lang ? ($translations[$lang] && $translations[$lang]["$home_exhibition_prompt"] ? $translations[$lang]["$home_exhibition_prompt"] : "home_exhibition_prompt") : "…"}   >
        <svelte:fragment slot="buttons">
          <Button
             text={$lang ? ($translations[$lang] && $translations[$lang]["$home_discover_artworks"] ? $translations[$lang]["$home_discover_artworks"] : "home_discover_artworks") : ($translations.en && $translations.en["$home_discover_artworks"] ? $translations.en["$home_discover_artworks"] : "…")}   type="secondary"
             size="medium"
             flex="fill"
             disabled={false}
                effect={{"effectType":"route","path":"/exhibition"}}
          >
          </Button>
        </svelte:fragment>
        </CenterModal>
      </SectionShell>
      <SectionShell
      >
        <CenterModal
           size="medium"
              label={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about"] ? $translations[$lang]["$nav_about"] : "nav_about") : "…"}   headline={$lang ? ($translations[$lang] && $translations[$lang]["$nav_project"] ? $translations[$lang]["$nav_project"] : "nav_project") : "…"}   prompt={$lang ? ($translations[$lang] && $translations[$lang]["$home_project_prompt"] ? $translations[$lang]["$home_project_prompt"] : "home_project_prompt") : "…"}   >
        <svelte:fragment slot="buttons">
          <Button
             text={$lang ? ($translations[$lang] && $translations[$lang]["$action_learn_more"] ? $translations[$lang]["$action_learn_more"] : "action_learn_more") : ($translations.en && $translations.en["$action_learn_more"] ? $translations.en["$action_learn_more"] : "…")}   type="secondary"
             size="medium"
             flex="fill"
             disabled={false}
                effect={{"effectType":"route","path":"/about"}}
          >
          </Button>
        </svelte:fragment>
        </CenterModal>
      </SectionShell>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShell>
</Route>

<Route
   path="/menu"
   keepAlive={false}
>
  <LayoutShell
  >
  <svelte:fragment slot="TopBar">
    <HorizontalSpacer
    >
    <svelte:fragment slot="left">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
          <Button
                type="secondary"
             size="small"
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
        </svelte:fragment>
        <svelte:fragment slot="right">
        </svelte:fragment>
        </HorizontalSpacer>
    </svelte:fragment>
    <svelte:fragment slot="center">
      <TextFormat
         interfaceFormat="caption-bold"
         contentFormat="none"
      >
        <StaticText
           text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : ($translations.en && $translations.en["$exhibition_title"] ? $translations.en["$exhibition_title"] : "…")}>
        </StaticText>
      </TextFormat>
    </svelte:fragment>
    <svelte:fragment slot="right">
    </svelte:fragment>
    </HorizontalSpacer>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <ListItem
       text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   effect={{"effectType":"route","path":"/"}}
    >
    </ListItem>
    <ListItem
       text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_help"] ? $translations[$lang]["$nav_help"] : "nav_help") : ($translations.en && $translations.en["$nav_help"] ? $translations.en["$nav_help"] : "…")}   effect={{"effectType":"route","path":"/help"}}
    >
    </ListItem>
    <ListItem
       text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about"] ? $translations[$lang]["$nav_about"] : "nav_about") : ($translations.en && $translations.en["$nav_about"] ? $translations.en["$nav_about"] : "…")}   effect={{"effectType":"route","path":"/about"}}
    >
    </ListItem>
    <ListItem
       text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_privacy"] ? $translations[$lang]["$nav_privacy"] : "nav_privacy") : ($translations.en && $translations.en["$nav_privacy"] ? $translations.en["$nav_privacy"] : "…")}   effect={{"effectType":"route","path":"/privacy"}}
    >
    </ListItem>
    <ListItem
       text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_rights"] ? $translations[$lang]["$nav_rights"] : "nav_rights") : ($translations.en && $translations.en["$nav_rights"] ? $translations.en["$nav_rights"] : "…")}   effect={{"effectType":"route","path":"/rights"}}
    >
    </ListItem>
    <ListItem
       text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_imprint"] ? $translations[$lang]["$nav_imprint"] : "nav_imprint") : ($translations.en && $translations.en["$nav_imprint"] ? $translations.en["$nav_imprint"] : "…")}   effect={{"effectType":"route","path":"/imprint"}}
    >
    </ListItem>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
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
              disabled={false}
           effect={{"effectType":"route","path":"/exhibition"}}
        >
          <Icon
             type="Thin-Layer"
             inverse={false}
          >
          </Icon>
        </NavButton>
      </NavBar>
  </svelte:fragment>
  </LayoutShell>
</Route>

<Route
   path="/imprint"
   keepAlive={false}
>
  <LayoutShell
  >
  <svelte:fragment slot="TopBar">
    <HorizontalSpacer
    >
    <svelte:fragment slot="left">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
          <Button
                type="secondary"
             size="small"
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
        </svelte:fragment>
        <svelte:fragment slot="right">
        </svelte:fragment>
        </HorizontalSpacer>
    </svelte:fragment>
    <svelte:fragment slot="center">
      <TextFormat
         interfaceFormat="caption-bold"
         contentFormat="none"
      >
        <StaticText
           text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : ($translations.en && $translations.en["$exhibition_title"] ? $translations.en["$exhibition_title"] : "…")}>
        </StaticText>
      </TextFormat>
    </svelte:fragment>
    <svelte:fragment slot="right">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
        </svelte:fragment>
        <svelte:fragment slot="center">
        </svelte:fragment>
        <svelte:fragment slot="right">
          <ButtonBar
             justify="right"
             >
            <LangSwitch
                  reloadAfterSwitch="yes"
            >
            </LangSwitch>
            <Button
                  type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel={$lang ? ($translations[$lang] && $translations[$lang]["$menu"] ? $translations[$lang]["$menu"] : "menu") : "…"}   effect={{"effectType":"route","path":"/menu"}}
            >
              <Icon
                 type="Full-Menu"
                 inverse={false}
              >
              </Icon>
            </Button>
          </ButtonBar>
        </svelte:fragment>
        </HorizontalSpacer>
    </svelte:fragment>
    </HorizontalSpacer>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <ScrollContainer
    >
      <TextFormat
         interfaceFormat="headline-2"
         contentFormat="none"
      >
        <StaticText
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_imprint"] ? $translations[$lang]["$nav_imprint"] : "nav_imprint") : ($translations.en && $translations.en["$nav_imprint"] ? $translations.en["$nav_imprint"] : "…")}>
        </StaticText>
      </TextFormat>
      <DataLoaderSingle
         sheet="c6d3fe70-03f6-46ca-9e78-7541448d9e0f"
         rowKey="00998218-291f-4856-97be-f3a6bebabee2"
         >
        <DataCell
           column={$lang ? "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/" + "menu$lang".replace("$lang", "$" + $lang) : "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/menu$lang"}   format="richText"
           centerContent={false}
        >
        </DataCell>
      </DataLoaderSingle>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
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
              disabled={false}
           effect={{"effectType":"route","path":"/exhibition"}}
        >
          <Icon
             type="Thin-Layer"
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
   appTitle="Für die Vögel – Audioguide"
   enableWebPush={false}
      desktopFallbackMinWidth="600px"
>
<svelte:fragment slot="viewport">
  <AnonymousLogin
     defaultLang="de"
     >
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
          <Image
             mediafileKey="08f9aa8a-aafe-4fde-9e06-f2c43b6f17b5"
                      width="50%"
                   >
          </Image>
        </svelte:fragment>
        <svelte:fragment slot="center">
        </svelte:fragment>
        <svelte:fragment slot="right">
            <HorizontalSpacer
            >
            <svelte:fragment slot="left">
            </svelte:fragment>
            <svelte:fragment slot="center">
            </svelte:fragment>
            <svelte:fragment slot="right">
              <ButtonBar
                 justify="right"
                 >
                <LangSwitch
                      reloadAfterSwitch="yes"
                >
                </LangSwitch>
                <Button
                      type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel={$lang ? ($translations[$lang] && $translations[$lang]["$menu"] ? $translations[$lang]["$menu"] : "menu") : "…"}   effect={{"effectType":"route","path":"/menu"}}
                >
                  <Icon
                     type="Full-Menu"
                     inverse={false}
                  >
                  </Icon>
                </Button>
              </ButtonBar>
            </svelte:fragment>
            </HorizontalSpacer>
        </svelte:fragment>
        </HorizontalSpacer>
      </svelte:fragment>
      <svelte:fragment slot="Content">
        <ScrollContainer
        >
          <SectionShell
          >
            <TextFormat
               interfaceFormat="headline-3"
               contentFormat="none"
            >
              <StaticText
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$app_title"] ? $translations[$lang]["$app_title"] : "app_title") : ($translations.en && $translations.en["$app_title"] ? $translations.en["$app_title"] : "…")}>
              </StaticText>
            </TextFormat>
            <TextFormat
               interfaceFormat="body-1"
               contentFormat="none"
            >
              <StaticText
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$home_intro"] ? $translations[$lang]["$home_intro"] : "home_intro") : ($translations.en && $translations.en["$home_intro"] ? $translations.en["$home_intro"] : "…")}>
              </StaticText>
            </TextFormat>
          </SectionShell>
          <SectionShell
          >
            <CenterModal
               size="large"
               imageKey="b910238c-edf8-499e-b187-6a7cef0912a6"
               label={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_date"] ? $translations[$lang]["$exhibition_date"] : "exhibition_date") : "…"}   headline={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : "…"}   prompt={$lang ? ($translations[$lang] && $translations[$lang]["$home_exhibition_prompt"] ? $translations[$lang]["$home_exhibition_prompt"] : "home_exhibition_prompt") : "…"}   >
            <svelte:fragment slot="buttons">
              <Button
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$home_discover_artworks"] ? $translations[$lang]["$home_discover_artworks"] : "home_discover_artworks") : ($translations.en && $translations.en["$home_discover_artworks"] ? $translations.en["$home_discover_artworks"] : "…")}   type="secondary"
                 size="medium"
                 flex="fill"
                 disabled={false}
                    effect={{"effectType":"route","path":"/exhibition"}}
              >
              </Button>
            </svelte:fragment>
            </CenterModal>
          </SectionShell>
          <SectionShell
          >
            <CenterModal
               size="medium"
                  label={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about"] ? $translations[$lang]["$nav_about"] : "nav_about") : "…"}   headline={$lang ? ($translations[$lang] && $translations[$lang]["$nav_project"] ? $translations[$lang]["$nav_project"] : "nav_project") : "…"}   prompt={$lang ? ($translations[$lang] && $translations[$lang]["$home_project_prompt"] ? $translations[$lang]["$home_project_prompt"] : "home_project_prompt") : "…"}   >
            <svelte:fragment slot="buttons">
              <Button
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$action_learn_more"] ? $translations[$lang]["$action_learn_more"] : "action_learn_more") : ($translations.en && $translations.en["$action_learn_more"] ? $translations.en["$action_learn_more"] : "…")}   type="secondary"
                 size="medium"
                 flex="fill"
                 disabled={false}
                    effect={{"effectType":"route","path":"/about"}}
              >
              </Button>
            </svelte:fragment>
            </CenterModal>
          </SectionShell>
        </ScrollContainer>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
      </svelte:fragment>
      </LayoutShell>
    </Route>
    <Route
       path="/menu"
       keepAlive={false}
    >
      <LayoutShell
      >
      <svelte:fragment slot="TopBar">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
            <HorizontalSpacer
            >
            <svelte:fragment slot="left">
              <Button
                    type="secondary"
                 size="small"
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
            </svelte:fragment>
            <svelte:fragment slot="right">
            </svelte:fragment>
            </HorizontalSpacer>
        </svelte:fragment>
        <svelte:fragment slot="center">
          <TextFormat
             interfaceFormat="caption-bold"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : ($translations.en && $translations.en["$exhibition_title"] ? $translations.en["$exhibition_title"] : "…")}>
            </StaticText>
          </TextFormat>
        </svelte:fragment>
        <svelte:fragment slot="right">
        </svelte:fragment>
        </HorizontalSpacer>
      </svelte:fragment>
      <svelte:fragment slot="Content">
        <ListItem
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   effect={{"effectType":"route","path":"/"}}
        >
        </ListItem>
        <ListItem
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_help"] ? $translations[$lang]["$nav_help"] : "nav_help") : ($translations.en && $translations.en["$nav_help"] ? $translations.en["$nav_help"] : "…")}   effect={{"effectType":"route","path":"/help"}}
        >
        </ListItem>
        <ListItem
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about"] ? $translations[$lang]["$nav_about"] : "nav_about") : ($translations.en && $translations.en["$nav_about"] ? $translations.en["$nav_about"] : "…")}   effect={{"effectType":"route","path":"/about"}}
        >
        </ListItem>
        <ListItem
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_privacy"] ? $translations[$lang]["$nav_privacy"] : "nav_privacy") : ($translations.en && $translations.en["$nav_privacy"] ? $translations.en["$nav_privacy"] : "…")}   effect={{"effectType":"route","path":"/privacy"}}
        >
        </ListItem>
        <ListItem
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_rights"] ? $translations[$lang]["$nav_rights"] : "nav_rights") : ($translations.en && $translations.en["$nav_rights"] ? $translations.en["$nav_rights"] : "…")}   effect={{"effectType":"route","path":"/rights"}}
        >
        </ListItem>
        <ListItem
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_imprint"] ? $translations[$lang]["$nav_imprint"] : "nav_imprint") : ($translations.en && $translations.en["$nav_imprint"] ? $translations.en["$nav_imprint"] : "…")}   effect={{"effectType":"route","path":"/imprint"}}
        >
        </ListItem>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
          <NavBar
          >
            <NavButton
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
                  disabled={false}
               effect={{"effectType":"route","path":"/exhibition"}}
            >
              <Icon
                 type="Thin-Layer"
                 inverse={false}
              >
              </Icon>
            </NavButton>
          </NavBar>
      </svelte:fragment>
      </LayoutShell>
    </Route>
    <Route
       path="/imprint"
       keepAlive={false}
    >
      <LayoutShell
      >
      <svelte:fragment slot="TopBar">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
            <HorizontalSpacer
            >
            <svelte:fragment slot="left">
              <Button
                    type="secondary"
                 size="small"
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
            </svelte:fragment>
            <svelte:fragment slot="right">
            </svelte:fragment>
            </HorizontalSpacer>
        </svelte:fragment>
        <svelte:fragment slot="center">
          <TextFormat
             interfaceFormat="caption-bold"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : ($translations.en && $translations.en["$exhibition_title"] ? $translations.en["$exhibition_title"] : "…")}>
            </StaticText>
          </TextFormat>
        </svelte:fragment>
        <svelte:fragment slot="right">
            <HorizontalSpacer
            >
            <svelte:fragment slot="left">
            </svelte:fragment>
            <svelte:fragment slot="center">
            </svelte:fragment>
            <svelte:fragment slot="right">
              <ButtonBar
                 justify="right"
                 >
                <LangSwitch
                      reloadAfterSwitch="yes"
                >
                </LangSwitch>
                <Button
                      type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel={$lang ? ($translations[$lang] && $translations[$lang]["$menu"] ? $translations[$lang]["$menu"] : "menu") : "…"}   effect={{"effectType":"route","path":"/menu"}}
                >
                  <Icon
                     type="Full-Menu"
                     inverse={false}
                  >
                  </Icon>
                </Button>
              </ButtonBar>
            </svelte:fragment>
            </HorizontalSpacer>
        </svelte:fragment>
        </HorizontalSpacer>
      </svelte:fragment>
      <svelte:fragment slot="Content">
        <ScrollContainer
        >
          <TextFormat
             interfaceFormat="headline-2"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_imprint"] ? $translations[$lang]["$nav_imprint"] : "nav_imprint") : ($translations.en && $translations.en["$nav_imprint"] ? $translations.en["$nav_imprint"] : "…")}>
            </StaticText>
          </TextFormat>
          <DataLoaderSingle
             sheet="c6d3fe70-03f6-46ca-9e78-7541448d9e0f"
             rowKey="00998218-291f-4856-97be-f3a6bebabee2"
             >
            <DataCell
               column={$lang ? "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/" + "menu$lang".replace("$lang", "$" + $lang) : "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/menu$lang"}   format="richText"
               centerContent={false}
            >
            </DataCell>
          </DataLoaderSingle>
        </ScrollContainer>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
          <NavBar
          >
            <NavButton
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
                  disabled={false}
               effect={{"effectType":"route","path":"/exhibition"}}
            >
              <Icon
                 type="Thin-Layer"
                 inverse={false}
              >
              </Icon>
            </NavButton>
          </NavBar>
      </svelte:fragment>
      </LayoutShell>
    </Route>
    <Route
       path="/privacy"
       keepAlive={false}
    >
      <LayoutShell
      >
      <svelte:fragment slot="TopBar">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
            <HorizontalSpacer
            >
            <svelte:fragment slot="left">
              <Button
                    type="secondary"
                 size="small"
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
            </svelte:fragment>
            <svelte:fragment slot="right">
            </svelte:fragment>
            </HorizontalSpacer>
        </svelte:fragment>
        <svelte:fragment slot="center">
          <TextFormat
             interfaceFormat="caption-bold"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : ($translations.en && $translations.en["$exhibition_title"] ? $translations.en["$exhibition_title"] : "…")}>
            </StaticText>
          </TextFormat>
        </svelte:fragment>
        <svelte:fragment slot="right">
            <HorizontalSpacer
            >
            <svelte:fragment slot="left">
            </svelte:fragment>
            <svelte:fragment slot="center">
            </svelte:fragment>
            <svelte:fragment slot="right">
              <ButtonBar
                 justify="right"
                 >
                <LangSwitch
                      reloadAfterSwitch="yes"
                >
                </LangSwitch>
                <Button
                      type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel={$lang ? ($translations[$lang] && $translations[$lang]["$menu"] ? $translations[$lang]["$menu"] : "menu") : "…"}   effect={{"effectType":"route","path":"/menu"}}
                >
                  <Icon
                     type="Full-Menu"
                     inverse={false}
                  >
                  </Icon>
                </Button>
              </ButtonBar>
            </svelte:fragment>
            </HorizontalSpacer>
        </svelte:fragment>
        </HorizontalSpacer>
      </svelte:fragment>
      <svelte:fragment slot="Content">
        <ScrollContainer
        >
          <TextFormat
             interfaceFormat="headline-2"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_privacy"] ? $translations[$lang]["$nav_privacy"] : "nav_privacy") : ($translations.en && $translations.en["$nav_privacy"] ? $translations.en["$nav_privacy"] : "…")}>
            </StaticText>
          </TextFormat>
          <DataLoaderSingle
             sheet="c6d3fe70-03f6-46ca-9e78-7541448d9e0f"
             rowKey="e19c4c01-02cf-4183-ad37-56089a4cfcf3"
             >
            <DataCell
               column={$lang ? "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/" + "menu$lang".replace("$lang", "$" + $lang) : "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/menu$lang"}   format="richText"
               centerContent={false}
            >
            </DataCell>
          </DataLoaderSingle>
        </ScrollContainer>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
          <NavBar
          >
            <NavButton
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
                  disabled={false}
               effect={{"effectType":"route","path":"/exhibition"}}
            >
              <Icon
                 type="Thin-Layer"
                 inverse={false}
              >
              </Icon>
            </NavButton>
          </NavBar>
      </svelte:fragment>
      </LayoutShell>
    </Route>
    <Route
       path="/about"
       keepAlive={false}
    >
      <LayoutShell
      >
      <svelte:fragment slot="TopBar">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
            <HorizontalSpacer
            >
            <svelte:fragment slot="left">
              <Button
                    type="secondary"
                 size="small"
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
            </svelte:fragment>
            <svelte:fragment slot="right">
            </svelte:fragment>
            </HorizontalSpacer>
        </svelte:fragment>
        <svelte:fragment slot="center">
          <TextFormat
             interfaceFormat="caption-bold"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : ($translations.en && $translations.en["$exhibition_title"] ? $translations.en["$exhibition_title"] : "…")}>
            </StaticText>
          </TextFormat>
        </svelte:fragment>
        <svelte:fragment slot="right">
            <HorizontalSpacer
            >
            <svelte:fragment slot="left">
            </svelte:fragment>
            <svelte:fragment slot="center">
            </svelte:fragment>
            <svelte:fragment slot="right">
              <ButtonBar
                 justify="right"
                 >
                <LangSwitch
                      reloadAfterSwitch="yes"
                >
                </LangSwitch>
                <Button
                      type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel={$lang ? ($translations[$lang] && $translations[$lang]["$menu"] ? $translations[$lang]["$menu"] : "menu") : "…"}   effect={{"effectType":"route","path":"/menu"}}
                >
                  <Icon
                     type="Full-Menu"
                     inverse={false}
                  >
                  </Icon>
                </Button>
              </ButtonBar>
            </svelte:fragment>
            </HorizontalSpacer>
        </svelte:fragment>
        </HorizontalSpacer>
      </svelte:fragment>
      <svelte:fragment slot="Content">
        <ScrollContainer
        >
          <TextFormat
             interfaceFormat="headline-2"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about"] ? $translations[$lang]["$nav_about"] : "nav_about") : ($translations.en && $translations.en["$nav_about"] ? $translations.en["$nav_about"] : "…")}>
            </StaticText>
          </TextFormat>
          <AccordeonShell
          >
          <svelte:fragment slot="label">
          </svelte:fragment>
          <svelte:fragment slot="content">
            <DataLoaderSingle
               sheet="c6d3fe70-03f6-46ca-9e78-7541448d9e0f"
               rowKey="ace5405f-595e-434d-92e4-c3c7ebcce5f8"
               >
              <DataCell
                 column={$lang ? "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/" + "menu$lang".replace("$lang", "$" + $lang) : "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/menu$lang"}   format="richText"
                 centerContent={false}
              >
              </DataCell>
            </DataLoaderSingle>
          </svelte:fragment>
          </AccordeonShell>
          <AccordeonShell
          >
          <svelte:fragment slot="label">
          </svelte:fragment>
          <svelte:fragment slot="content">
            <DataLoaderSingle
               sheet="c6d3fe70-03f6-46ca-9e78-7541448d9e0f"
               rowKey="ace5405f-595e-434d-92e4-c3c7ebcce5f8"
               >
              <DataCell
                 column={$lang ? "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/" + "menu$lang".replace("$lang", "$" + $lang) : "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/menu$lang"}   format="richText"
                 centerContent={false}
              >
              </DataCell>
            </DataLoaderSingle>
            <Button
               text={$lang ? ($translations[$lang] && $translations[$lang]["$project_metadata_download"] ? $translations[$lang]["$project_metadata_download"] : "project_metadata_download") : ($translations.en && $translations.en["$project_metadata_download"] ? $translations.en["$project_metadata_download"] : "…")}   type="secondary"
               size="small"
               flex="normal"
               disabled={false}
                  effect={{"effectType":"link","url":"static/exports/mgk-fuer-die-voegel-metadata-v2.csv"}}
            >
            </Button>
          </svelte:fragment>
          </AccordeonShell>
        </ScrollContainer>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
          <NavBar
          >
            <NavButton
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
                  disabled={false}
               effect={{"effectType":"route","path":"/exhibition"}}
            >
              <Icon
                 type="Thin-Layer"
                 inverse={false}
              >
              </Icon>
            </NavButton>
          </NavBar>
      </svelte:fragment>
      </LayoutShell>
    </Route>
    <Route
       path="/exhibition"
       keepAlive={false}
    >
      <LayoutShellAudio
      >
      <svelte:fragment slot="TopBar">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
            <HorizontalSpacer
            >
            <svelte:fragment slot="left">
              <Button
                    type="secondary"
                 size="small"
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
            </svelte:fragment>
            <svelte:fragment slot="right">
            </svelte:fragment>
            </HorizontalSpacer>
        </svelte:fragment>
        <svelte:fragment slot="center">
          <TextFormat
             interfaceFormat="caption-bold"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : ($translations.en && $translations.en["$exhibition_title"] ? $translations.en["$exhibition_title"] : "…")}>
            </StaticText>
          </TextFormat>
        </svelte:fragment>
        <svelte:fragment slot="right">
            <HorizontalSpacer
            >
            <svelte:fragment slot="left">
            </svelte:fragment>
            <svelte:fragment slot="center">
            </svelte:fragment>
            <svelte:fragment slot="right">
              <ButtonBar
                 justify="right"
                 >
                <LangSwitch
                      reloadAfterSwitch="yes"
                >
                </LangSwitch>
                <Button
                      type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel={$lang ? ($translations[$lang] && $translations[$lang]["$menu"] ? $translations[$lang]["$menu"] : "menu") : "…"}   effect={{"effectType":"route","path":"/menu"}}
                >
                  <Icon
                     type="Full-Menu"
                     inverse={false}
                  >
                  </Icon>
                </Button>
              </ButtonBar>
            </svelte:fragment>
            </HorizontalSpacer>
        </svelte:fragment>
        </HorizontalSpacer>
      </svelte:fragment>
      <svelte:fragment slot="Content">
        <ScrollContainer
        >
          <SectionShell
          >
            <TextFormat
               interfaceFormat="none"
               contentFormat="headline-2"
            >
              <StaticText
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_artworks_title"] ? $translations[$lang]["$exhibition_artworks_title"] : "exhibition_artworks_title") : ($translations.en && $translations.en["$exhibition_artworks_title"] ? $translations.en["$exhibition_artworks_title"] : "…")}>
              </StaticText>
            </TextFormat>
            <TextFormat
               interfaceFormat="none"
               contentFormat="body-2"
            >
              <StaticText
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_artworks_intro"] ? $translations[$lang]["$exhibition_artworks_intro"] : "exhibition_artworks_intro") : ($translations.en && $translations.en["$exhibition_artworks_intro"] ? $translations.en["$exhibition_artworks_intro"] : "…")}>
              </StaticText>
            </TextFormat>
            <AccordeonShell
            >
            <svelte:fragment slot="label">
              <Label
                 type="icon"
                 variant="normal"
                    icon="Full-More"
              >
              </Label>
              <TextFormat
                 interfaceFormat="none"
                 contentFormat="body-2"
              >
                <StaticText
                   text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_about_title"] ? $translations[$lang]["$exhibition_about_title"] : "exhibition_about_title") : ($translations.en && $translations.en["$exhibition_about_title"] ? $translations.en["$exhibition_about_title"] : "…")}>
                </StaticText>
              </TextFormat>
            </svelte:fragment>
            <svelte:fragment slot="content">
              <DataLoaderSingle
                 sheet="c6d3fe70-03f6-46ca-9e78-7541448d9e0f"
                 rowKey="019f8964-fde8-4da1-8ea5-e75315104b6b"
                 >
                <DataCell
                   column={$lang ? "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/" + "menu$lang".replace("$lang", "$" + $lang) : "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/menu$lang"}   format="richText"
                   centerContent={false}
                >
                </DataCell>
              </DataLoaderSingle>
            </svelte:fragment>
            </AccordeonShell>
          </SectionShell>
          <SectionShell
          >
            <DataLoaderMulti
               sheetKey="3d764bfb-ebf1-4e17-b756-e819c1d8794c"
               sortColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/03ea6de3-b639-414d-af4c-1cd9abf9c931"
                     excludeAnnotated="checked"
               discoverableColumn="elements/discoverable"
               discoverAnnotation="discovered"
               >
              <SectionShell
              >
                <DataList
                >
                <svelte:fragment slot="dataElement">
                  <DataCard
                     variant="small"
                     rightArrow={false}
                     effect={{"effectType":"dataRouteSingle","path":"/exhibition_artworks"}}
                     imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/100b14b4-e56e-444a-b789-d606b71c7405"
                     headlineColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}   label1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/f608ac90-fd01-47fe-9e03-c847df23e950"
                     subtitle1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "dateDisplay$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/dateDisplay$lang"}      subtitle2Column="elements/subtitle2"
                        subtitle3Column="elements/subtitle3"
                     descriptionColumn="elements/description"
                  >
                  <svelte:fragment slot="chips">
                    <PopoutAudioButton
                       audioColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "audio$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang"}   buttonOptions={{"text":"","type":"secondary","size":"small","flex":"fill"}}
                    >
                    </PopoutAudioButton>
                  </svelte:fragment>
                  <svelte:fragment slot="content">
                  </svelte:fragment>
                  </DataCard>
                </svelte:fragment>
                <svelte:fragment slot="emptyElement">
                  <StaticText
                     text={$lang ? ($translations[$lang] && $translations[$lang]["$action_data_unavailable"] ? $translations[$lang]["$action_data_unavailable"] : "action_data_unavailable") : ($translations.en && $translations.en["$action_data_unavailable"] ? $translations.en["$action_data_unavailable"] : "…")}>
                  </StaticText>
                </svelte:fragment>
                </DataList>
              </SectionShell>
            </DataLoaderMulti>
          </SectionShell>
        </ScrollContainer>
      </svelte:fragment>
      <svelte:fragment slot="Player">
        <AudioPlayer
           audioColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang"}   titleColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}>
        </AudioPlayer>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
          <NavBar
          >
            <NavButton
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
                  disabled={false}
               effect={{"effectType":"route","path":"/exhibition"}}
            >
              <Icon
                 type="Thin-Layer"
                 inverse={false}
              >
              </Icon>
            </NavButton>
          </NavBar>
      </svelte:fragment>
      </LayoutShellAudio>
    </Route>
    <DataRouteSingle
       path="/exhibition_artworks"
       sheet="3d764bfb-ebf1-4e17-b756-e819c1d8794c"
    >
      <LayoutShellAudio
      >
      <svelte:fragment slot="TopBar">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
            <HorizontalSpacer
            >
            <svelte:fragment slot="left">
              <Button
                    type="secondary"
                 size="small"
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
            </svelte:fragment>
            <svelte:fragment slot="right">
            </svelte:fragment>
            </HorizontalSpacer>
        </svelte:fragment>
        <svelte:fragment slot="center">
          <TextFormat
             interfaceFormat="caption-bold"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : ($translations.en && $translations.en["$exhibition_title"] ? $translations.en["$exhibition_title"] : "…")}>
            </StaticText>
          </TextFormat>
        </svelte:fragment>
        <svelte:fragment slot="right">
            <HorizontalSpacer
            >
            <svelte:fragment slot="left">
            </svelte:fragment>
            <svelte:fragment slot="center">
            </svelte:fragment>
            <svelte:fragment slot="right">
              <ButtonBar
                 justify="right"
                 >
                <LangSwitch
                      reloadAfterSwitch="yes"
                >
                </LangSwitch>
                <Button
                      type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel={$lang ? ($translations[$lang] && $translations[$lang]["$menu"] ? $translations[$lang]["$menu"] : "menu") : "…"}   effect={{"effectType":"route","path":"/menu"}}
                >
                  <Icon
                     type="Full-Menu"
                     inverse={false}
                  >
                  </Icon>
                </Button>
              </ButtonBar>
            </svelte:fragment>
            </HorizontalSpacer>
        </svelte:fragment>
        </HorizontalSpacer>
      </svelte:fragment>
      <svelte:fragment slot="Content">
        <ScrollContainer
        >
          <Spacing
             top="s"
             right="s"
             bottom="s"
             left="s"
          >
            <TabBar
            >
              <Tab
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$artwork_tab_guide"] ? $translations[$lang]["$artwork_tab_guide"] : "artwork_tab_guide") : ($translations.en && $translations.en["$artwork_tab_guide"] ? $translations.en["$artwork_tab_guide"] : "…")}   effect={{"effectType":"setUIKey","value":"guide","key":"mode"}}
                 execOnMount={true}
              >
              </Tab>
              <Tab
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$artwork_tab_data"] ? $translations[$lang]["$artwork_tab_data"] : "artwork_tab_data") : ($translations.en && $translations.en["$artwork_tab_data"] ? $translations.en["$artwork_tab_data"] : "…")}   effect={{"effectType":"setUIKey","value":"data","key":"mode"}}
                 >
              </Tab>
            </TabBar>
            <IfUIKey
               storeType="UIKey"
               key="mode"
               value="data"
            >
            <svelte:fragment slot="iftrue">
              <SectionShell
              >
                <Spacing
                            >
                  <DataCard
                     variant="medium"
                        effect={undefined}
                     imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/100b14b4-e56e-444a-b789-d606b71c7405"
                     headlineColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}   label1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/f608ac90-fd01-47fe-9e03-c847df23e950"
                     subtitle1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "dateDisplay$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/dateDisplay$lang"}               >
                  <svelte:fragment slot="chips">
                  </svelte:fragment>
                  <svelte:fragment slot="content">
                    <DataCell
                       column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "materialsTechniquesDisplay$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/materialsTechniquesDisplay$lang"}   format="string"
                       centerContent={false}
                    >
                    </DataCell>
                    <DataCell
                       column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "measurementsDisplay$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/measurementsDisplay$lang"}   format="string"
                       centerContent={false}
                    >
                    </DataCell>
                    <DataCell
                       column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "institution$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/institution$lang"}   format="string"
                       centerContent={false}
                    >
                    </DataCell>
                  </svelte:fragment>
                  </DataCard>
                </Spacing>
              </SectionShell>
              <SectionShell
              >
                <Spacing
                            >
                  <DataCard
                     variant="medium"
                        effect={undefined}
                                             >
                  <svelte:fragment slot="chips">
                  </svelte:fragment>
                  <svelte:fragment slot="content">
                    <TextFormat
                       interfaceFormat="none"
                       contentFormat="headline-4"
                    >
                      <StaticText
                         text={$lang ? ($translations[$lang] && $translations[$lang]["$context_title"] ? $translations[$lang]["$context_title"] : "context_title") : ($translations.en && $translations.en["$context_title"] ? $translations.en["$context_title"] : "…")}>
                      </StaticText>
                    </TextFormat>
                    <SectionShell
                    >
                      <TextFormat
                         interfaceFormat="none"
                         contentFormat="body-2"
                      >
                        <StaticText
                           text={$lang ? ($translations[$lang] && $translations[$lang]["$context_wikidata_prompt"] ? $translations[$lang]["$context_wikidata_prompt"] : "context_wikidata_prompt") : ($translations.en && $translations.en["$context_wikidata_prompt"] ? $translations.en["$context_wikidata_prompt"] : "…")}>
                        </StaticText>
                      </TextFormat>
                    </SectionShell>
                    <AccordeonShell
                    >
                    <svelte:fragment slot="label">
                      <StaticText
                         text={$lang ? ($translations[$lang] && $translations[$lang]["$context_artist_title"] ? $translations[$lang]["$context_artist_title"] : "context_artist_title") : ($translations.en && $translations.en["$context_artist_title"] ? $translations.en["$context_artist_title"] : "…")}>
                      </StaticText>
                    </svelte:fragment>
                    <svelte:fragment slot="content">
                      <WikidataEmbedPersonNew
                            personIdColumn="personID"
                      >
                      </WikidataEmbedPersonNew>
                    </svelte:fragment>
                    </AccordeonShell>
                    <AccordeonShell
                    >
                    <svelte:fragment slot="label">
                      <StaticText
                         text={$lang ? ($translations[$lang] && $translations[$lang]["$context_bird_title"] ? $translations[$lang]["$context_bird_title"] : "context_bird_title") : ($translations.en && $translations.en["$context_bird_title"] ? $translations.en["$context_bird_title"] : "…")}>
                      </StaticText>
                    </svelte:fragment>
                    <svelte:fragment slot="content">
                      <WikidataEmbedSubjectBird
                         title={$lang ? ($translations[$lang] && $translations[$lang]["$bird_context_info"] ? $translations[$lang]["$bird_context_info"] : "bird_context_info") : ($translations.en && $translations.en["$bird_context_info"] ? $translations.en["$bird_context_info"] : "…")}   subjectKeywordColumn="subjectKeyword"
                         height="40vh"
                      >
                      </WikidataEmbedSubjectBird>
                    </svelte:fragment>
                    </AccordeonShell>
                    <AccordeonShell
                    >
                    <svelte:fragment slot="label">
                      <StaticText
                         text={$lang ? ($translations[$lang] && $translations[$lang]["$context_subject_title"] ? $translations[$lang]["$context_subject_title"] : "context_subject_title") : ($translations.en && $translations.en["$context_subject_title"] ? $translations.en["$context_subject_title"] : "…")}>
                      </StaticText>
                    </svelte:fragment>
                    <svelte:fragment slot="content">
                      <WikidataEmbedSubjectNew
                         title={$lang ? ($translations[$lang] && $translations[$lang]["$context_subject_prompt"] ? $translations[$lang]["$context_subject_prompt"] : "context_subject_prompt") : ($translations.en && $translations.en["$context_subject_prompt"] ? $translations.en["$context_subject_prompt"] : "…")}   subjectKeywordColumn="subjectKeyword"
                         height="65vh"
                      >
                      </WikidataEmbedSubjectNew>
                    </svelte:fragment>
                    </AccordeonShell>
                  </svelte:fragment>
                  </DataCard>
                </Spacing>
              </SectionShell>
            </svelte:fragment>
            <svelte:fragment slot="else">
              <SectionShell
              >
                <Spacing
                   top="s"
                   right="s"
                   bottom="s"
                   left="s"
                >
                  <DataCard
                     variant="full"
                        effect={undefined}
                     imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/100b14b4-e56e-444a-b789-d606b71c7405"
                     headlineColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}   label1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/f608ac90-fd01-47fe-9e03-c847df23e950"
                     subtitle1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "dateDisplay$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/dateDisplay$lang"}               >
                  <svelte:fragment slot="chips">
                  </svelte:fragment>
                  <svelte:fragment slot="content">
                    <InlineAudioButton
                       audioColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang"}   hideSkipControls={false}
                    >
                    </InlineAudioButton>
                    <Spacing
                       top="m"
                       right="none"
                       bottom="none"
                       left="none"
                    >
                      <AccordeonShell
                      >
                      <svelte:fragment slot="label">
                        <StaticText
                           text={$lang ? ($translations[$lang] && $translations[$lang]["$artwork_transcript_title"] ? $translations[$lang]["$artwork_transcript_title"] : "artwork_transcript_title") : ($translations.en && $translations.en["$artwork_transcript_title"] ? $translations.en["$artwork_transcript_title"] : "…")}>
                        </StaticText>
                      </svelte:fragment>
                      <svelte:fragment slot="content">
                        <DataCell
                           column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectDescription$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectDescription$lang"}   format="richText"
                           centerContent={false}
                        >
                        </DataCell>
                      </svelte:fragment>
                      </AccordeonShell>
                    </Spacing>
                  </svelte:fragment>
                  </DataCard>
                  <IfUIKey
                     storeType="UIKey"
                     key="overlayImage"
                     value="1"
                  >
                  <svelte:fragment slot="iftrue">
                    <OverlayFull
                       closeEffect={{"effectType":"setUIKey","value":"0","key":"overlayImage"}}
                       >
                      <ScrollContainer
                      >
                        <Image
                                 imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/100b14b4-e56e-444a-b789-d606b71c7405"
                              width="100%"
                                 >
                        </Image>
                      </ScrollContainer>
                    </OverlayFull>
                  </svelte:fragment>
                  <svelte:fragment slot="else">
                    <IfUIKey
                       storeType="UIKey"
                       key="overlayImage"
                       value="2"
                    >
                    <svelte:fragment slot="iftrue">
                      <OverlayFull
                         closeEffect={{"effectType":"setUIKey","value":"0","key":"overlayImage"}}
                         >
                        <ScrollContainer
                        >
                          <Image
                                   imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/9e8c6ee5-4ce6-4eed-844b-c9739fb50885"
                                width="100%"
                                   >
                          </Image>
                        </ScrollContainer>
                      </OverlayFull>
                    </svelte:fragment>
                    <svelte:fragment slot="else">
                      <IfUIKey
                         storeType="UIKey"
                         key="overlayImage"
                         value="3"
                      >
                      <svelte:fragment slot="iftrue">
                        <OverlayFull
                           closeEffect={{"effectType":"setUIKey","value":"0","key":"overlayImage"}}
                           >
                          <ScrollContainer
                          >
                            <Image
                                     imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/48789c75-cff9-4a91-863f-387de78adea8"
                                  width="100%"
                                     >
                            </Image>
                          </ScrollContainer>
                        </OverlayFull>
                      </svelte:fragment>
                      <svelte:fragment slot="else">
                      </svelte:fragment>
                      </IfUIKey>
                    </svelte:fragment>
                    </IfUIKey>
                  </svelte:fragment>
                  </IfUIKey>
                  <SectionShell
                  >
                    <SlideInModal
                          headline={$lang ? ($translations[$lang] && $translations[$lang]["$artwork_gallery_title"] ? $translations[$lang]["$artwork_gallery_title"] : "artwork_gallery_title") : "…"}   prompt={$lang ? ($translations[$lang] && $translations[$lang]["$artwork_gallery_prompt"] ? $translations[$lang]["$artwork_gallery_prompt"] : "artwork_gallery_prompt") : "…"}   >
                    <svelte:fragment slot="buttons">
                      <ColumnShell
                         columns="3"
                      >
                      <svelte:fragment slot="col1">
                        <Button
                              type="link"
                           size="large"
                           flex="fill"
                           disabled={false}
                              effect={{"effectType":"setUIKey","value":"1","key":"overlayImage"}}
                        >
                          <Image
                                   imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/100b14b4-e56e-444a-b789-d606b71c7405"
                                width="100%"
                                   >
                          </Image>
                        </Button>
                      </svelte:fragment>
                      <svelte:fragment slot="col2">
                        <Button
                              type="link"
                           size="large"
                           flex="fill"
                           disabled={false}
                              effect={{"effectType":"setUIKey","value":"2","key":"overlayImage"}}
                        >
                          <Image
                                   imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/9e8c6ee5-4ce6-4eed-844b-c9739fb50885"
                                width="100%"
                                   >
                          </Image>
                        </Button>
                      </svelte:fragment>
                      <svelte:fragment slot="col3">
                        <Button
                              type="link"
                           size="large"
                           flex="fill"
                           disabled={false}
                              effect={{"effectType":"setUIKey","value":"3","key":"overlayImage"}}
                        >
                          <Image
                                   imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/48789c75-cff9-4a91-863f-387de78adea8"
                                width="100%"
                                   >
                          </Image>
                        </Button>
                      </svelte:fragment>
                      </ColumnShell>
                    </svelte:fragment>
                    </SlideInModal>
                  </SectionShell>
                </Spacing>
              </SectionShell>
            </svelte:fragment>
            </IfUIKey>
          </Spacing>
        </ScrollContainer>
      </svelte:fragment>
      <svelte:fragment slot="Player">
        <AudioPlayer
           audioColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang"}   titleColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}>
        </AudioPlayer>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
          <NavBar
          >
            <NavButton
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
                  disabled={false}
               effect={{"effectType":"route","path":"/exhibition"}}
            >
              <Icon
                 type="Thin-Layer"
                 inverse={false}
              >
              </Icon>
            </NavButton>
          </NavBar>
      </svelte:fragment>
      </LayoutShellAudio>
    </DataRouteSingle>
    <Route
       path="/help"
       keepAlive={false}
    >
      <LayoutShell
      >
      <svelte:fragment slot="TopBar">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
            <HorizontalSpacer
            >
            <svelte:fragment slot="left">
              <Button
                    type="secondary"
                 size="small"
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
            </svelte:fragment>
            <svelte:fragment slot="right">
            </svelte:fragment>
            </HorizontalSpacer>
        </svelte:fragment>
        <svelte:fragment slot="center">
          <TextFormat
             interfaceFormat="caption-bold"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : ($translations.en && $translations.en["$exhibition_title"] ? $translations.en["$exhibition_title"] : "…")}>
            </StaticText>
          </TextFormat>
        </svelte:fragment>
        <svelte:fragment slot="right">
            <HorizontalSpacer
            >
            <svelte:fragment slot="left">
            </svelte:fragment>
            <svelte:fragment slot="center">
            </svelte:fragment>
            <svelte:fragment slot="right">
              <ButtonBar
                 justify="right"
                 >
                <LangSwitch
                      reloadAfterSwitch="yes"
                >
                </LangSwitch>
                <Button
                      type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel={$lang ? ($translations[$lang] && $translations[$lang]["$menu"] ? $translations[$lang]["$menu"] : "menu") : "…"}   effect={{"effectType":"route","path":"/menu"}}
                >
                  <Icon
                     type="Full-Menu"
                     inverse={false}
                  >
                  </Icon>
                </Button>
              </ButtonBar>
            </svelte:fragment>
            </HorizontalSpacer>
        </svelte:fragment>
        </HorizontalSpacer>
      </svelte:fragment>
      <svelte:fragment slot="Content">
        <ScrollContainer
        >
          <TextFormat
             interfaceFormat="headline-2"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_help"] ? $translations[$lang]["$nav_help"] : "nav_help") : ($translations.en && $translations.en["$nav_help"] ? $translations.en["$nav_help"] : "…")}>
            </StaticText>
          </TextFormat>
          <DataLoaderSingle
             sheet="c6d3fe70-03f6-46ca-9e78-7541448d9e0f"
             rowKey="d8b9ddc4-e99b-4e96-ace7-90efbdf6be95"
             >
            <DataCell
               column={$lang ? "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/" + "menu$lang".replace("$lang", "$" + $lang) : "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/menu$lang"}   format="richText"
               centerContent={false}
            >
            </DataCell>
          </DataLoaderSingle>
        </ScrollContainer>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
          <NavBar
          >
            <NavButton
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
                  disabled={false}
               effect={{"effectType":"route","path":"/exhibition"}}
            >
              <Icon
                 type="Thin-Layer"
                 inverse={false}
              >
              </Icon>
            </NavButton>
          </NavBar>
      </svelte:fragment>
      </LayoutShell>
    </Route>
    <Route
       path="/rights"
       keepAlive={false}
    >
      <LayoutShell
      >
      <svelte:fragment slot="TopBar">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
            <HorizontalSpacer
            >
            <svelte:fragment slot="left">
              <Button
                    type="secondary"
                 size="small"
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
            </svelte:fragment>
            <svelte:fragment slot="right">
            </svelte:fragment>
            </HorizontalSpacer>
        </svelte:fragment>
        <svelte:fragment slot="center">
          <TextFormat
             interfaceFormat="caption-bold"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : ($translations.en && $translations.en["$exhibition_title"] ? $translations.en["$exhibition_title"] : "…")}>
            </StaticText>
          </TextFormat>
        </svelte:fragment>
        <svelte:fragment slot="right">
            <HorizontalSpacer
            >
            <svelte:fragment slot="left">
            </svelte:fragment>
            <svelte:fragment slot="center">
            </svelte:fragment>
            <svelte:fragment slot="right">
              <ButtonBar
                 justify="right"
                 >
                <LangSwitch
                      reloadAfterSwitch="yes"
                >
                </LangSwitch>
                <Button
                      type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel={$lang ? ($translations[$lang] && $translations[$lang]["$menu"] ? $translations[$lang]["$menu"] : "menu") : "…"}   effect={{"effectType":"route","path":"/menu"}}
                >
                  <Icon
                     type="Full-Menu"
                     inverse={false}
                  >
                  </Icon>
                </Button>
              </ButtonBar>
            </svelte:fragment>
            </HorizontalSpacer>
        </svelte:fragment>
        </HorizontalSpacer>
      </svelte:fragment>
      <svelte:fragment slot="Content">
        <ScrollContainer
        >
          <TextFormat
             interfaceFormat="headline-2"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_rights"] ? $translations[$lang]["$nav_rights"] : "nav_rights") : ($translations.en && $translations.en["$nav_rights"] ? $translations.en["$nav_rights"] : "…")}>
            </StaticText>
          </TextFormat>
          <DataLoaderMulti
             sheetKey="3d764bfb-ebf1-4e17-b756-e819c1d8794c"
                         discoverableColumn="elements/discoverable"
             discoverAnnotation="discovered"
             >
            <DataList
            >
            <svelte:fragment slot="dataElement">
              <DataCard
                 variant="small"
                    effect={undefined}
                 imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/100b14b4-e56e-444a-b789-d606b71c7405"
                 headlineColumn="elements/headline"
                 label1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}   subtitle1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/dcd2ce58-c690-451c-af6d-4f2c342f519d"
                    subtitle2Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/1737ab8e-82ae-4845-8904-9c2b6a3daf19"
                       descriptionColumn="elements/description"
              >
              <svelte:fragment slot="chips">
              </svelte:fragment>
              <svelte:fragment slot="content">
              </svelte:fragment>
              </DataCard>
            </svelte:fragment>
            <svelte:fragment slot="emptyElement">
            </svelte:fragment>
            </DataList>
            <DataList
            >
            <svelte:fragment slot="dataElement">
              <DataCard
                 variant="small"
                    effect={undefined}
                 imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/9e8c6ee5-4ce6-4eed-844b-c9739fb50885"
                 headlineColumn="elements/headline"
                 label1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}   subtitle1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/1a597e8d-1c77-43d7-bf22-0a924ecd128a"
                    subtitle2Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/1737ab8e-82ae-4845-8904-9c2b6a3daf19"
                       descriptionColumn="elements/description"
              >
              <svelte:fragment slot="chips">
              </svelte:fragment>
              <svelte:fragment slot="content">
              </svelte:fragment>
              </DataCard>
            </svelte:fragment>
            <svelte:fragment slot="emptyElement">
            </svelte:fragment>
            </DataList>
            <DataList
            >
            <svelte:fragment slot="dataElement">
              <DataCard
                 variant="small"
                    effect={undefined}
                 imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/48789c75-cff9-4a91-863f-387de78adea8"
                 headlineColumn="elements/headline"
                 label1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}   subtitle1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/e08e4dcb-da3f-46f2-a197-31ac53f6fde8"
                    subtitle2Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/16022cd3-f675-467d-bfc0-aa35cb50417e"
                       descriptionColumn="elements/description"
              >
              <svelte:fragment slot="chips">
              </svelte:fragment>
              <svelte:fragment slot="content">
              </svelte:fragment>
              </DataCard>
            </svelte:fragment>
            <svelte:fragment slot="emptyElement">
              <StaticText
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$action_data_unavailable"] ? $translations[$lang]["$action_data_unavailable"] : "action_data_unavailable") : ($translations.en && $translations.en["$action_data_unavailable"] ? $translations.en["$action_data_unavailable"] : "…")}>
              </StaticText>
            </svelte:fragment>
            </DataList>
          </DataLoaderMulti>
        </ScrollContainer>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
          <NavBar
          >
            <NavButton
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
                  disabled={false}
               effect={{"effectType":"route","path":"/exhibition"}}
            >
              <Icon
                 type="Thin-Layer"
                 inverse={false}
              >
              </Icon>
            </NavButton>
          </NavBar>
      </svelte:fragment>
      </LayoutShell>
    </Route>
  </AnonymousLogin>
</svelte:fragment>
<svelte:fragment slot="desktopFallback">
</svelte:fragment>
<svelte:fragment slot="networkHint">
</svelte:fragment>
</AppBaseAdvanced>

<Route
   path="/privacy"
   keepAlive={false}
>
  <LayoutShell
  >
  <svelte:fragment slot="TopBar">
    <HorizontalSpacer
    >
    <svelte:fragment slot="left">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
          <Button
                type="secondary"
             size="small"
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
        </svelte:fragment>
        <svelte:fragment slot="right">
        </svelte:fragment>
        </HorizontalSpacer>
    </svelte:fragment>
    <svelte:fragment slot="center">
      <TextFormat
         interfaceFormat="caption-bold"
         contentFormat="none"
      >
        <StaticText
           text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : ($translations.en && $translations.en["$exhibition_title"] ? $translations.en["$exhibition_title"] : "…")}>
        </StaticText>
      </TextFormat>
    </svelte:fragment>
    <svelte:fragment slot="right">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
        </svelte:fragment>
        <svelte:fragment slot="center">
        </svelte:fragment>
        <svelte:fragment slot="right">
          <ButtonBar
             justify="right"
             >
            <LangSwitch
                  reloadAfterSwitch="yes"
            >
            </LangSwitch>
            <Button
                  type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel={$lang ? ($translations[$lang] && $translations[$lang]["$menu"] ? $translations[$lang]["$menu"] : "menu") : "…"}   effect={{"effectType":"route","path":"/menu"}}
            >
              <Icon
                 type="Full-Menu"
                 inverse={false}
              >
              </Icon>
            </Button>
          </ButtonBar>
        </svelte:fragment>
        </HorizontalSpacer>
    </svelte:fragment>
    </HorizontalSpacer>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <ScrollContainer
    >
      <TextFormat
         interfaceFormat="headline-2"
         contentFormat="none"
      >
        <StaticText
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_privacy"] ? $translations[$lang]["$nav_privacy"] : "nav_privacy") : ($translations.en && $translations.en["$nav_privacy"] ? $translations.en["$nav_privacy"] : "…")}>
        </StaticText>
      </TextFormat>
      <DataLoaderSingle
         sheet="c6d3fe70-03f6-46ca-9e78-7541448d9e0f"
         rowKey="e19c4c01-02cf-4183-ad37-56089a4cfcf3"
         >
        <DataCell
           column={$lang ? "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/" + "menu$lang".replace("$lang", "$" + $lang) : "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/menu$lang"}   format="richText"
           centerContent={false}
        >
        </DataCell>
      </DataLoaderSingle>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
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
              disabled={false}
           effect={{"effectType":"route","path":"/exhibition"}}
        >
          <Icon
             type="Thin-Layer"
             inverse={false}
          >
          </Icon>
        </NavButton>
      </NavBar>
  </svelte:fragment>
  </LayoutShell>
</Route>

<DataRouteSingle
   path="/exhibition_artworks"
   sheet="3d764bfb-ebf1-4e17-b756-e819c1d8794c"
>
  <LayoutShellAudio
  >
  <svelte:fragment slot="TopBar">
    <HorizontalSpacer
    >
    <svelte:fragment slot="left">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
          <Button
                type="secondary"
             size="small"
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
        </svelte:fragment>
        <svelte:fragment slot="right">
        </svelte:fragment>
        </HorizontalSpacer>
    </svelte:fragment>
    <svelte:fragment slot="center">
      <TextFormat
         interfaceFormat="caption-bold"
         contentFormat="none"
      >
        <StaticText
           text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : ($translations.en && $translations.en["$exhibition_title"] ? $translations.en["$exhibition_title"] : "…")}>
        </StaticText>
      </TextFormat>
    </svelte:fragment>
    <svelte:fragment slot="right">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
        </svelte:fragment>
        <svelte:fragment slot="center">
        </svelte:fragment>
        <svelte:fragment slot="right">
          <ButtonBar
             justify="right"
             >
            <LangSwitch
                  reloadAfterSwitch="yes"
            >
            </LangSwitch>
            <Button
                  type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel={$lang ? ($translations[$lang] && $translations[$lang]["$menu"] ? $translations[$lang]["$menu"] : "menu") : "…"}   effect={{"effectType":"route","path":"/menu"}}
            >
              <Icon
                 type="Full-Menu"
                 inverse={false}
              >
              </Icon>
            </Button>
          </ButtonBar>
        </svelte:fragment>
        </HorizontalSpacer>
    </svelte:fragment>
    </HorizontalSpacer>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <ScrollContainer
    >
      <Spacing
         top="s"
         right="s"
         bottom="s"
         left="s"
      >
        <TabBar
        >
          <Tab
             text={$lang ? ($translations[$lang] && $translations[$lang]["$artwork_tab_guide"] ? $translations[$lang]["$artwork_tab_guide"] : "artwork_tab_guide") : ($translations.en && $translations.en["$artwork_tab_guide"] ? $translations.en["$artwork_tab_guide"] : "…")}   effect={{"effectType":"setUIKey","value":"guide","key":"mode"}}
             execOnMount={true}
          >
          </Tab>
          <Tab
             text={$lang ? ($translations[$lang] && $translations[$lang]["$artwork_tab_data"] ? $translations[$lang]["$artwork_tab_data"] : "artwork_tab_data") : ($translations.en && $translations.en["$artwork_tab_data"] ? $translations.en["$artwork_tab_data"] : "…")}   effect={{"effectType":"setUIKey","value":"data","key":"mode"}}
             >
          </Tab>
        </TabBar>
        <IfUIKey
           storeType="UIKey"
           key="mode"
           value="data"
        >
        <svelte:fragment slot="iftrue">
          <SectionShell
          >
            <Spacing
                        >
              <DataCard
                 variant="medium"
                    effect={undefined}
                 imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/100b14b4-e56e-444a-b789-d606b71c7405"
                 headlineColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}   label1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/f608ac90-fd01-47fe-9e03-c847df23e950"
                 subtitle1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "dateDisplay$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/dateDisplay$lang"}               >
              <svelte:fragment slot="chips">
              </svelte:fragment>
              <svelte:fragment slot="content">
                <DataCell
                   column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "materialsTechniquesDisplay$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/materialsTechniquesDisplay$lang"}   format="string"
                   centerContent={false}
                >
                </DataCell>
                <DataCell
                   column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "measurementsDisplay$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/measurementsDisplay$lang"}   format="string"
                   centerContent={false}
                >
                </DataCell>
                <DataCell
                   column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "institution$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/institution$lang"}   format="string"
                   centerContent={false}
                >
                </DataCell>
              </svelte:fragment>
              </DataCard>
            </Spacing>
          </SectionShell>
          <SectionShell
          >
            <Spacing
                        >
              <DataCard
                 variant="medium"
                    effect={undefined}
                                         >
              <svelte:fragment slot="chips">
              </svelte:fragment>
              <svelte:fragment slot="content">
                <TextFormat
                   interfaceFormat="none"
                   contentFormat="headline-4"
                >
                  <StaticText
                     text={$lang ? ($translations[$lang] && $translations[$lang]["$context_title"] ? $translations[$lang]["$context_title"] : "context_title") : ($translations.en && $translations.en["$context_title"] ? $translations.en["$context_title"] : "…")}>
                  </StaticText>
                </TextFormat>
                <SectionShell
                >
                  <TextFormat
                     interfaceFormat="none"
                     contentFormat="body-2"
                  >
                    <StaticText
                       text={$lang ? ($translations[$lang] && $translations[$lang]["$context_wikidata_prompt"] ? $translations[$lang]["$context_wikidata_prompt"] : "context_wikidata_prompt") : ($translations.en && $translations.en["$context_wikidata_prompt"] ? $translations.en["$context_wikidata_prompt"] : "…")}>
                    </StaticText>
                  </TextFormat>
                </SectionShell>
                <AccordeonShell
                >
                <svelte:fragment slot="label">
                  <StaticText
                     text={$lang ? ($translations[$lang] && $translations[$lang]["$context_artist_title"] ? $translations[$lang]["$context_artist_title"] : "context_artist_title") : ($translations.en && $translations.en["$context_artist_title"] ? $translations.en["$context_artist_title"] : "…")}>
                  </StaticText>
                </svelte:fragment>
                <svelte:fragment slot="content">
                  <WikidataEmbedPersonNew
                        personIdColumn="personID"
                  >
                  </WikidataEmbedPersonNew>
                </svelte:fragment>
                </AccordeonShell>
                <AccordeonShell
                >
                <svelte:fragment slot="label">
                  <StaticText
                     text={$lang ? ($translations[$lang] && $translations[$lang]["$context_bird_title"] ? $translations[$lang]["$context_bird_title"] : "context_bird_title") : ($translations.en && $translations.en["$context_bird_title"] ? $translations.en["$context_bird_title"] : "…")}>
                  </StaticText>
                </svelte:fragment>
                <svelte:fragment slot="content">
                  <WikidataEmbedSubjectBird
                     title={$lang ? ($translations[$lang] && $translations[$lang]["$bird_context_info"] ? $translations[$lang]["$bird_context_info"] : "bird_context_info") : ($translations.en && $translations.en["$bird_context_info"] ? $translations.en["$bird_context_info"] : "…")}   subjectKeywordColumn="subjectKeyword"
                     height="40vh"
                  >
                  </WikidataEmbedSubjectBird>
                </svelte:fragment>
                </AccordeonShell>
                <AccordeonShell
                >
                <svelte:fragment slot="label">
                  <StaticText
                     text={$lang ? ($translations[$lang] && $translations[$lang]["$context_subject_title"] ? $translations[$lang]["$context_subject_title"] : "context_subject_title") : ($translations.en && $translations.en["$context_subject_title"] ? $translations.en["$context_subject_title"] : "…")}>
                  </StaticText>
                </svelte:fragment>
                <svelte:fragment slot="content">
                  <WikidataEmbedSubjectNew
                     title={$lang ? ($translations[$lang] && $translations[$lang]["$context_subject_prompt"] ? $translations[$lang]["$context_subject_prompt"] : "context_subject_prompt") : ($translations.en && $translations.en["$context_subject_prompt"] ? $translations.en["$context_subject_prompt"] : "…")}   subjectKeywordColumn="subjectKeyword"
                     height="65vh"
                  >
                  </WikidataEmbedSubjectNew>
                </svelte:fragment>
                </AccordeonShell>
              </svelte:fragment>
              </DataCard>
            </Spacing>
          </SectionShell>
        </svelte:fragment>
        <svelte:fragment slot="else">
          <SectionShell
          >
            <Spacing
               top="s"
               right="s"
               bottom="s"
               left="s"
            >
              <DataCard
                 variant="full"
                    effect={undefined}
                 imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/100b14b4-e56e-444a-b789-d606b71c7405"
                 headlineColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}   label1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/f608ac90-fd01-47fe-9e03-c847df23e950"
                 subtitle1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "dateDisplay$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/dateDisplay$lang"}               >
              <svelte:fragment slot="chips">
              </svelte:fragment>
              <svelte:fragment slot="content">
                <InlineAudioButton
                   audioColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang"}   hideSkipControls={false}
                >
                </InlineAudioButton>
                <Spacing
                   top="m"
                   right="none"
                   bottom="none"
                   left="none"
                >
                  <AccordeonShell
                  >
                  <svelte:fragment slot="label">
                    <StaticText
                       text={$lang ? ($translations[$lang] && $translations[$lang]["$artwork_transcript_title"] ? $translations[$lang]["$artwork_transcript_title"] : "artwork_transcript_title") : ($translations.en && $translations.en["$artwork_transcript_title"] ? $translations.en["$artwork_transcript_title"] : "…")}>
                    </StaticText>
                  </svelte:fragment>
                  <svelte:fragment slot="content">
                    <DataCell
                       column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectDescription$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectDescription$lang"}   format="richText"
                       centerContent={false}
                    >
                    </DataCell>
                  </svelte:fragment>
                  </AccordeonShell>
                </Spacing>
              </svelte:fragment>
              </DataCard>
              <IfUIKey
                 storeType="UIKey"
                 key="overlayImage"
                 value="1"
              >
              <svelte:fragment slot="iftrue">
                <OverlayFull
                   closeEffect={{"effectType":"setUIKey","value":"0","key":"overlayImage"}}
                   >
                  <ScrollContainer
                  >
                    <Image
                             imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/100b14b4-e56e-444a-b789-d606b71c7405"
                          width="100%"
                             >
                    </Image>
                  </ScrollContainer>
                </OverlayFull>
              </svelte:fragment>
              <svelte:fragment slot="else">
                <IfUIKey
                   storeType="UIKey"
                   key="overlayImage"
                   value="2"
                >
                <svelte:fragment slot="iftrue">
                  <OverlayFull
                     closeEffect={{"effectType":"setUIKey","value":"0","key":"overlayImage"}}
                     >
                    <ScrollContainer
                    >
                      <Image
                               imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/9e8c6ee5-4ce6-4eed-844b-c9739fb50885"
                            width="100%"
                               >
                      </Image>
                    </ScrollContainer>
                  </OverlayFull>
                </svelte:fragment>
                <svelte:fragment slot="else">
                  <IfUIKey
                     storeType="UIKey"
                     key="overlayImage"
                     value="3"
                  >
                  <svelte:fragment slot="iftrue">
                    <OverlayFull
                       closeEffect={{"effectType":"setUIKey","value":"0","key":"overlayImage"}}
                       >
                      <ScrollContainer
                      >
                        <Image
                                 imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/48789c75-cff9-4a91-863f-387de78adea8"
                              width="100%"
                                 >
                        </Image>
                      </ScrollContainer>
                    </OverlayFull>
                  </svelte:fragment>
                  <svelte:fragment slot="else">
                  </svelte:fragment>
                  </IfUIKey>
                </svelte:fragment>
                </IfUIKey>
              </svelte:fragment>
              </IfUIKey>
              <SectionShell
              >
                <SlideInModal
                      headline={$lang ? ($translations[$lang] && $translations[$lang]["$artwork_gallery_title"] ? $translations[$lang]["$artwork_gallery_title"] : "artwork_gallery_title") : "…"}   prompt={$lang ? ($translations[$lang] && $translations[$lang]["$artwork_gallery_prompt"] ? $translations[$lang]["$artwork_gallery_prompt"] : "artwork_gallery_prompt") : "…"}   >
                <svelte:fragment slot="buttons">
                  <ColumnShell
                     columns="3"
                  >
                  <svelte:fragment slot="col1">
                    <Button
                          type="link"
                       size="large"
                       flex="fill"
                       disabled={false}
                          effect={{"effectType":"setUIKey","value":"1","key":"overlayImage"}}
                    >
                      <Image
                               imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/100b14b4-e56e-444a-b789-d606b71c7405"
                            width="100%"
                               >
                      </Image>
                    </Button>
                  </svelte:fragment>
                  <svelte:fragment slot="col2">
                    <Button
                          type="link"
                       size="large"
                       flex="fill"
                       disabled={false}
                          effect={{"effectType":"setUIKey","value":"2","key":"overlayImage"}}
                    >
                      <Image
                               imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/9e8c6ee5-4ce6-4eed-844b-c9739fb50885"
                            width="100%"
                               >
                      </Image>
                    </Button>
                  </svelte:fragment>
                  <svelte:fragment slot="col3">
                    <Button
                          type="link"
                       size="large"
                       flex="fill"
                       disabled={false}
                          effect={{"effectType":"setUIKey","value":"3","key":"overlayImage"}}
                    >
                      <Image
                               imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/48789c75-cff9-4a91-863f-387de78adea8"
                            width="100%"
                               >
                      </Image>
                    </Button>
                  </svelte:fragment>
                  </ColumnShell>
                </svelte:fragment>
                </SlideInModal>
              </SectionShell>
            </Spacing>
          </SectionShell>
        </svelte:fragment>
        </IfUIKey>
      </Spacing>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="Player">
    <AudioPlayer
       audioColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang"}   titleColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}>
    </AudioPlayer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
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
              disabled={false}
           effect={{"effectType":"route","path":"/exhibition"}}
        >
          <Icon
             type="Thin-Layer"
             inverse={false}
          >
          </Icon>
        </NavButton>
      </NavBar>
  </svelte:fragment>
  </LayoutShellAudio>
</DataRouteSingle>

<Route
   path="/exhibition"
   keepAlive={false}
>
  <LayoutShellAudio
  >
  <svelte:fragment slot="TopBar">
    <HorizontalSpacer
    >
    <svelte:fragment slot="left">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
          <Button
                type="secondary"
             size="small"
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
        </svelte:fragment>
        <svelte:fragment slot="right">
        </svelte:fragment>
        </HorizontalSpacer>
    </svelte:fragment>
    <svelte:fragment slot="center">
      <TextFormat
         interfaceFormat="caption-bold"
         contentFormat="none"
      >
        <StaticText
           text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : ($translations.en && $translations.en["$exhibition_title"] ? $translations.en["$exhibition_title"] : "…")}>
        </StaticText>
      </TextFormat>
    </svelte:fragment>
    <svelte:fragment slot="right">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
        </svelte:fragment>
        <svelte:fragment slot="center">
        </svelte:fragment>
        <svelte:fragment slot="right">
          <ButtonBar
             justify="right"
             >
            <LangSwitch
                  reloadAfterSwitch="yes"
            >
            </LangSwitch>
            <Button
                  type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel={$lang ? ($translations[$lang] && $translations[$lang]["$menu"] ? $translations[$lang]["$menu"] : "menu") : "…"}   effect={{"effectType":"route","path":"/menu"}}
            >
              <Icon
                 type="Full-Menu"
                 inverse={false}
              >
              </Icon>
            </Button>
          </ButtonBar>
        </svelte:fragment>
        </HorizontalSpacer>
    </svelte:fragment>
    </HorizontalSpacer>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <ScrollContainer
    >
      <SectionShell
      >
        <TextFormat
           interfaceFormat="none"
           contentFormat="headline-2"
        >
          <StaticText
             text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_artworks_title"] ? $translations[$lang]["$exhibition_artworks_title"] : "exhibition_artworks_title") : ($translations.en && $translations.en["$exhibition_artworks_title"] ? $translations.en["$exhibition_artworks_title"] : "…")}>
          </StaticText>
        </TextFormat>
        <TextFormat
           interfaceFormat="none"
           contentFormat="body-2"
        >
          <StaticText
             text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_artworks_intro"] ? $translations[$lang]["$exhibition_artworks_intro"] : "exhibition_artworks_intro") : ($translations.en && $translations.en["$exhibition_artworks_intro"] ? $translations.en["$exhibition_artworks_intro"] : "…")}>
          </StaticText>
        </TextFormat>
        <AccordeonShell
        >
        <svelte:fragment slot="label">
          <Label
             type="icon"
             variant="normal"
                icon="Full-More"
          >
          </Label>
          <TextFormat
             interfaceFormat="none"
             contentFormat="body-2"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_about_title"] ? $translations[$lang]["$exhibition_about_title"] : "exhibition_about_title") : ($translations.en && $translations.en["$exhibition_about_title"] ? $translations.en["$exhibition_about_title"] : "…")}>
            </StaticText>
          </TextFormat>
        </svelte:fragment>
        <svelte:fragment slot="content">
          <DataLoaderSingle
             sheet="c6d3fe70-03f6-46ca-9e78-7541448d9e0f"
             rowKey="019f8964-fde8-4da1-8ea5-e75315104b6b"
             >
            <DataCell
               column={$lang ? "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/" + "menu$lang".replace("$lang", "$" + $lang) : "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/menu$lang"}   format="richText"
               centerContent={false}
            >
            </DataCell>
          </DataLoaderSingle>
        </svelte:fragment>
        </AccordeonShell>
      </SectionShell>
      <SectionShell
      >
        <DataLoaderMulti
           sheetKey="3d764bfb-ebf1-4e17-b756-e819c1d8794c"
           sortColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/03ea6de3-b639-414d-af4c-1cd9abf9c931"
                 excludeAnnotated="checked"
           discoverableColumn="elements/discoverable"
           discoverAnnotation="discovered"
           >
          <SectionShell
          >
            <DataList
            >
            <svelte:fragment slot="dataElement">
              <DataCard
                 variant="small"
                 rightArrow={false}
                 effect={{"effectType":"dataRouteSingle","path":"/exhibition_artworks"}}
                 imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/100b14b4-e56e-444a-b789-d606b71c7405"
                 headlineColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}   label1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/f608ac90-fd01-47fe-9e03-c847df23e950"
                 subtitle1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "dateDisplay$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/dateDisplay$lang"}      subtitle2Column="elements/subtitle2"
                    subtitle3Column="elements/subtitle3"
                 descriptionColumn="elements/description"
              >
              <svelte:fragment slot="chips">
                <PopoutAudioButton
                   audioColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "audio$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang"}   buttonOptions={{"text":"","type":"secondary","size":"small","flex":"fill"}}
                >
                </PopoutAudioButton>
              </svelte:fragment>
              <svelte:fragment slot="content">
              </svelte:fragment>
              </DataCard>
            </svelte:fragment>
            <svelte:fragment slot="emptyElement">
              <StaticText
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$action_data_unavailable"] ? $translations[$lang]["$action_data_unavailable"] : "action_data_unavailable") : ($translations.en && $translations.en["$action_data_unavailable"] ? $translations.en["$action_data_unavailable"] : "…")}>
              </StaticText>
            </svelte:fragment>
            </DataList>
          </SectionShell>
        </DataLoaderMulti>
      </SectionShell>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="Player">
    <AudioPlayer
       audioColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang"}   titleColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}>
    </AudioPlayer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
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
              disabled={false}
           effect={{"effectType":"route","path":"/exhibition"}}
        >
          <Icon
             type="Thin-Layer"
             inverse={false}
          >
          </Icon>
        </NavButton>
      </NavBar>
  </svelte:fragment>
  </LayoutShellAudio>
</Route>

<Route
   path="/help"
   keepAlive={false}
>
  <LayoutShell
  >
  <svelte:fragment slot="TopBar">
    <HorizontalSpacer
    >
    <svelte:fragment slot="left">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
          <Button
                type="secondary"
             size="small"
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
        </svelte:fragment>
        <svelte:fragment slot="right">
        </svelte:fragment>
        </HorizontalSpacer>
    </svelte:fragment>
    <svelte:fragment slot="center">
      <TextFormat
         interfaceFormat="caption-bold"
         contentFormat="none"
      >
        <StaticText
           text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : ($translations.en && $translations.en["$exhibition_title"] ? $translations.en["$exhibition_title"] : "…")}>
        </StaticText>
      </TextFormat>
    </svelte:fragment>
    <svelte:fragment slot="right">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
        </svelte:fragment>
        <svelte:fragment slot="center">
        </svelte:fragment>
        <svelte:fragment slot="right">
          <ButtonBar
             justify="right"
             >
            <LangSwitch
                  reloadAfterSwitch="yes"
            >
            </LangSwitch>
            <Button
                  type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel={$lang ? ($translations[$lang] && $translations[$lang]["$menu"] ? $translations[$lang]["$menu"] : "menu") : "…"}   effect={{"effectType":"route","path":"/menu"}}
            >
              <Icon
                 type="Full-Menu"
                 inverse={false}
              >
              </Icon>
            </Button>
          </ButtonBar>
        </svelte:fragment>
        </HorizontalSpacer>
    </svelte:fragment>
    </HorizontalSpacer>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <ScrollContainer
    >
      <TextFormat
         interfaceFormat="headline-2"
         contentFormat="none"
      >
        <StaticText
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_help"] ? $translations[$lang]["$nav_help"] : "nav_help") : ($translations.en && $translations.en["$nav_help"] ? $translations.en["$nav_help"] : "…")}>
        </StaticText>
      </TextFormat>
      <DataLoaderSingle
         sheet="c6d3fe70-03f6-46ca-9e78-7541448d9e0f"
         rowKey="d8b9ddc4-e99b-4e96-ace7-90efbdf6be95"
         >
        <DataCell
           column={$lang ? "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/" + "menu$lang".replace("$lang", "$" + $lang) : "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/menu$lang"}   format="richText"
           centerContent={false}
        >
        </DataCell>
      </DataLoaderSingle>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
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
              disabled={false}
           effect={{"effectType":"route","path":"/exhibition"}}
        >
          <Icon
             type="Thin-Layer"
             inverse={false}
          >
          </Icon>
        </NavButton>
      </NavBar>
  </svelte:fragment>
  </LayoutShell>
</Route>

<Route
   path="/about"
   keepAlive={false}
>
  <LayoutShell
  >
  <svelte:fragment slot="TopBar">
    <HorizontalSpacer
    >
    <svelte:fragment slot="left">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
          <Button
                type="secondary"
             size="small"
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
        </svelte:fragment>
        <svelte:fragment slot="right">
        </svelte:fragment>
        </HorizontalSpacer>
    </svelte:fragment>
    <svelte:fragment slot="center">
      <TextFormat
         interfaceFormat="caption-bold"
         contentFormat="none"
      >
        <StaticText
           text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : ($translations.en && $translations.en["$exhibition_title"] ? $translations.en["$exhibition_title"] : "…")}>
        </StaticText>
      </TextFormat>
    </svelte:fragment>
    <svelte:fragment slot="right">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
        </svelte:fragment>
        <svelte:fragment slot="center">
        </svelte:fragment>
        <svelte:fragment slot="right">
          <ButtonBar
             justify="right"
             >
            <LangSwitch
                  reloadAfterSwitch="yes"
            >
            </LangSwitch>
            <Button
                  type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel={$lang ? ($translations[$lang] && $translations[$lang]["$menu"] ? $translations[$lang]["$menu"] : "menu") : "…"}   effect={{"effectType":"route","path":"/menu"}}
            >
              <Icon
                 type="Full-Menu"
                 inverse={false}
              >
              </Icon>
            </Button>
          </ButtonBar>
        </svelte:fragment>
        </HorizontalSpacer>
    </svelte:fragment>
    </HorizontalSpacer>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <ScrollContainer
    >
      <TextFormat
         interfaceFormat="headline-2"
         contentFormat="none"
      >
        <StaticText
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about"] ? $translations[$lang]["$nav_about"] : "nav_about") : ($translations.en && $translations.en["$nav_about"] ? $translations.en["$nav_about"] : "…")}>
        </StaticText>
      </TextFormat>
      <AccordeonShell
      >
      <svelte:fragment slot="label">
      </svelte:fragment>
      <svelte:fragment slot="content">
        <DataLoaderSingle
           sheet="c6d3fe70-03f6-46ca-9e78-7541448d9e0f"
           rowKey="ace5405f-595e-434d-92e4-c3c7ebcce5f8"
           >
          <DataCell
             column={$lang ? "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/" + "menu$lang".replace("$lang", "$" + $lang) : "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/menu$lang"}   format="richText"
             centerContent={false}
          >
          </DataCell>
        </DataLoaderSingle>
      </svelte:fragment>
      </AccordeonShell>
      <AccordeonShell
      >
      <svelte:fragment slot="label">
      </svelte:fragment>
      <svelte:fragment slot="content">
        <DataLoaderSingle
           sheet="c6d3fe70-03f6-46ca-9e78-7541448d9e0f"
           rowKey="ace5405f-595e-434d-92e4-c3c7ebcce5f8"
           >
          <DataCell
             column={$lang ? "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/" + "menu$lang".replace("$lang", "$" + $lang) : "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/menu$lang"}   format="richText"
             centerContent={false}
          >
          </DataCell>
        </DataLoaderSingle>
        <Button
           text={$lang ? ($translations[$lang] && $translations[$lang]["$project_metadata_download"] ? $translations[$lang]["$project_metadata_download"] : "project_metadata_download") : ($translations.en && $translations.en["$project_metadata_download"] ? $translations.en["$project_metadata_download"] : "…")}   type="secondary"
           size="small"
           flex="normal"
           disabled={false}
              effect={{"effectType":"link","url":"static/exports/mgk-fuer-die-voegel-metadata-v2.csv"}}
        >
        </Button>
      </svelte:fragment>
      </AccordeonShell>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
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
              disabled={false}
           effect={{"effectType":"route","path":"/exhibition"}}
        >
          <Icon
             type="Thin-Layer"
             inverse={false}
          >
          </Icon>
        </NavButton>
      </NavBar>
  </svelte:fragment>
  </LayoutShell>
</Route>

<Route
   path="/rights"
   keepAlive={false}
>
  <LayoutShell
  >
  <svelte:fragment slot="TopBar">
    <HorizontalSpacer
    >
    <svelte:fragment slot="left">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
          <Button
                type="secondary"
             size="small"
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
        </svelte:fragment>
        <svelte:fragment slot="right">
        </svelte:fragment>
        </HorizontalSpacer>
    </svelte:fragment>
    <svelte:fragment slot="center">
      <TextFormat
         interfaceFormat="caption-bold"
         contentFormat="none"
      >
        <StaticText
           text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : ($translations.en && $translations.en["$exhibition_title"] ? $translations.en["$exhibition_title"] : "…")}>
        </StaticText>
      </TextFormat>
    </svelte:fragment>
    <svelte:fragment slot="right">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
        </svelte:fragment>
        <svelte:fragment slot="center">
        </svelte:fragment>
        <svelte:fragment slot="right">
          <ButtonBar
             justify="right"
             >
            <LangSwitch
                  reloadAfterSwitch="yes"
            >
            </LangSwitch>
            <Button
                  type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel={$lang ? ($translations[$lang] && $translations[$lang]["$menu"] ? $translations[$lang]["$menu"] : "menu") : "…"}   effect={{"effectType":"route","path":"/menu"}}
            >
              <Icon
                 type="Full-Menu"
                 inverse={false}
              >
              </Icon>
            </Button>
          </ButtonBar>
        </svelte:fragment>
        </HorizontalSpacer>
    </svelte:fragment>
    </HorizontalSpacer>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <ScrollContainer
    >
      <TextFormat
         interfaceFormat="headline-2"
         contentFormat="none"
      >
        <StaticText
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_rights"] ? $translations[$lang]["$nav_rights"] : "nav_rights") : ($translations.en && $translations.en["$nav_rights"] ? $translations.en["$nav_rights"] : "…")}>
        </StaticText>
      </TextFormat>
      <DataLoaderMulti
         sheetKey="3d764bfb-ebf1-4e17-b756-e819c1d8794c"
                     discoverableColumn="elements/discoverable"
         discoverAnnotation="discovered"
         >
        <DataList
        >
        <svelte:fragment slot="dataElement">
          <DataCard
             variant="small"
                effect={undefined}
             imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/100b14b4-e56e-444a-b789-d606b71c7405"
             headlineColumn="elements/headline"
             label1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}   subtitle1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/dcd2ce58-c690-451c-af6d-4f2c342f519d"
                subtitle2Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/1737ab8e-82ae-4845-8904-9c2b6a3daf19"
                   descriptionColumn="elements/description"
          >
          <svelte:fragment slot="chips">
          </svelte:fragment>
          <svelte:fragment slot="content">
          </svelte:fragment>
          </DataCard>
        </svelte:fragment>
        <svelte:fragment slot="emptyElement">
        </svelte:fragment>
        </DataList>
        <DataList
        >
        <svelte:fragment slot="dataElement">
          <DataCard
             variant="small"
                effect={undefined}
             imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/9e8c6ee5-4ce6-4eed-844b-c9739fb50885"
             headlineColumn="elements/headline"
             label1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}   subtitle1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/1a597e8d-1c77-43d7-bf22-0a924ecd128a"
                subtitle2Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/1737ab8e-82ae-4845-8904-9c2b6a3daf19"
                   descriptionColumn="elements/description"
          >
          <svelte:fragment slot="chips">
          </svelte:fragment>
          <svelte:fragment slot="content">
          </svelte:fragment>
          </DataCard>
        </svelte:fragment>
        <svelte:fragment slot="emptyElement">
        </svelte:fragment>
        </DataList>
        <DataList
        >
        <svelte:fragment slot="dataElement">
          <DataCard
             variant="small"
                effect={undefined}
             imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/48789c75-cff9-4a91-863f-387de78adea8"
             headlineColumn="elements/headline"
             label1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}   subtitle1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/e08e4dcb-da3f-46f2-a197-31ac53f6fde8"
                subtitle2Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/16022cd3-f675-467d-bfc0-aa35cb50417e"
                   descriptionColumn="elements/description"
          >
          <svelte:fragment slot="chips">
          </svelte:fragment>
          <svelte:fragment slot="content">
          </svelte:fragment>
          </DataCard>
        </svelte:fragment>
        <svelte:fragment slot="emptyElement">
          <StaticText
             text={$lang ? ($translations[$lang] && $translations[$lang]["$action_data_unavailable"] ? $translations[$lang]["$action_data_unavailable"] : "action_data_unavailable") : ($translations.en && $translations.en["$action_data_unavailable"] ? $translations.en["$action_data_unavailable"] : "…")}>
          </StaticText>
        </svelte:fragment>
        </DataList>
      </DataLoaderMulti>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
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
              disabled={false}
           effect={{"effectType":"route","path":"/exhibition"}}
        >
          <Icon
             type="Thin-Layer"
             inverse={false}
          >
          </Icon>
        </NavButton>
      </NavBar>
  </svelte:fragment>
  </LayoutShell>
</Route>
