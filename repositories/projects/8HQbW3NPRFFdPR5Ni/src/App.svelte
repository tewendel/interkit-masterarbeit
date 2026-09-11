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
import LangSwitch from "interkit/components/LangSwitch.svelte";
import LayoutShell from "interkit/components/LayoutShell.svelte";
import LayoutShellAudio from "interkit/components/LayoutShellAudio.svelte";
import ListItem from "interkit/components/ListItem.svelte";
import MetadataDownload from "./components/MetadataDownload.svelte";
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
import Styling from "interkit/components/Styling.svelte";
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
         mediafileKey="031a15d2-f7b8-48d0-8c0e-ed26b7ffda58"
                  width="20%"
         height="20%"
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
                  reloadAfterSwitch="no"
            >
            </LangSwitch>
            <Button
                  type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel="Navigation menu"
               effect={{"effectType":"route","path":"/menu"}}
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
             ariaLabel="Discover artworks"
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
             ariaLabel="Learn more"
             effect={{"effectType":"route","path":"/about_project"}}
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
             ariaLabel="Back"
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
       text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_imprint"] ? $translations[$lang]["$nav_imprint"] : "nav_imprint") : ($translations.en && $translations.en["$nav_imprint"] ? $translations.en["$nav_imprint"] : "…")}   effect={{"effectType":"route","path":"/imprint"}}
    >
    </ListItem>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   disabled={false}
           effect={{"effectType":"route","path":"/"}}
        >
          <Icon
             type="Thin-Dashboard"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   disabled={false}
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
             ariaLabel="Back"
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
                  reloadAfterSwitch="no"
            >
            </LangSwitch>
            <Button
                  type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel="Navigation menu"
               effect={{"effectType":"route","path":"/menu"}}
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
    <LayoutShell
    >
    <svelte:fragment slot="TopBar">
      <TextFormat
         interfaceFormat="headline-2"
         contentFormat="none"
      >
        <StaticText
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_imprint"] ? $translations[$lang]["$nav_imprint"] : "nav_imprint") : ($translations.en && $translations.en["$nav_imprint"] ? $translations.en["$nav_imprint"] : "…")}>
        </StaticText>
      </TextFormat>
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
        </Spacing>
      </ScrollContainer>
    </svelte:fragment>
    <svelte:fragment slot="BottomBar">
    </svelte:fragment>
    </LayoutShell>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   disabled={false}
           effect={{"effectType":"route","path":"/"}}
        >
          <Icon
             type="Thin-Dashboard"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   disabled={false}
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
     defaultLang="en"
     defaultLangIndex="0"
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
             mediafileKey="031a15d2-f7b8-48d0-8c0e-ed26b7ffda58"
                      width="20%"
             height="20%"
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
                      reloadAfterSwitch="no"
                >
                </LangSwitch>
                <Button
                      type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel="Navigation menu"
                   effect={{"effectType":"route","path":"/menu"}}
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
                 ariaLabel="Discover artworks"
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
                 ariaLabel="Learn more"
                 effect={{"effectType":"route","path":"/about_project"}}
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
                 ariaLabel="Back"
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
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_imprint"] ? $translations[$lang]["$nav_imprint"] : "nav_imprint") : ($translations.en && $translations.en["$nav_imprint"] ? $translations.en["$nav_imprint"] : "…")}   effect={{"effectType":"route","path":"/imprint"}}
        >
        </ListItem>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
          <NavBar
          >
            <NavButton
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   disabled={false}
               effect={{"effectType":"route","path":"/"}}
            >
              <Icon
                 type="Thin-Dashboard"
                 inverse={false}
              >
              </Icon>
            </NavButton>
            <NavButton
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   disabled={false}
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
                 ariaLabel="Back"
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
                      reloadAfterSwitch="no"
                >
                </LangSwitch>
                <Button
                      type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel="Navigation menu"
                   effect={{"effectType":"route","path":"/menu"}}
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
        <LayoutShell
        >
        <svelte:fragment slot="TopBar">
          <TextFormat
             interfaceFormat="headline-2"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_imprint"] ? $translations[$lang]["$nav_imprint"] : "nav_imprint") : ($translations.en && $translations.en["$nav_imprint"] ? $translations.en["$nav_imprint"] : "…")}>
            </StaticText>
          </TextFormat>
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
            </Spacing>
          </ScrollContainer>
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
        </svelte:fragment>
        </LayoutShell>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
          <NavBar
          >
            <NavButton
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   disabled={false}
               effect={{"effectType":"route","path":"/"}}
            >
              <Icon
                 type="Thin-Dashboard"
                 inverse={false}
              >
              </Icon>
            </NavButton>
            <NavButton
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   disabled={false}
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
                 ariaLabel="Back"
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
                      reloadAfterSwitch="no"
                >
                </LangSwitch>
                <Button
                      type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel="Navigation menu"
                   effect={{"effectType":"route","path":"/menu"}}
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
        <LayoutShell
        >
        <svelte:fragment slot="TopBar">
          <TextFormat
             interfaceFormat="headline-2"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_privacy"] ? $translations[$lang]["$nav_privacy"] : "nav_privacy") : ($translations.en && $translations.en["$nav_privacy"] ? $translations.en["$nav_privacy"] : "…")}>
            </StaticText>
          </TextFormat>
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
              <Spacing
                 top="s"
                       >
                <Button
                   text="Google Fonts"
                   type="secondary"
                   size="medium"
                   flex="normal"
                   disabled={false}
                   ariaLabel="Link Google Fonts"
                   effect={{"effectType":"linkTargetBlank","url":"https://fonts.google.com/faq#privacy"}}
                >
                </Button>
              </Spacing>
            </Spacing>
          </ScrollContainer>
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
        </svelte:fragment>
        </LayoutShell>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
          <NavBar
          >
            <NavButton
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   disabled={false}
               effect={{"effectType":"route","path":"/"}}
            >
              <Icon
                 type="Thin-Dashboard"
                 inverse={false}
              >
              </Icon>
            </NavButton>
            <NavButton
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   disabled={false}
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
                 ariaLabel="Back"
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
                      reloadAfterSwitch="no"
                >
                </LangSwitch>
                <Button
                      type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel="Navigation menu"
                   effect={{"effectType":"route","path":"/menu"}}
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
        <LayoutShell
        >
        <svelte:fragment slot="TopBar">
          <TextFormat
             interfaceFormat="headline-2"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_help"] ? $translations[$lang]["$nav_help"] : "nav_help") : ($translations.en && $translations.en["$nav_help"] ? $translations.en["$nav_help"] : "…")}>
            </StaticText>
          </TextFormat>
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
            </Spacing>
          </ScrollContainer>
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
        </svelte:fragment>
        </LayoutShell>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
          <NavBar
          >
            <NavButton
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   disabled={false}
               effect={{"effectType":"route","path":"/"}}
            >
              <Icon
                 type="Thin-Dashboard"
                 inverse={false}
              >
              </Icon>
            </NavButton>
            <NavButton
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   disabled={false}
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
                 ariaLabel="Back"
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
                      reloadAfterSwitch="no"
                >
                </LangSwitch>
                <Button
                      type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel="Navigation menu"
                   effect={{"effectType":"route","path":"/menu"}}
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
          <LayoutShell
          >
          <svelte:fragment slot="TopBar">
            <TextFormat
               interfaceFormat="headline-2"
               contentFormat="none"
            >
              <StaticText
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about"] ? $translations[$lang]["$nav_about"] : "nav_about") : ($translations.en && $translations.en["$nav_about"] ? $translations.en["$nav_about"] : "…")}>
              </StaticText>
            </TextFormat>
          </svelte:fragment>
          <svelte:fragment slot="Content">
            <TabBar
            >
              <Tab
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_project"] ? $translations[$lang]["$nav_about_project"] : "nav_about_project") : ($translations.en && $translations.en["$nav_about_project"] ? $translations.en["$nav_about_project"] : "…")}   effect={{"effectType":"route","path":"/about_project"}}
                 execOnMount={true}
              >
              </Tab>
              <Tab
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   effect={{"effectType":"route","path":"/about_exhibition"}}
                 execOnMount={false}
              >
              </Tab>
              <Tab
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_data"] ? $translations[$lang]["$nav_about_data"] : "nav_about_data") : ($translations.en && $translations.en["$nav_about_data"] ? $translations.en["$nav_about_data"] : "…")}   effect={{"effectType":"route","path":"/about_data"}}
                 >
              </Tab>
            </TabBar>
          </svelte:fragment>
          <svelte:fragment slot="BottomBar">
          </svelte:fragment>
          </LayoutShell>
        </ScrollContainer>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
          <NavBar
          >
            <NavButton
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   disabled={false}
               effect={{"effectType":"route","path":"/"}}
            >
              <Icon
                 type="Thin-Dashboard"
                 inverse={false}
              >
              </Icon>
            </NavButton>
            <NavButton
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   disabled={false}
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
       path="/about_project"
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
                 ariaLabel="Back"
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
                      reloadAfterSwitch="no"
                >
                </LangSwitch>
                <Button
                      type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel="Navigation menu"
                   effect={{"effectType":"route","path":"/menu"}}
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
        <LayoutShell
        >
        <svelte:fragment slot="TopBar">
          <TextFormat
             interfaceFormat="headline-2"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about"] ? $translations[$lang]["$nav_about"] : "nav_about") : ($translations.en && $translations.en["$nav_about"] ? $translations.en["$nav_about"] : "…")}>
            </StaticText>
          </TextFormat>
        </svelte:fragment>
        <svelte:fragment slot="Content">
          <ScrollContainer
          >
            <TabBar
            >
              <Tab
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_project"] ? $translations[$lang]["$nav_about_project"] : "nav_about_project") : ($translations.en && $translations.en["$nav_about_project"] ? $translations.en["$nav_about_project"] : "…")}   effect={{"effectType":"route","path":"/about_project"}}
                 execOnMount={true}
              >
              </Tab>
              <Tab
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   effect={{"effectType":"route","path":"/about_exhibition"}}
                 execOnMount={false}
              >
              </Tab>
              <Tab
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_data"] ? $translations[$lang]["$nav_about_data"] : "nav_about_data") : ($translations.en && $translations.en["$nav_about_data"] ? $translations.en["$nav_about_data"] : "…")}   effect={{"effectType":"route","path":"/about_data"}}
                 >
              </Tab>
            </TabBar>
            <Spacing
               top="m"
               right="s"
               bottom="s"
               left="s"
            >
              <TextFormat
                 interfaceFormat="none"
                 contentFormat="headline-2"
              >
                <StaticText
                   text={$lang ? ($translations[$lang] && $translations[$lang]["$about_project"] ? $translations[$lang]["$about_project"] : "about_project") : ($translations.en && $translations.en["$about_project"] ? $translations.en["$about_project"] : "…")}>
                </StaticText>
              </TextFormat>
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
            </Spacing>
            <Spacing
               top="s"
               right="s"
               bottom="m"
               left="s"
            >
              <ButtonBar
                 justify="center"
                 >
                <Button
                   text="Interkit"
                   type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel="Link interkit.app"
                   effect={{"effectType":"linkTargetBlank","url":"https://www.interkit.app/"}}
                >
                </Button>
                <Button
                   text="Minimaldatensatz"
                   type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel="Link Minimaldatensatz-Empfehlung"
                   effect={{"effectType":"linkTargetBlank","url":"https://www.smb.museum/museen-einrichtungen/institut-fuer-museumsforschung/forschung/forschungsprojekte/minimaldatensatz/"}}
                >
                </Button>
                <Button
                   text="MGKSiegen"
                   type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel="Link MGK Siegen"
                   effect={{"effectType":"linkTargetBlank","url":"https://www.mgksiegen.de/de/"}}
                >
                </Button>
              </ButtonBar>
            </Spacing>
          </ScrollContainer>
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
        </svelte:fragment>
        </LayoutShell>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
          <NavBar
          >
            <NavButton
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   disabled={false}
               effect={{"effectType":"route","path":"/"}}
            >
              <Icon
                 type="Thin-Dashboard"
                 inverse={false}
              >
              </Icon>
            </NavButton>
            <NavButton
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   disabled={false}
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
       path="/about_exhibition"
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
                 ariaLabel="Back"
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
                      reloadAfterSwitch="no"
                >
                </LangSwitch>
                <Button
                      type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel="Navigation menu"
                   effect={{"effectType":"route","path":"/menu"}}
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
        <LayoutShell
        >
        <svelte:fragment slot="TopBar">
          <TextFormat
             interfaceFormat="headline-2"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about"] ? $translations[$lang]["$nav_about"] : "nav_about") : ($translations.en && $translations.en["$nav_about"] ? $translations.en["$nav_about"] : "…")}>
            </StaticText>
          </TextFormat>
        </svelte:fragment>
        <svelte:fragment slot="Content">
          <ScrollContainer
          >
            <TabBar
            >
              <Tab
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_project"] ? $translations[$lang]["$nav_about_project"] : "nav_about_project") : ($translations.en && $translations.en["$nav_about_project"] ? $translations.en["$nav_about_project"] : "…")}   effect={{"effectType":"route","path":"/about_project"}}
                 >
              </Tab>
              <Tab
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   effect={{"effectType":"route","path":"/about_exhibition"}}
                 execOnMount={true}
              >
              </Tab>
              <Tab
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_data"] ? $translations[$lang]["$nav_about_data"] : "nav_about_data") : ($translations.en && $translations.en["$nav_about_data"] ? $translations.en["$nav_about_data"] : "…")}   effect={{"effectType":"route","path":"/about_data"}}
                 >
              </Tab>
            </TabBar>
            <Spacing
               top="m"
               right="s"
               bottom="s"
               left="s"
            >
              <TextFormat
                 interfaceFormat="none"
                 contentFormat="headline-2"
              >
                <StaticText
                   text={$lang ? ($translations[$lang] && $translations[$lang]["$about_exhibition"] ? $translations[$lang]["$about_exhibition"] : "about_exhibition") : ($translations.en && $translations.en["$about_exhibition"] ? $translations.en["$about_exhibition"] : "…")}>
                </StaticText>
              </TextFormat>
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
            </Spacing>
          </ScrollContainer>
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
        </svelte:fragment>
        </LayoutShell>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
          <NavBar
          >
            <NavButton
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   disabled={false}
               effect={{"effectType":"route","path":"/"}}
            >
              <Icon
                 type="Thin-Dashboard"
                 inverse={false}
              >
              </Icon>
            </NavButton>
            <NavButton
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   disabled={false}
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
       path="/about_data"
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
                 ariaLabel="Back"
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
                      reloadAfterSwitch="no"
                >
                </LangSwitch>
                <Button
                      type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel="Navigation menu"
                   effect={{"effectType":"route","path":"/menu"}}
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
        <LayoutShell
        >
        <svelte:fragment slot="TopBar">
          <TextFormat
             interfaceFormat="headline-2"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about"] ? $translations[$lang]["$nav_about"] : "nav_about") : ($translations.en && $translations.en["$nav_about"] ? $translations.en["$nav_about"] : "…")}>
            </StaticText>
          </TextFormat>
        </svelte:fragment>
        <svelte:fragment slot="Content">
          <ScrollContainer
          >
            <TabBar
            >
              <Tab
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_project"] ? $translations[$lang]["$nav_about_project"] : "nav_about_project") : ($translations.en && $translations.en["$nav_about_project"] ? $translations.en["$nav_about_project"] : "…")}   effect={{"effectType":"route","path":"/about_project"}}
                 >
              </Tab>
              <Tab
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   effect={{"effectType":"route","path":"/about_exhibition"}}
                 execOnMount={false}
              >
              </Tab>
              <Tab
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_data"] ? $translations[$lang]["$nav_about_data"] : "nav_about_data") : ($translations.en && $translations.en["$nav_about_data"] ? $translations.en["$nav_about_data"] : "…")}   effect={{"effectType":"route","path":"/about_data"}}
                 execOnMount={true}
              >
              </Tab>
            </TabBar>
            <Spacing
               top="m"
               right="s"
               bottom="s"
               left="s"
            >
              <TextFormat
                 interfaceFormat="none"
                 contentFormat="headline-2"
              >
                <StaticText
                   text={$lang ? ($translations[$lang] && $translations[$lang]["$about_data"] ? $translations[$lang]["$about_data"] : "about_data") : ($translations.en && $translations.en["$about_data"] ? $translations.en["$about_data"] : "…")}>
                </StaticText>
              </TextFormat>
              <DataLoaderSingle
                 sheet="c6d3fe70-03f6-46ca-9e78-7541448d9e0f"
                 rowKey="3125d2d2-67a4-4d80-b336-d689ab2b82af"
                 >
                <DataCell
                   column={$lang ? "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/" + "menu$lang".replace("$lang", "$" + $lang) : "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/menu$lang"}   format="richText"
                   centerContent={false}
                >
                </DataCell>
              </DataLoaderSingle>
            </Spacing>
            <Spacing
               top="s"
               right="m"
               bottom="m"
               left="m"
            >
              <Styling
                 styleTokens={{"colorText":"#4954ee","colorTextStrong":"#000000","colorTextSoft":"#4C4C4C","colorTextLink":"#2D40A1","colorBackground":"#FFFFFF","colorBackgroundHighlight":"#E5E5E5","colorBackgroundBackdrop":"#F2F2F2","colorBorder":"#999999","colorDummyAsset":"#FFDBD3","colorTextButtonPressed":"#000000","colorBackgroundButtonPressed":"#B2B2B2","colorTextButtonDanger":"#000000","colorBackgroundButtonDanger":"#FF6A49","colorBackgroundButtonDangerPressed":"#FFA996","colorTextButtonPrimary":"#FFFFFF","colorTextButtonPrimaryPressed":"#FFFFFF","colorBackgroundButtonPrimary":"#000000","colorBackgroundButtonPrimaryPressed":"#4C4C4C","colorBorderButtonPrimary":"#000000","colorBorderButtonPrimaryPressed":"#000000","colorBackgroundLabel1":"#B2B2B2","colorTextLabel1":"#000000","colorBackgroundChatMe":"#FFFFFF","colorBackgroundChatOther":"#F2F2F2","colorPagination":"#000000","borderWidth":"1px","borderRadius":"1rem","borderRadiusButton":"1rem","borderRadiusLabel":"0.5rem","boxShadow":"0 0 1px rgba(0, 0, 0, 0.5)","googleFont":"Inter:wght@400;500;600;700;900","googleFont2":"Inter:wght@400;500;600;700;900","fontFamilyInterface":"Inter, sans-serif","fontFamilyContent":"Inter, sans-serif","fontHeadline1":"400 3rem/3.5rem var(--font-family-interface)","fontHeadline2":"400 1.875rem/2.25rem var(--font-family-interface)","fontHeadline3":"400 1.5rem/1.75rem var(--font-family-interface)","fontHeadline4":"400 1.25rem/1.5rem var(--font-family-interface)","fontHeadline5":"700 1rem/1.5rem var(--font-family-interface)","fontBody1":"400 1rem/1.5rem var(--font-family-interface)","fontBody2":"400 0.875rem/1.3125rem var(--font-family-interface)","fontSubtitle1":"400 1rem/1.3125rem var(--font-family-interface)","fontSubtitle2":"500 0.875rem/1.125rem var(--font-family-interface)","fontButton":"600 0.75rem/1rem var(--font-family-interface)","fontCaption":"400 0.75rem/1rem var(--font-family-interface)","fontCaptionBold":"700 0.75rem/1rem var(--font-family-interface)","fontOverline":"500 0.625rem/0.75rem var(--font-family-interface)","fontContentHeadline1":"900 3rem/3.5rem var(--font-family-content)","fontContentHeadline2":"900 1.875rem/2.25rem var(--font-family-content)","fontContentHeadline3":"900 1.5rem/1.75rem var(--font-family-content)","fontContentHeadline4":"900 1.25rem/1.5rem var(--font-family-content)","fontContentHeadline5":"700 1rem/1.5rem var(--font-family-content)","fontContentBody1":"400 1rem/1.5rem var(--font-family-content)","fontContentBody2":"400 0.875rem/1.5rem var(--font-family-content)","letterSpacingHeadline1":"0","letterSpacingHeadline2":"-0.03125rem","letterSpacingHeadline3":"-0.015625rem","letterSpacingHeadline4":"-0.015625rem","letterSpacingHeadline5":"0","letterSpacingBody1":"0.015625rem","letterSpacingBody2":"0.015625rem","letterSpacingSubtitle1":"0.009375rem","letterSpacingSubtitle2":"0.00625rem","letterSpacingButton":"0","letterSpacingCaption":"0","letterSpacingCaptionBold":"0","letterSpacingOverline":"0","letterSpacingContentHeadline1":"-0.0625rem","letterSpacingContentHeadline2":"-0.03125rem","letterSpacingContentHeadline3":"-0.03125rem","letterSpacingContentHeadline4":"0","letterSpacingContentHeadline5":"-0.02rem","letterSpacingContentBody1":"-0.015625rem","letterSpacingContentBody2":"0","scale":1,"distanceScaleFactor":1,"inset":"var(--distance-scale-factor)","insetX":"var(--inset)","insetY":"var(--inset)","outsetX":"var(--distance-scale-factor)","outsetY":"var(--distance-scale-factor)"}}
              >
                <MetadataDownload
                   label={$lang ? ($translations[$lang] && $translations[$lang]["$project_metadata_download"] ? $translations[$lang]["$project_metadata_download"] : "project_metadata_download") : ($translations.en && $translations.en["$project_metadata_download"] ? $translations.en["$project_metadata_download"] : "…")}   sheetKey="3d764bfb-ebf1-4e17-b756-e819c1d8794c"
                   filename="fuer-die-voegel_metadata"
                >
                </MetadataDownload>
              </Styling>
            </Spacing>
            <ButtonBar
               justify="center"
               >
              <Button
                 text="Minimaldatensatz"
                 type="secondary"
                 size="small"
                 flex="normal"
                 disabled={false}
                 ariaLabel="Link Minimaldatensatz-Empfehlung"
                 effect={{"effectType":"linkTargetBlank","url":"https://www.smb.museum/museen-einrichtungen/institut-fuer-museumsforschung/forschung/forschungsprojekte/minimaldatensatz/"}}
              >
              </Button>
              <Button
                 text="GND"
                 type="secondary"
                 size="small"
                 flex="normal"
                 disabled={false}
                 ariaLabel="Link GND"
                 effect={{"effectType":"linkTargetBlank","url":"https://www.dnb.de/DE/Professionell/Standardisierung/GND/gnd_node.html"}}
              >
              </Button>
              <Button
                 text="AAT"
                 type="secondary"
                 size="small"
                 flex="normal"
                 disabled={false}
                 ariaLabel="Link AAT"
                 effect={{"effectType":"linkTargetBlank","url":"https://www.getty.edu/research/tools/vocabularies/aat/"}}
              >
              </Button>
              <Button
                 text="Wikidata"
                 type="secondary"
                 size="small"
                 flex="normal"
                 disabled={false}
                 ariaLabel="Link Wikidata"
                 effect={{"effectType":"linkTargetBlank","url":"https://www.wikidata.org/wiki/Wikidata:Main_Page"}}
              >
              </Button>
            </ButtonBar>
          </ScrollContainer>
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
        </svelte:fragment>
        </LayoutShell>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
          <NavBar
          >
            <NavButton
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   disabled={false}
               effect={{"effectType":"route","path":"/"}}
            >
              <Icon
                 type="Thin-Dashboard"
                 inverse={false}
              >
              </Icon>
            </NavButton>
            <NavButton
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   disabled={false}
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
                 ariaLabel="Back"
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
                      reloadAfterSwitch="no"
                >
                </LangSwitch>
                <Button
                      type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel="Navigation menu"
                   effect={{"effectType":"route","path":"/menu"}}
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
            <Button
               text={$lang ? ($translations[$lang] && $translations[$lang]["$about_exhibition"] ? $translations[$lang]["$about_exhibition"] : "about_exhibition") : ($translations.en && $translations.en["$about_exhibition"] ? $translations.en["$about_exhibition"] : "…")}   type="secondary"
               size="medium"
               flex="fill"
               disabled={false}
               ariaLabel="About the exhibition"
               effect={{"effectType":"route","path":"/about_exhibition"}}
            >
            </Button>
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
                     headlineColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}   label1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/person"
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
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   disabled={false}
               effect={{"effectType":"route","path":"/"}}
            >
              <Icon
                 type="Thin-Dashboard"
                 inverse={false}
              >
              </Icon>
            </NavButton>
            <NavButton
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   disabled={false}
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
                 ariaLabel="Back"
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
                      reloadAfterSwitch="no"
                >
                </LangSwitch>
                <Button
                      type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                   ariaLabel="Navigation menu"
                   effect={{"effectType":"route","path":"/menu"}}
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
                     headlineColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}   label1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/person"
                     subtitle1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "dateDisplay$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/dateDisplay$lang"}      subtitle2Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/inventoryNumber"
                           >
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
                      <DataCell
                         column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "subjectKeywordDisplay$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/subjectKeywordDisplay$lang"}   format="string"
                         centerContent={false}
                      >
                      </DataCell>
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
                <SectionShell
                >
                  <Button
                     text={$lang ? ($translations[$lang] && $translations[$lang]["$about_data"] ? $translations[$lang]["$about_data"] : "about_data") : ($translations.en && $translations.en["$about_data"] ? $translations.en["$about_data"] : "…")}   type="secondary"
                     size="medium"
                     flex="normal"
                     disabled={false}
                     ariaLabel="About the data"
                     effect={{"effectType":"route","path":"/about_data"}}
                  >
                  </Button>
                </SectionShell>
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
                     headlineColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}   label1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/person"
                     subtitle1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "dateDisplay$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/dateDisplay$lang"}               descriptionColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectDescription$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectDescription$lang"}>
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
                           column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "audioTranscript$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audioTranscript$lang"}   format="richText"
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
                           ariaLabel="Image 1"
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
                           ariaLabel="Image 2"
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
                           ariaLabel="Image 3"
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
                  <AccordeonShell
                  >
                  <svelte:fragment slot="label">
                    <StaticText
                       text={$lang ? ($translations[$lang] && $translations[$lang]["$artwork_rights"] ? $translations[$lang]["$artwork_rights"] : "artwork_rights") : ($translations.en && $translations.en["$artwork_rights"] ? $translations.en["$artwork_rights"] : "…")}>
                    </StaticText>
                  </svelte:fragment>
                  <svelte:fragment slot="content">
                    <DataCell
                       column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "creditline$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/creditline$lang"}   format="richText"
                       centerContent={false}
                    >
                    </DataCell>
                    <ColumnShell
                       columns="3"
                    >
                    <svelte:fragment slot="col1">
                      <DataCell
                         column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/dcd2ce58-c690-451c-af6d-4f2c342f519d"
                         format="string"
                         centerContent={false}
                      >
                      </DataCell>
                    </svelte:fragment>
                    <svelte:fragment slot="col2">
                      <DataCell
                         column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/1a597e8d-1c77-43d7-bf22-0a924ecd128a"
                         format="string"
                         centerContent={false}
                      >
                      </DataCell>
                    </svelte:fragment>
                    <svelte:fragment slot="col3">
                      <DataCell
                         column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/e08e4dcb-da3f-46f2-a197-31ac53f6fde8"
                         format="string"
                         centerContent={false}
                      >
                      </DataCell>
                    </svelte:fragment>
                    </ColumnShell>
                  </svelte:fragment>
                  </AccordeonShell>
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
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   disabled={false}
               effect={{"effectType":"route","path":"/"}}
            >
              <Icon
                 type="Thin-Dashboard"
                 inverse={false}
              >
              </Icon>
            </NavButton>
            <NavButton
               text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   disabled={false}
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
             ariaLabel="Back"
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
                  reloadAfterSwitch="no"
            >
            </LangSwitch>
            <Button
                  type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel="Navigation menu"
               effect={{"effectType":"route","path":"/menu"}}
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
    <LayoutShell
    >
    <svelte:fragment slot="TopBar">
      <TextFormat
         interfaceFormat="headline-2"
         contentFormat="none"
      >
        <StaticText
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_privacy"] ? $translations[$lang]["$nav_privacy"] : "nav_privacy") : ($translations.en && $translations.en["$nav_privacy"] ? $translations.en["$nav_privacy"] : "…")}>
        </StaticText>
      </TextFormat>
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
          <Spacing
             top="s"
                   >
            <Button
               text="Google Fonts"
               type="secondary"
               size="medium"
               flex="normal"
               disabled={false}
               ariaLabel="Link Google Fonts"
               effect={{"effectType":"linkTargetBlank","url":"https://fonts.google.com/faq#privacy"}}
            >
            </Button>
          </Spacing>
        </Spacing>
      </ScrollContainer>
    </svelte:fragment>
    <svelte:fragment slot="BottomBar">
    </svelte:fragment>
    </LayoutShell>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   disabled={false}
           effect={{"effectType":"route","path":"/"}}
        >
          <Icon
             type="Thin-Dashboard"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   disabled={false}
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
             ariaLabel="Back"
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
                  reloadAfterSwitch="no"
            >
            </LangSwitch>
            <Button
                  type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel="Navigation menu"
               effect={{"effectType":"route","path":"/menu"}}
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
    <LayoutShell
    >
    <svelte:fragment slot="TopBar">
      <TextFormat
         interfaceFormat="headline-2"
         contentFormat="none"
      >
        <StaticText
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_help"] ? $translations[$lang]["$nav_help"] : "nav_help") : ($translations.en && $translations.en["$nav_help"] ? $translations.en["$nav_help"] : "…")}>
        </StaticText>
      </TextFormat>
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
        </Spacing>
      </ScrollContainer>
    </svelte:fragment>
    <svelte:fragment slot="BottomBar">
    </svelte:fragment>
    </LayoutShell>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   disabled={false}
           effect={{"effectType":"route","path":"/"}}
        >
          <Icon
             type="Thin-Dashboard"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   disabled={false}
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
             ariaLabel="Back"
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
                  reloadAfterSwitch="no"
            >
            </LangSwitch>
            <Button
                  type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel="Navigation menu"
               effect={{"effectType":"route","path":"/menu"}}
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
      <LayoutShell
      >
      <svelte:fragment slot="TopBar">
        <TextFormat
           interfaceFormat="headline-2"
           contentFormat="none"
        >
          <StaticText
             text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about"] ? $translations[$lang]["$nav_about"] : "nav_about") : ($translations.en && $translations.en["$nav_about"] ? $translations.en["$nav_about"] : "…")}>
          </StaticText>
        </TextFormat>
      </svelte:fragment>
      <svelte:fragment slot="Content">
        <TabBar
        >
          <Tab
             text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_project"] ? $translations[$lang]["$nav_about_project"] : "nav_about_project") : ($translations.en && $translations.en["$nav_about_project"] ? $translations.en["$nav_about_project"] : "…")}   effect={{"effectType":"route","path":"/about_project"}}
             execOnMount={true}
          >
          </Tab>
          <Tab
             text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   effect={{"effectType":"route","path":"/about_exhibition"}}
             execOnMount={false}
          >
          </Tab>
          <Tab
             text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_data"] ? $translations[$lang]["$nav_about_data"] : "nav_about_data") : ($translations.en && $translations.en["$nav_about_data"] ? $translations.en["$nav_about_data"] : "…")}   effect={{"effectType":"route","path":"/about_data"}}
             >
          </Tab>
        </TabBar>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
      </svelte:fragment>
      </LayoutShell>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   disabled={false}
           effect={{"effectType":"route","path":"/"}}
        >
          <Icon
             type="Thin-Dashboard"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   disabled={false}
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
   path="/about_exhibition"
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
             ariaLabel="Back"
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
                  reloadAfterSwitch="no"
            >
            </LangSwitch>
            <Button
                  type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel="Navigation menu"
               effect={{"effectType":"route","path":"/menu"}}
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
    <LayoutShell
    >
    <svelte:fragment slot="TopBar">
      <TextFormat
         interfaceFormat="headline-2"
         contentFormat="none"
      >
        <StaticText
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about"] ? $translations[$lang]["$nav_about"] : "nav_about") : ($translations.en && $translations.en["$nav_about"] ? $translations.en["$nav_about"] : "…")}>
        </StaticText>
      </TextFormat>
    </svelte:fragment>
    <svelte:fragment slot="Content">
      <ScrollContainer
      >
        <TabBar
        >
          <Tab
             text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_project"] ? $translations[$lang]["$nav_about_project"] : "nav_about_project") : ($translations.en && $translations.en["$nav_about_project"] ? $translations.en["$nav_about_project"] : "…")}   effect={{"effectType":"route","path":"/about_project"}}
             >
          </Tab>
          <Tab
             text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   effect={{"effectType":"route","path":"/about_exhibition"}}
             execOnMount={true}
          >
          </Tab>
          <Tab
             text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_data"] ? $translations[$lang]["$nav_about_data"] : "nav_about_data") : ($translations.en && $translations.en["$nav_about_data"] ? $translations.en["$nav_about_data"] : "…")}   effect={{"effectType":"route","path":"/about_data"}}
             >
          </Tab>
        </TabBar>
        <Spacing
           top="m"
           right="s"
           bottom="s"
           left="s"
        >
          <TextFormat
             interfaceFormat="none"
             contentFormat="headline-2"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$about_exhibition"] ? $translations[$lang]["$about_exhibition"] : "about_exhibition") : ($translations.en && $translations.en["$about_exhibition"] ? $translations.en["$about_exhibition"] : "…")}>
            </StaticText>
          </TextFormat>
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
        </Spacing>
      </ScrollContainer>
    </svelte:fragment>
    <svelte:fragment slot="BottomBar">
    </svelte:fragment>
    </LayoutShell>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   disabled={false}
           effect={{"effectType":"route","path":"/"}}
        >
          <Icon
             type="Thin-Dashboard"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   disabled={false}
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
   path="/about_project"
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
             ariaLabel="Back"
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
                  reloadAfterSwitch="no"
            >
            </LangSwitch>
            <Button
                  type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel="Navigation menu"
               effect={{"effectType":"route","path":"/menu"}}
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
    <LayoutShell
    >
    <svelte:fragment slot="TopBar">
      <TextFormat
         interfaceFormat="headline-2"
         contentFormat="none"
      >
        <StaticText
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about"] ? $translations[$lang]["$nav_about"] : "nav_about") : ($translations.en && $translations.en["$nav_about"] ? $translations.en["$nav_about"] : "…")}>
        </StaticText>
      </TextFormat>
    </svelte:fragment>
    <svelte:fragment slot="Content">
      <ScrollContainer
      >
        <TabBar
        >
          <Tab
             text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_project"] ? $translations[$lang]["$nav_about_project"] : "nav_about_project") : ($translations.en && $translations.en["$nav_about_project"] ? $translations.en["$nav_about_project"] : "…")}   effect={{"effectType":"route","path":"/about_project"}}
             execOnMount={true}
          >
          </Tab>
          <Tab
             text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   effect={{"effectType":"route","path":"/about_exhibition"}}
             execOnMount={false}
          >
          </Tab>
          <Tab
             text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_data"] ? $translations[$lang]["$nav_about_data"] : "nav_about_data") : ($translations.en && $translations.en["$nav_about_data"] ? $translations.en["$nav_about_data"] : "…")}   effect={{"effectType":"route","path":"/about_data"}}
             >
          </Tab>
        </TabBar>
        <Spacing
           top="m"
           right="s"
           bottom="s"
           left="s"
        >
          <TextFormat
             interfaceFormat="none"
             contentFormat="headline-2"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$about_project"] ? $translations[$lang]["$about_project"] : "about_project") : ($translations.en && $translations.en["$about_project"] ? $translations.en["$about_project"] : "…")}>
            </StaticText>
          </TextFormat>
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
        </Spacing>
        <Spacing
           top="s"
           right="s"
           bottom="m"
           left="s"
        >
          <ButtonBar
             justify="center"
             >
            <Button
               text="Interkit"
               type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel="Link interkit.app"
               effect={{"effectType":"linkTargetBlank","url":"https://www.interkit.app/"}}
            >
            </Button>
            <Button
               text="Minimaldatensatz"
               type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel="Link Minimaldatensatz-Empfehlung"
               effect={{"effectType":"linkTargetBlank","url":"https://www.smb.museum/museen-einrichtungen/institut-fuer-museumsforschung/forschung/forschungsprojekte/minimaldatensatz/"}}
            >
            </Button>
            <Button
               text="MGKSiegen"
               type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel="Link MGK Siegen"
               effect={{"effectType":"linkTargetBlank","url":"https://www.mgksiegen.de/de/"}}
            >
            </Button>
          </ButtonBar>
        </Spacing>
      </ScrollContainer>
    </svelte:fragment>
    <svelte:fragment slot="BottomBar">
    </svelte:fragment>
    </LayoutShell>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   disabled={false}
           effect={{"effectType":"route","path":"/"}}
        >
          <Icon
             type="Thin-Dashboard"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   disabled={false}
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
   path="/about_data"
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
             ariaLabel="Back"
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
                  reloadAfterSwitch="no"
            >
            </LangSwitch>
            <Button
                  type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel="Navigation menu"
               effect={{"effectType":"route","path":"/menu"}}
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
    <LayoutShell
    >
    <svelte:fragment slot="TopBar">
      <TextFormat
         interfaceFormat="headline-2"
         contentFormat="none"
      >
        <StaticText
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about"] ? $translations[$lang]["$nav_about"] : "nav_about") : ($translations.en && $translations.en["$nav_about"] ? $translations.en["$nav_about"] : "…")}>
        </StaticText>
      </TextFormat>
    </svelte:fragment>
    <svelte:fragment slot="Content">
      <ScrollContainer
      >
        <TabBar
        >
          <Tab
             text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_project"] ? $translations[$lang]["$nav_about_project"] : "nav_about_project") : ($translations.en && $translations.en["$nav_about_project"] ? $translations.en["$nav_about_project"] : "…")}   effect={{"effectType":"route","path":"/about_project"}}
             >
          </Tab>
          <Tab
             text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   effect={{"effectType":"route","path":"/about_exhibition"}}
             execOnMount={false}
          >
          </Tab>
          <Tab
             text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_data"] ? $translations[$lang]["$nav_about_data"] : "nav_about_data") : ($translations.en && $translations.en["$nav_about_data"] ? $translations.en["$nav_about_data"] : "…")}   effect={{"effectType":"route","path":"/about_data"}}
             execOnMount={true}
          >
          </Tab>
        </TabBar>
        <Spacing
           top="m"
           right="s"
           bottom="s"
           left="s"
        >
          <TextFormat
             interfaceFormat="none"
             contentFormat="headline-2"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$about_data"] ? $translations[$lang]["$about_data"] : "about_data") : ($translations.en && $translations.en["$about_data"] ? $translations.en["$about_data"] : "…")}>
            </StaticText>
          </TextFormat>
          <DataLoaderSingle
             sheet="c6d3fe70-03f6-46ca-9e78-7541448d9e0f"
             rowKey="3125d2d2-67a4-4d80-b336-d689ab2b82af"
             >
            <DataCell
               column={$lang ? "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/" + "menu$lang".replace("$lang", "$" + $lang) : "c6d3fe70-03f6-46ca-9e78-7541448d9e0f/menu$lang"}   format="richText"
               centerContent={false}
            >
            </DataCell>
          </DataLoaderSingle>
        </Spacing>
        <Spacing
           top="s"
           right="m"
           bottom="m"
           left="m"
        >
          <Styling
             styleTokens={{"colorText":"#4954ee","colorTextStrong":"#000000","colorTextSoft":"#4C4C4C","colorTextLink":"#2D40A1","colorBackground":"#FFFFFF","colorBackgroundHighlight":"#E5E5E5","colorBackgroundBackdrop":"#F2F2F2","colorBorder":"#999999","colorDummyAsset":"#FFDBD3","colorTextButtonPressed":"#000000","colorBackgroundButtonPressed":"#B2B2B2","colorTextButtonDanger":"#000000","colorBackgroundButtonDanger":"#FF6A49","colorBackgroundButtonDangerPressed":"#FFA996","colorTextButtonPrimary":"#FFFFFF","colorTextButtonPrimaryPressed":"#FFFFFF","colorBackgroundButtonPrimary":"#000000","colorBackgroundButtonPrimaryPressed":"#4C4C4C","colorBorderButtonPrimary":"#000000","colorBorderButtonPrimaryPressed":"#000000","colorBackgroundLabel1":"#B2B2B2","colorTextLabel1":"#000000","colorBackgroundChatMe":"#FFFFFF","colorBackgroundChatOther":"#F2F2F2","colorPagination":"#000000","borderWidth":"1px","borderRadius":"1rem","borderRadiusButton":"1rem","borderRadiusLabel":"0.5rem","boxShadow":"0 0 1px rgba(0, 0, 0, 0.5)","googleFont":"Inter:wght@400;500;600;700;900","googleFont2":"Inter:wght@400;500;600;700;900","fontFamilyInterface":"Inter, sans-serif","fontFamilyContent":"Inter, sans-serif","fontHeadline1":"400 3rem/3.5rem var(--font-family-interface)","fontHeadline2":"400 1.875rem/2.25rem var(--font-family-interface)","fontHeadline3":"400 1.5rem/1.75rem var(--font-family-interface)","fontHeadline4":"400 1.25rem/1.5rem var(--font-family-interface)","fontHeadline5":"700 1rem/1.5rem var(--font-family-interface)","fontBody1":"400 1rem/1.5rem var(--font-family-interface)","fontBody2":"400 0.875rem/1.3125rem var(--font-family-interface)","fontSubtitle1":"400 1rem/1.3125rem var(--font-family-interface)","fontSubtitle2":"500 0.875rem/1.125rem var(--font-family-interface)","fontButton":"600 0.75rem/1rem var(--font-family-interface)","fontCaption":"400 0.75rem/1rem var(--font-family-interface)","fontCaptionBold":"700 0.75rem/1rem var(--font-family-interface)","fontOverline":"500 0.625rem/0.75rem var(--font-family-interface)","fontContentHeadline1":"900 3rem/3.5rem var(--font-family-content)","fontContentHeadline2":"900 1.875rem/2.25rem var(--font-family-content)","fontContentHeadline3":"900 1.5rem/1.75rem var(--font-family-content)","fontContentHeadline4":"900 1.25rem/1.5rem var(--font-family-content)","fontContentHeadline5":"700 1rem/1.5rem var(--font-family-content)","fontContentBody1":"400 1rem/1.5rem var(--font-family-content)","fontContentBody2":"400 0.875rem/1.5rem var(--font-family-content)","letterSpacingHeadline1":"0","letterSpacingHeadline2":"-0.03125rem","letterSpacingHeadline3":"-0.015625rem","letterSpacingHeadline4":"-0.015625rem","letterSpacingHeadline5":"0","letterSpacingBody1":"0.015625rem","letterSpacingBody2":"0.015625rem","letterSpacingSubtitle1":"0.009375rem","letterSpacingSubtitle2":"0.00625rem","letterSpacingButton":"0","letterSpacingCaption":"0","letterSpacingCaptionBold":"0","letterSpacingOverline":"0","letterSpacingContentHeadline1":"-0.0625rem","letterSpacingContentHeadline2":"-0.03125rem","letterSpacingContentHeadline3":"-0.03125rem","letterSpacingContentHeadline4":"0","letterSpacingContentHeadline5":"-0.02rem","letterSpacingContentBody1":"-0.015625rem","letterSpacingContentBody2":"0","scale":1,"distanceScaleFactor":1,"inset":"var(--distance-scale-factor)","insetX":"var(--inset)","insetY":"var(--inset)","outsetX":"var(--distance-scale-factor)","outsetY":"var(--distance-scale-factor)"}}
          >
            <MetadataDownload
               label={$lang ? ($translations[$lang] && $translations[$lang]["$project_metadata_download"] ? $translations[$lang]["$project_metadata_download"] : "project_metadata_download") : ($translations.en && $translations.en["$project_metadata_download"] ? $translations.en["$project_metadata_download"] : "…")}   sheetKey="3d764bfb-ebf1-4e17-b756-e819c1d8794c"
               filename="fuer-die-voegel_metadata"
            >
            </MetadataDownload>
          </Styling>
        </Spacing>
        <ButtonBar
           justify="center"
           >
          <Button
             text="Minimaldatensatz"
             type="secondary"
             size="small"
             flex="normal"
             disabled={false}
             ariaLabel="Link Minimaldatensatz-Empfehlung"
             effect={{"effectType":"linkTargetBlank","url":"https://www.smb.museum/museen-einrichtungen/institut-fuer-museumsforschung/forschung/forschungsprojekte/minimaldatensatz/"}}
          >
          </Button>
          <Button
             text="GND"
             type="secondary"
             size="small"
             flex="normal"
             disabled={false}
             ariaLabel="Link GND"
             effect={{"effectType":"linkTargetBlank","url":"https://www.dnb.de/DE/Professionell/Standardisierung/GND/gnd_node.html"}}
          >
          </Button>
          <Button
             text="AAT"
             type="secondary"
             size="small"
             flex="normal"
             disabled={false}
             ariaLabel="Link AAT"
             effect={{"effectType":"linkTargetBlank","url":"https://www.getty.edu/research/tools/vocabularies/aat/"}}
          >
          </Button>
          <Button
             text="Wikidata"
             type="secondary"
             size="small"
             flex="normal"
             disabled={false}
             ariaLabel="Link Wikidata"
             effect={{"effectType":"linkTargetBlank","url":"https://www.wikidata.org/wiki/Wikidata:Main_Page"}}
          >
          </Button>
        </ButtonBar>
      </ScrollContainer>
    </svelte:fragment>
    <svelte:fragment slot="BottomBar">
    </svelte:fragment>
    </LayoutShell>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   disabled={false}
           effect={{"effectType":"route","path":"/"}}
        >
          <Icon
             type="Thin-Dashboard"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   disabled={false}
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
             ariaLabel="Back"
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
                  reloadAfterSwitch="no"
            >
            </LangSwitch>
            <Button
                  type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel="Navigation menu"
               effect={{"effectType":"route","path":"/menu"}}
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
                 headlineColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}   label1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/person"
                 subtitle1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "dateDisplay$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/dateDisplay$lang"}      subtitle2Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/inventoryNumber"
                       >
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
                  <DataCell
                     column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "subjectKeywordDisplay$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/subjectKeywordDisplay$lang"}   format="string"
                     centerContent={false}
                  >
                  </DataCell>
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
            <SectionShell
            >
              <Button
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$about_data"] ? $translations[$lang]["$about_data"] : "about_data") : ($translations.en && $translations.en["$about_data"] ? $translations.en["$about_data"] : "…")}   type="secondary"
                 size="medium"
                 flex="normal"
                 disabled={false}
                 ariaLabel="About the data"
                 effect={{"effectType":"route","path":"/about_data"}}
              >
              </Button>
            </SectionShell>
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
                 headlineColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}   label1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/person"
                 subtitle1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "dateDisplay$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/dateDisplay$lang"}               descriptionColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectDescription$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectDescription$lang"}>
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
                       column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "audioTranscript$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audioTranscript$lang"}   format="richText"
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
                       ariaLabel="Image 1"
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
                       ariaLabel="Image 2"
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
                       ariaLabel="Image 3"
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
              <AccordeonShell
              >
              <svelte:fragment slot="label">
                <StaticText
                   text={$lang ? ($translations[$lang] && $translations[$lang]["$artwork_rights"] ? $translations[$lang]["$artwork_rights"] : "artwork_rights") : ($translations.en && $translations.en["$artwork_rights"] ? $translations.en["$artwork_rights"] : "…")}>
                </StaticText>
              </svelte:fragment>
              <svelte:fragment slot="content">
                <DataCell
                   column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "creditline$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/creditline$lang"}   format="richText"
                   centerContent={false}
                >
                </DataCell>
                <ColumnShell
                   columns="3"
                >
                <svelte:fragment slot="col1">
                  <DataCell
                     column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/dcd2ce58-c690-451c-af6d-4f2c342f519d"
                     format="string"
                     centerContent={false}
                  >
                  </DataCell>
                </svelte:fragment>
                <svelte:fragment slot="col2">
                  <DataCell
                     column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/1a597e8d-1c77-43d7-bf22-0a924ecd128a"
                     format="string"
                     centerContent={false}
                  >
                  </DataCell>
                </svelte:fragment>
                <svelte:fragment slot="col3">
                  <DataCell
                     column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/e08e4dcb-da3f-46f2-a197-31ac53f6fde8"
                     format="string"
                     centerContent={false}
                  >
                  </DataCell>
                </svelte:fragment>
                </ColumnShell>
              </svelte:fragment>
              </AccordeonShell>
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
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   disabled={false}
           effect={{"effectType":"route","path":"/"}}
        >
          <Icon
             type="Thin-Dashboard"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   disabled={false}
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
             ariaLabel="Back"
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
                  reloadAfterSwitch="no"
            >
            </LangSwitch>
            <Button
                  type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               ariaLabel="Navigation menu"
               effect={{"effectType":"route","path":"/menu"}}
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
        <Button
           text={$lang ? ($translations[$lang] && $translations[$lang]["$about_exhibition"] ? $translations[$lang]["$about_exhibition"] : "about_exhibition") : ($translations.en && $translations.en["$about_exhibition"] ? $translations.en["$about_exhibition"] : "…")}   type="secondary"
           size="medium"
           flex="fill"
           disabled={false}
           ariaLabel="About the exhibition"
           effect={{"effectType":"route","path":"/about_exhibition"}}
        >
        </Button>
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
                 headlineColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "objectTitle$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/objectTitle$lang"}   label1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/person"
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
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_home"] ? $translations[$lang]["$nav_home"] : "nav_home") : ($translations.en && $translations.en["$nav_home"] ? $translations.en["$nav_home"] : "…")}   disabled={false}
           effect={{"effectType":"route","path":"/"}}
        >
          <Icon
             type="Thin-Dashboard"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$nav_about_exhibition"] ? $translations[$lang]["$nav_about_exhibition"] : "nav_about_exhibition") : ($translations.en && $translations.en["$nav_about_exhibition"] ? $translations.en["$nav_about_exhibition"] : "…")}   disabled={false}
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
