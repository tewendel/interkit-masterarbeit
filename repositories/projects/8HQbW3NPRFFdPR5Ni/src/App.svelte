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
import Label from "interkit/components/Label.svelte";
import LangSwitch from "interkit/components/LangSwitch.svelte";
import LayoutShell from "interkit/components/LayoutShell.svelte";
import LayoutShellAudio from "interkit/components/LayoutShellAudio.svelte";
import ListItem from "interkit/components/ListItem.svelte";
import NavBar from "interkit/components/NavBar.svelte";
import NavButton from "interkit/components/NavButton.svelte";
import PopoutAudioButton from "interkit/components/PopoutAudioButton.svelte";
import Route from "interkit/components/Route.svelte";
import ScrollContainer from "interkit/components/ScrollContainer.svelte";
import SectionShell from "interkit/components/SectionShell.svelte";
import Spacing from "interkit/components/Spacing.svelte";
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
      <StaticText
         text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : ($translations.en && $translations.en["$exhibition_title"] ? $translations.en["$exhibition_title"] : "…")}>
      </StaticText>
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
        <AccordeonShell
        >
        <svelte:fragment slot="label">
          <Label
             type="icon"
             variant="normal"
                icon="Full-More"
          >
          </Label>
          <StaticText
             text={$lang ? ($translations[$lang] && $translations[$lang]["$button_more"] ? $translations[$lang]["$button_more"] : "button_more") : ($translations.en && $translations.en["$button_more"] ? $translations.en["$button_more"] : "…")}>
          </StaticText>
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
                 headlineColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "title$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/title$lang"}   label1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/0f4534fd-8d9e-4162-a24d-629395419a54"
                 subtitle1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "date$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/date$lang"}   label2Column="elements/label2"
                 subtitle2Column="elements/subtitle2"
                 label3Column="elements/label3"
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
            </svelte:fragment>
            </DataList>
          </SectionShell>
        </DataLoaderMulti>
      </SectionShell>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="Player">
    <AudioPlayer
       audioColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang"}   titleColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/title$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/title$lang"}>
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
           effect={{"effectType":"back"}}
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
           imageKey="b910238c-edf8-499e-b187-6a7cef0912a6"
              headline={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : "…"}      >
        <svelte:fragment slot="buttons">
          <Button
             text={$lang ? ($translations[$lang] && $translations[$lang]["$button_more"] ? $translations[$lang]["$button_more"] : "button_more") : ($translations.en && $translations.en["$button_more"] ? $translations.en["$button_more"] : "…")}   type="secondary"
             size="medium"
             flex="fill"
             disabled={false}
                effect={{"effectType":"route","path":"/exhibition"}}
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
      <StaticText
         text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : ($translations.en && $translations.en["$exhibition_title"] ? $translations.en["$exhibition_title"] : "…")}>
      </StaticText>
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
      <Spacing
         top="s"
         right="s"
         bottom="s"
         left="s"
      >
        <ButtonBar
           justify="center"
           >
          <IfUIKey
             storeType="UIKey"
             key="mode"
             value="guide"
          >
          <svelte:fragment slot="iftrue">
            <Button
               text={$lang ? ($translations[$lang] && $translations[$lang]["$button_audioguide"] ? $translations[$lang]["$button_audioguide"] : "button_audioguide") : ($translations.en && $translations.en["$button_audioguide"] ? $translations.en["$button_audioguide"] : "…")}   type="primary"
               size="small"
               flex="normal"
               disabled={false}
                  effect={{"effectType":"setUIKey","value":"guide","key":"mode"}}
            >
            </Button>
          </svelte:fragment>
          <svelte:fragment slot="else">
            <Button
               text={$lang ? ($translations[$lang] && $translations[$lang]["$button_audioguide"] ? $translations[$lang]["$button_audioguide"] : "button_audioguide") : ($translations.en && $translations.en["$button_audioguide"] ? $translations.en["$button_audioguide"] : "…")}   type="ghost"
               size="small"
               flex="normal"
               disabled={false}
                  effect={{"effectType":"setUIKey","value":"guide","key":"mode"}}
            >
            </Button>
          </svelte:fragment>
          </IfUIKey>
          <IfUIKey
             storeType="UIKey"
             key="mode"
             value="data"
          >
          <svelte:fragment slot="iftrue">
            <Button
               text={$lang ? ($translations[$lang] && $translations[$lang]["$data"] ? $translations[$lang]["$data"] : "data") : ($translations.en && $translations.en["$data"] ? $translations.en["$data"] : "…")}   type="primary"
               size="small"
               flex="normal"
               disabled={false}
                  effect={{"effectType":"setUIKey","value":"data","key":"mode"}}
            >
            </Button>
          </svelte:fragment>
          <svelte:fragment slot="else">
            <Button
               text={$lang ? ($translations[$lang] && $translations[$lang]["$data"] ? $translations[$lang]["$data"] : "data") : ($translations.en && $translations.en["$data"] ? $translations.en["$data"] : "…")}   type="ghost"
               size="small"
               flex="normal"
               disabled={false}
                  effect={{"effectType":"setUIKey","value":"data","key":"mode"}}
            >
            </Button>
          </svelte:fragment>
          </IfUIKey>
        </ButtonBar>
        <IfUIKey
           storeType="UIKey"
           key="mode"
           value="guide"
        >
        <svelte:fragment slot="iftrue">
          <Spacing
             top="s"
             right="s"
             bottom="s"
             left="s"
          >
            <TextFormat
               interfaceFormat="headline-3"
               contentFormat="none"
            >
              <StaticText
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$guide_mode"] ? $translations[$lang]["$guide_mode"] : "guide_mode") : ($translations.en && $translations.en["$guide_mode"] ? $translations.en["$guide_mode"] : "…")}>
              </StaticText>
            </TextFormat>
          </Spacing>
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
                 headlineColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "title$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/title$lang"}   label1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/0f4534fd-8d9e-4162-a24d-629395419a54"
                 subtitle1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "date$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/date$lang"}               >
              <svelte:fragment slot="chips">
              </svelte:fragment>
              <svelte:fragment slot="content">
                <PopoutAudioButton
                   audioColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "audio$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang"}   buttonOptions={{"text":"","type":"secondary","size":"medium","flex":"fill"}}
                >
                </PopoutAudioButton>
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
                       text={$lang ? ($translations[$lang] && $translations[$lang]["$button_transcript"] ? $translations[$lang]["$button_transcript"] : "button_transcript") : ($translations.en && $translations.en["$button_transcript"] ? $translations.en["$button_transcript"] : "…")}>
                    </StaticText>
                  </svelte:fragment>
                  <svelte:fragment slot="content">
                    <DataCell
                       column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "transcript$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/transcript$lang"}   format="richText"
                       centerContent={false}
                    >
                    </DataCell>
                  </svelte:fragment>
                  </AccordeonShell>
                </Spacing>
              </svelte:fragment>
              </DataCard>
            </Spacing>
          </SectionShell>
          <SectionShell
          >
            <Spacing
               top="s"
               right="s"
               bottom="s"
               left="s"
            >
              <TextFormat
                 interfaceFormat="headline-5"
                 contentFormat="none"
              >
                <StaticText
                   text={$lang ? ($translations[$lang] && $translations[$lang]["$feelings_text"] ? $translations[$lang]["$feelings_text"] : "feelings_text") : ($translations.en && $translations.en["$feelings_text"] ? $translations.en["$feelings_text"] : "…")}>
                </StaticText>
              </TextFormat>
              <ButtonBar
                 justify="left"
                 helpText={$lang ? ($translations[$lang] && $translations[$lang]["$feelings_description"] ? $translations[$lang]["$feelings_description"] : "feelings_description") : "…"}>
                <Button
                   text="😊"
                   type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                      effect={undefined}
                >
                </Button>
                <Button
                   text="🤔"
                   type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                      effect={undefined}
                >
                </Button>
                <Button
                   text="😐"
                   type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                      effect={undefined}
                >
                </Button>
                <Button
                   text="😢"
                   type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                      effect={undefined}
                >
                </Button>
                <Button
                   text="😦"
                   type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                      effect={undefined}
                >
                </Button>
              </ButtonBar>
            </Spacing>
          </SectionShell>
        </svelte:fragment>
        <svelte:fragment slot="else">
          <Spacing
             top="s"
             right="s"
             bottom="s"
             left="s"
          >
            <TextFormat
               interfaceFormat="headline-3"
               contentFormat="none"
            >
              <StaticText
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$data_mode"] ? $translations[$lang]["$data_mode"] : "data_mode") : ($translations.en && $translations.en["$data_mode"] ? $translations.en["$data_mode"] : "…")}>
              </StaticText>
            </TextFormat>
          </Spacing>
          <SectionShell
          >
            <Spacing
                        >
              <DataCard
                 variant="medium"
                    effect={undefined}
                 imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/100b14b4-e56e-444a-b789-d606b71c7405"
                 headlineColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "title$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/title$lang"}   label1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/0f4534fd-8d9e-4162-a24d-629395419a54"
                 subtitle1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "date$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/date$lang"}   label2Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "material$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/material$lang"}   subtitle2Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "size$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/size$lang"}      subtitle3Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "institution$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/institution$lang"}   >
              <svelte:fragment slot="chips">
              </svelte:fragment>
              <svelte:fragment slot="content">
              </svelte:fragment>
              </DataCard>
            </Spacing>
          </SectionShell>
        </svelte:fragment>
        </IfUIKey>
      </Spacing>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="Player">
    <AudioPlayer
       audioColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang"}   titleColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/title$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/title$lang"}>
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
           effect={{"effectType":"back"}}
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
       text={$lang ? ($translations[$lang] && $translations[$lang]["$help"] ? $translations[$lang]["$help"] : "help") : ($translations.en && $translations.en["$help"] ? $translations.en["$help"] : "…")}   effect={{"effectType":"route","path":"/help"}}
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
               imageKey="b910238c-edf8-499e-b187-6a7cef0912a6"
                  headline={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : "…"}      >
            <svelte:fragment slot="buttons">
              <Button
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$button_more"] ? $translations[$lang]["$button_more"] : "button_more") : ($translations.en && $translations.en["$button_more"] ? $translations.en["$button_more"] : "…")}   type="secondary"
                 size="medium"
                 flex="fill"
                 disabled={false}
                    effect={{"effectType":"route","path":"/exhibition"}}
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
           text={$lang ? ($translations[$lang] && $translations[$lang]["$help"] ? $translations[$lang]["$help"] : "help") : ($translations.en && $translations.en["$help"] ? $translations.en["$help"] : "…")}   effect={{"effectType":"route","path":"/help"}}
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
          <StaticText
             text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : ($translations.en && $translations.en["$exhibition_title"] ? $translations.en["$exhibition_title"] : "…")}>
          </StaticText>
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
            <AccordeonShell
            >
            <svelte:fragment slot="label">
              <Label
                 type="icon"
                 variant="normal"
                    icon="Full-More"
              >
              </Label>
              <StaticText
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$button_more"] ? $translations[$lang]["$button_more"] : "button_more") : ($translations.en && $translations.en["$button_more"] ? $translations.en["$button_more"] : "…")}>
              </StaticText>
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
                     headlineColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "title$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/title$lang"}   label1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/0f4534fd-8d9e-4162-a24d-629395419a54"
                     subtitle1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "date$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/date$lang"}   label2Column="elements/label2"
                     subtitle2Column="elements/subtitle2"
                     label3Column="elements/label3"
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
                </svelte:fragment>
                </DataList>
              </SectionShell>
            </DataLoaderMulti>
          </SectionShell>
        </ScrollContainer>
      </svelte:fragment>
      <svelte:fragment slot="Player">
        <AudioPlayer
           audioColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang"}   titleColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/title$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/title$lang"}>
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
               effect={{"effectType":"back"}}
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
          <StaticText
             text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : ($translations.en && $translations.en["$exhibition_title"] ? $translations.en["$exhibition_title"] : "…")}>
          </StaticText>
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
          <Spacing
             top="s"
             right="s"
             bottom="s"
             left="s"
          >
            <ButtonBar
               justify="center"
               >
              <IfUIKey
                 storeType="UIKey"
                 key="mode"
                 value="guide"
              >
              <svelte:fragment slot="iftrue">
                <Button
                   text={$lang ? ($translations[$lang] && $translations[$lang]["$button_audioguide"] ? $translations[$lang]["$button_audioguide"] : "button_audioguide") : ($translations.en && $translations.en["$button_audioguide"] ? $translations.en["$button_audioguide"] : "…")}   type="primary"
                   size="small"
                   flex="normal"
                   disabled={false}
                      effect={{"effectType":"setUIKey","value":"guide","key":"mode"}}
                >
                </Button>
              </svelte:fragment>
              <svelte:fragment slot="else">
                <Button
                   text={$lang ? ($translations[$lang] && $translations[$lang]["$button_audioguide"] ? $translations[$lang]["$button_audioguide"] : "button_audioguide") : ($translations.en && $translations.en["$button_audioguide"] ? $translations.en["$button_audioguide"] : "…")}   type="ghost"
                   size="small"
                   flex="normal"
                   disabled={false}
                      effect={{"effectType":"setUIKey","value":"guide","key":"mode"}}
                >
                </Button>
              </svelte:fragment>
              </IfUIKey>
              <IfUIKey
                 storeType="UIKey"
                 key="mode"
                 value="data"
              >
              <svelte:fragment slot="iftrue">
                <Button
                   text={$lang ? ($translations[$lang] && $translations[$lang]["$data"] ? $translations[$lang]["$data"] : "data") : ($translations.en && $translations.en["$data"] ? $translations.en["$data"] : "…")}   type="primary"
                   size="small"
                   flex="normal"
                   disabled={false}
                      effect={{"effectType":"setUIKey","value":"data","key":"mode"}}
                >
                </Button>
              </svelte:fragment>
              <svelte:fragment slot="else">
                <Button
                   text={$lang ? ($translations[$lang] && $translations[$lang]["$data"] ? $translations[$lang]["$data"] : "data") : ($translations.en && $translations.en["$data"] ? $translations.en["$data"] : "…")}   type="ghost"
                   size="small"
                   flex="normal"
                   disabled={false}
                      effect={{"effectType":"setUIKey","value":"data","key":"mode"}}
                >
                </Button>
              </svelte:fragment>
              </IfUIKey>
            </ButtonBar>
            <IfUIKey
               storeType="UIKey"
               key="mode"
               value="guide"
            >
            <svelte:fragment slot="iftrue">
              <Spacing
                 top="s"
                 right="s"
                 bottom="s"
                 left="s"
              >
                <TextFormat
                   interfaceFormat="headline-3"
                   contentFormat="none"
                >
                  <StaticText
                     text={$lang ? ($translations[$lang] && $translations[$lang]["$guide_mode"] ? $translations[$lang]["$guide_mode"] : "guide_mode") : ($translations.en && $translations.en["$guide_mode"] ? $translations.en["$guide_mode"] : "…")}>
                  </StaticText>
                </TextFormat>
              </Spacing>
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
                     headlineColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "title$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/title$lang"}   label1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/0f4534fd-8d9e-4162-a24d-629395419a54"
                     subtitle1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "date$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/date$lang"}               >
                  <svelte:fragment slot="chips">
                  </svelte:fragment>
                  <svelte:fragment slot="content">
                    <PopoutAudioButton
                       audioColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "audio$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang"}   buttonOptions={{"text":"","type":"secondary","size":"medium","flex":"fill"}}
                    >
                    </PopoutAudioButton>
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
                           text={$lang ? ($translations[$lang] && $translations[$lang]["$button_transcript"] ? $translations[$lang]["$button_transcript"] : "button_transcript") : ($translations.en && $translations.en["$button_transcript"] ? $translations.en["$button_transcript"] : "…")}>
                        </StaticText>
                      </svelte:fragment>
                      <svelte:fragment slot="content">
                        <DataCell
                           column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "transcript$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/transcript$lang"}   format="richText"
                           centerContent={false}
                        >
                        </DataCell>
                      </svelte:fragment>
                      </AccordeonShell>
                    </Spacing>
                  </svelte:fragment>
                  </DataCard>
                </Spacing>
              </SectionShell>
              <SectionShell
              >
                <Spacing
                   top="s"
                   right="s"
                   bottom="s"
                   left="s"
                >
                  <TextFormat
                     interfaceFormat="headline-5"
                     contentFormat="none"
                  >
                    <StaticText
                       text={$lang ? ($translations[$lang] && $translations[$lang]["$feelings_text"] ? $translations[$lang]["$feelings_text"] : "feelings_text") : ($translations.en && $translations.en["$feelings_text"] ? $translations.en["$feelings_text"] : "…")}>
                    </StaticText>
                  </TextFormat>
                  <ButtonBar
                     justify="left"
                     helpText={$lang ? ($translations[$lang] && $translations[$lang]["$feelings_description"] ? $translations[$lang]["$feelings_description"] : "feelings_description") : "…"}>
                    <Button
                       text="😊"
                       type="secondary"
                       size="small"
                       flex="normal"
                       disabled={false}
                          effect={undefined}
                    >
                    </Button>
                    <Button
                       text="🤔"
                       type="secondary"
                       size="small"
                       flex="normal"
                       disabled={false}
                          effect={undefined}
                    >
                    </Button>
                    <Button
                       text="😐"
                       type="secondary"
                       size="small"
                       flex="normal"
                       disabled={false}
                          effect={undefined}
                    >
                    </Button>
                    <Button
                       text="😢"
                       type="secondary"
                       size="small"
                       flex="normal"
                       disabled={false}
                          effect={undefined}
                    >
                    </Button>
                    <Button
                       text="😦"
                       type="secondary"
                       size="small"
                       flex="normal"
                       disabled={false}
                          effect={undefined}
                    >
                    </Button>
                  </ButtonBar>
                </Spacing>
              </SectionShell>
            </svelte:fragment>
            <svelte:fragment slot="else">
              <Spacing
                 top="s"
                 right="s"
                 bottom="s"
                 left="s"
              >
                <TextFormat
                   interfaceFormat="headline-3"
                   contentFormat="none"
                >
                  <StaticText
                     text={$lang ? ($translations[$lang] && $translations[$lang]["$data_mode"] ? $translations[$lang]["$data_mode"] : "data_mode") : ($translations.en && $translations.en["$data_mode"] ? $translations.en["$data_mode"] : "…")}>
                  </StaticText>
                </TextFormat>
              </Spacing>
              <SectionShell
              >
                <Spacing
                            >
                  <DataCard
                     variant="medium"
                        effect={undefined}
                     imageColumn="3d764bfb-ebf1-4e17-b756-e819c1d8794c/100b14b4-e56e-444a-b789-d606b71c7405"
                     headlineColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "title$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/title$lang"}   label1Column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/0f4534fd-8d9e-4162-a24d-629395419a54"
                     subtitle1Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "date$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/date$lang"}   label2Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "material$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/material$lang"}   subtitle2Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "size$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/size$lang"}      subtitle3Column={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/" + "institution$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/institution$lang"}   >
                  <svelte:fragment slot="chips">
                  </svelte:fragment>
                  <svelte:fragment slot="content">
                  </svelte:fragment>
                  </DataCard>
                </Spacing>
              </SectionShell>
            </svelte:fragment>
            </IfUIKey>
          </Spacing>
        </ScrollContainer>
      </svelte:fragment>
      <svelte:fragment slot="Player">
        <AudioPlayer
           audioColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/audio$lang"}   titleColumn={$lang ? "3d764bfb-ebf1-4e17-b756-e819c1d8794c/title$lang".replace("$lang", "$" + $lang) : "3d764bfb-ebf1-4e17-b756-e819c1d8794c/title$lang"}>
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
               effect={{"effectType":"back"}}
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
   path="/help"
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
  </svelte:fragment>
  </LayoutShell>
</Route>
