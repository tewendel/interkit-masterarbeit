<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AnonymousLogin from "interkit/components/AnonymousLogin.svelte";
import AppBaseAdvanced from "interkit/components/AppBaseAdvanced.svelte";
import Button from "interkit/components/Button.svelte";
import ButtonBar from "interkit/components/ButtonBar.svelte";
import CenterModal from "interkit/components/CenterModal.svelte";
import DataCell from "interkit/components/DataCell.svelte";
import DataLoaderSingle from "interkit/components/DataLoaderSingle.svelte";
import HorizontalSpacer from "interkit/components/HorizontalSpacer.svelte";
import Icon from "interkit/components/Icon.svelte";
import Image from "interkit/components/Image.svelte";
import LangSwitch from "interkit/components/LangSwitch.svelte";
import LayoutShell from "interkit/components/LayoutShell.svelte";
import ListItem from "interkit/components/ListItem.svelte";
import NavBar from "interkit/components/NavBar.svelte";
import NavButton from "interkit/components/NavButton.svelte";
import Route from "interkit/components/Route.svelte";
import ScrollContainer from "interkit/components/ScrollContainer.svelte";
import SectionShell from "interkit/components/SectionShell.svelte";
import StaticText from "interkit/components/StaticText.svelte";
import TextFormat from "interkit/components/TextFormat.svelte";
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
      </SectionShell>
      <SectionShell
      >
        <CenterModal
           size="large"
           imageKey="3d34da00-3166-4f84-8762-511e125aaa66"
              headline={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : "…"}      >
        <svelte:fragment slot="buttons">
          <Button
             text={$lang ? ($translations[$lang] && $translations[$lang]["$button_audioguide"] ? $translations[$lang]["$button_audioguide"] : "button_audioguide") : ($translations.en && $translations.en["$button_audioguide"] ? $translations.en["$button_audioguide"] : "…")}   type="secondary"
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
           size="large"
                       >
        <svelte:fragment slot="buttons">
          <Button
             text={$lang ? ($translations[$lang] && $translations[$lang]["$button_more"] ? $translations[$lang]["$button_more"] : "button_more") : ($translations.en && $translations.en["$button_more"] ? $translations.en["$button_more"] : "…")}   type="secondary"
             size="medium"
             flex="fill"
             disabled={false}
                effect={undefined}
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
  <svelte:fragment slot="Content">
    <ListItem
       text={$lang ? ($translations[$lang] && $translations[$lang]["$home"] ? $translations[$lang]["$home"] : "home") : ($translations.en && $translations.en["$home"] ? $translations.en["$home"] : "…")}   effect={{"effectType":"route","path":"/"}}
    >
    </ListItem>
    <ListItem
       text={$lang ? ($translations[$lang] && $translations[$lang]["$privacy"] ? $translations[$lang]["$privacy"] : "privacy") : ($translations.en && $translations.en["$privacy"] ? $translations.en["$privacy"] : "…")}   effect={{"effectType":"route","path":"/privacy"}}
    >
    </ListItem>
    <ListItem
       text={$lang ? ($translations[$lang] && $translations[$lang]["$imprint"] ? $translations[$lang]["$imprint"] : "imprint") : ($translations.en && $translations.en["$imprint"] ? $translations.en["$imprint"] : "…")}   effect={{"effectType":"route","path":"/imprint"}}
    >
    </ListItem>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
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
  <svelte:fragment slot="Content">
    <ScrollContainer
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
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShell>
</Route>

<AppBaseAdvanced
   languages="de,en"
      enableWebPush={false}
      desktopFallbackMinWidth="600px"
>
<svelte:fragment slot="viewport">
  <AnonymousLogin
     defaultLang="en"
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
          </SectionShell>
          <SectionShell
          >
            <CenterModal
               size="large"
               imageKey="3d34da00-3166-4f84-8762-511e125aaa66"
                  headline={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : "…"}      >
            <svelte:fragment slot="buttons">
              <Button
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$button_audioguide"] ? $translations[$lang]["$button_audioguide"] : "button_audioguide") : ($translations.en && $translations.en["$button_audioguide"] ? $translations.en["$button_audioguide"] : "…")}   type="secondary"
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
               size="large"
                           >
            <svelte:fragment slot="buttons">
              <Button
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$button_more"] ? $translations[$lang]["$button_more"] : "button_more") : ($translations.en && $translations.en["$button_more"] ? $translations.en["$button_more"] : "…")}   type="secondary"
                 size="medium"
                 flex="fill"
                 disabled={false}
                    effect={undefined}
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
      <svelte:fragment slot="Content">
        <ListItem
           text={$lang ? ($translations[$lang] && $translations[$lang]["$home"] ? $translations[$lang]["$home"] : "home") : ($translations.en && $translations.en["$home"] ? $translations.en["$home"] : "…")}   effect={{"effectType":"route","path":"/"}}
        >
        </ListItem>
        <ListItem
           text={$lang ? ($translations[$lang] && $translations[$lang]["$privacy"] ? $translations[$lang]["$privacy"] : "privacy") : ($translations.en && $translations.en["$privacy"] ? $translations.en["$privacy"] : "…")}   effect={{"effectType":"route","path":"/privacy"}}
        >
        </ListItem>
        <ListItem
           text={$lang ? ($translations[$lang] && $translations[$lang]["$imprint"] ? $translations[$lang]["$imprint"] : "imprint") : ($translations.en && $translations.en["$imprint"] ? $translations.en["$imprint"] : "…")}   effect={{"effectType":"route","path":"/imprint"}}
        >
        </ListItem>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
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
      <svelte:fragment slot="Content">
        <ScrollContainer
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
        </ScrollContainer>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
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
      <svelte:fragment slot="Content">
        <ScrollContainer
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
        </ScrollContainer>
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
      </svelte:fragment>
      </LayoutShell>
    </Route>
    <Route
       path="/exhibition"
       keepAlive={false}
    >
      <LayoutShell
      >
      <svelte:fragment slot="TopBar">
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
      <svelte:fragment slot="Content">
        <ScrollContainer
        >
          <SectionShell
          >
            <CenterModal
               size="large"
               imageKey="3d34da00-3166-4f84-8762-511e125aaa66"
                  headline={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : "…"}      description={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_text"] ? $translations[$lang]["$exhibition_text"] : "exhibition_text") : "…"}>
            <svelte:fragment slot="buttons">
            </svelte:fragment>
            </CenterModal>
          </SectionShell>
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
  <svelte:fragment slot="Content">
    <ScrollContainer
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
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShell>
</Route>

<Route
   path="/exhibition"
   keepAlive={false}
>
  <LayoutShell
  >
  <svelte:fragment slot="TopBar">
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
  <svelte:fragment slot="Content">
    <ScrollContainer
    >
      <SectionShell
      >
        <CenterModal
           size="large"
           imageKey="3d34da00-3166-4f84-8762-511e125aaa66"
              headline={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : "…"}      description={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_text"] ? $translations[$lang]["$exhibition_text"] : "exhibition_text") : "…"}>
        <svelte:fragment slot="buttons">
        </svelte:fragment>
        </CenterModal>
      </SectionShell>
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
