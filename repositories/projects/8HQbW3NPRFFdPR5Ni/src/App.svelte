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
        <TextFormat
           interfaceFormat="none"
           contentFormat="headline-2"
        >
          <StaticText
             text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_artworks"] ? $translations[$lang]["$exhibition_artworks"] : "exhibition_artworks") : ($translations.en && $translations.en["$exhibition_artworks"] ? $translations.en["$exhibition_artworks"] : "…")}>
          </StaticText>
        </TextFormat>
        <TextFormat
           interfaceFormat="none"
           contentFormat="body-2"
        >
          <StaticText
             text={$lang ? ($translations[$lang] && $translations[$lang]["$open_artwork"] ? $translations[$lang]["$open_artwork"] : "open_artwork") : ($translations.en && $translations.en["$open_artwork"] ? $translations.en["$open_artwork"] : "…")}>
          </StaticText>
        </TextFormat>
        <AccordeonShell
        >
        <svelte:fragment slot="label">
          <Label
             type="icon"
             variant="normal"
             content={$lang ? ($translations[$lang] && $translations[$lang]["$about_exhibition"] ? $translations[$lang]["$about_exhibition"] : "about_exhibition") : "…"}   icon="Full-More"
          >
          </Label>
          <TextFormat
             interfaceFormat="none"
             contentFormat="body-2"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$about_exhibition"] ? $translations[$lang]["$about_exhibition"] : "about_exhibition") : ($translations.en && $translations.en["$about_exhibition"] ? $translations.en["$about_exhibition"] : "…")}>
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
                    label2Column="elements/label2"
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
        <TextFormat
           interfaceFormat="body-1"
           contentFormat="none"
        >
          <StaticText
             text={$lang ? ($translations[$lang] && $translations[$lang]["$landing_context"] ? $translations[$lang]["$landing_context"] : "landing_context") : ($translations.en && $translations.en["$landing_context"] ? $translations.en["$landing_context"] : "…")}>
          </StaticText>
        </TextFormat>
      </SectionShell>
      <SectionShell
      >
        <CenterModal
           size="large"
           imageKey="b910238c-edf8-499e-b187-6a7cef0912a6"
           label={$lang ? ($translations[$lang] && $translations[$lang]["$date"] ? $translations[$lang]["$date"] : "date") : "…"}   headline={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : "…"}   prompt={$lang ? ($translations[$lang] && $translations[$lang]["$app_context"] ? $translations[$lang]["$app_context"] : "app_context") : "…"}   >
        <svelte:fragment slot="buttons">
          <Button
             text={$lang ? ($translations[$lang] && $translations[$lang]["$discover_artworks"] ? $translations[$lang]["$discover_artworks"] : "discover_artworks") : ($translations.en && $translations.en["$discover_artworks"] ? $translations.en["$discover_artworks"] : "…")}   type="secondary"
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
                      headline={$lang ? ($translations[$lang] && $translations[$lang]["$enlarge_image"] ? $translations[$lang]["$enlarge_image"] : "enlarge_image") : "…"}   prompt={$lang ? ($translations[$lang] && $translations[$lang]["$tap_to_enlarge"] ? $translations[$lang]["$tap_to_enlarge"] : "tap_to_enlarge") : "…"}   >
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
        <svelte:fragment slot="else">
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
                   contentFormat="headline-5"
                >
                  <StaticText
                     text={$lang ? ($translations[$lang] && $translations[$lang]["$context"] ? $translations[$lang]["$context"] : "context") : ($translations.en && $translations.en["$context"] ? $translations.en["$context"] : "…")}>
                  </StaticText>
                </TextFormat>
                <AccordeonShell
                >
                <svelte:fragment slot="label">
                  <StaticText
                     text={$lang ? ($translations[$lang] && $translations[$lang]["$artwork_context"] ? $translations[$lang]["$artwork_context"] : "artwork_context") : ($translations.en && $translations.en["$artwork_context"] ? $translations.en["$artwork_context"] : "…")}>
                  </StaticText>
                </svelte:fragment>
                <svelte:fragment slot="content">
                  <DataCell
                     column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/e735b0c9-b3c8-4df8-8da6-b8d1101a56f2"
                     format="richText"
                     centerContent={false}
                  >
                  </DataCell>
                </svelte:fragment>
                </AccordeonShell>
                <AccordeonShell
                >
                <svelte:fragment slot="label">
                  <StaticText
                     text={$lang ? ($translations[$lang] && $translations[$lang]["$artist_context"] ? $translations[$lang]["$artist_context"] : "artist_context") : ($translations.en && $translations.en["$artist_context"] ? $translations.en["$artist_context"] : "…")}>
                  </StaticText>
                </svelte:fragment>
                <svelte:fragment slot="content">
                  <DataCell
                     column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/personID"
                     format="richText"
                     centerContent={false}
                  >
                  </DataCell>
                </svelte:fragment>
                </AccordeonShell>
                <AccordeonShell
                >
                <svelte:fragment slot="label">
                  <StaticText
                     text={$lang ? ($translations[$lang] && $translations[$lang]["$bird_context"] ? $translations[$lang]["$bird_context"] : "bird_context") : ($translations.en && $translations.en["$bird_context"] ? $translations.en["$bird_context"] : "…")}>
                  </StaticText>
                </svelte:fragment>
                <svelte:fragment slot="content">
                  <DataCell
                     column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/ad594afc-25f2-412f-843d-0cb3b5ce8739"
                     format="richText"
                     centerContent={false}
                  >
                  </DataCell>
                </svelte:fragment>
                </AccordeonShell>
              </svelte:fragment>
              </DataCard>
            </Spacing>
            <SectionShell
            >
              <Spacing
                 top="m"
                       >
                <Button
                   text={$lang ? ($translations[$lang] && $translations[$lang]["$download_metadata"] ? $translations[$lang]["$download_metadata"] : "download_metadata") : ($translations.en && $translations.en["$download_metadata"] ? $translations.en["$download_metadata"] : "…")}   type="secondary"
                   size="small"
                   flex="normal"
                   disabled={false}
                      effect={{"effectType":"link","url":"static/exports/mgk-fuer-die-voegel-metadata-v1.csv"}}
                >
                </Button>
              </Spacing>
            </SectionShell>
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
            <TextFormat
               interfaceFormat="body-1"
               contentFormat="none"
            >
              <StaticText
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$landing_context"] ? $translations[$lang]["$landing_context"] : "landing_context") : ($translations.en && $translations.en["$landing_context"] ? $translations.en["$landing_context"] : "…")}>
              </StaticText>
            </TextFormat>
          </SectionShell>
          <SectionShell
          >
            <CenterModal
               size="large"
               imageKey="b910238c-edf8-499e-b187-6a7cef0912a6"
               label={$lang ? ($translations[$lang] && $translations[$lang]["$date"] ? $translations[$lang]["$date"] : "date") : "…"}   headline={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_title"] ? $translations[$lang]["$exhibition_title"] : "exhibition_title") : "…"}   prompt={$lang ? ($translations[$lang] && $translations[$lang]["$app_context"] ? $translations[$lang]["$app_context"] : "app_context") : "…"}   >
            <svelte:fragment slot="buttons">
              <Button
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$discover_artworks"] ? $translations[$lang]["$discover_artworks"] : "discover_artworks") : ($translations.en && $translations.en["$discover_artworks"] ? $translations.en["$discover_artworks"] : "…")}   type="secondary"
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
            <TextFormat
               interfaceFormat="none"
               contentFormat="headline-2"
            >
              <StaticText
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$exhibition_artworks"] ? $translations[$lang]["$exhibition_artworks"] : "exhibition_artworks") : ($translations.en && $translations.en["$exhibition_artworks"] ? $translations.en["$exhibition_artworks"] : "…")}>
              </StaticText>
            </TextFormat>
            <TextFormat
               interfaceFormat="none"
               contentFormat="body-2"
            >
              <StaticText
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$open_artwork"] ? $translations[$lang]["$open_artwork"] : "open_artwork") : ($translations.en && $translations.en["$open_artwork"] ? $translations.en["$open_artwork"] : "…")}>
              </StaticText>
            </TextFormat>
            <AccordeonShell
            >
            <svelte:fragment slot="label">
              <Label
                 type="icon"
                 variant="normal"
                 content={$lang ? ($translations[$lang] && $translations[$lang]["$about_exhibition"] ? $translations[$lang]["$about_exhibition"] : "about_exhibition") : "…"}   icon="Full-More"
              >
              </Label>
              <TextFormat
                 interfaceFormat="none"
                 contentFormat="body-2"
              >
                <StaticText
                   text={$lang ? ($translations[$lang] && $translations[$lang]["$about_exhibition"] ? $translations[$lang]["$about_exhibition"] : "about_exhibition") : ($translations.en && $translations.en["$about_exhibition"] ? $translations.en["$about_exhibition"] : "…")}>
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
                        label2Column="elements/label2"
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
                          headline={$lang ? ($translations[$lang] && $translations[$lang]["$enlarge_image"] ? $translations[$lang]["$enlarge_image"] : "enlarge_image") : "…"}   prompt={$lang ? ($translations[$lang] && $translations[$lang]["$tap_to_enlarge"] ? $translations[$lang]["$tap_to_enlarge"] : "tap_to_enlarge") : "…"}   >
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
            <svelte:fragment slot="else">
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
                       contentFormat="headline-5"
                    >
                      <StaticText
                         text={$lang ? ($translations[$lang] && $translations[$lang]["$context"] ? $translations[$lang]["$context"] : "context") : ($translations.en && $translations.en["$context"] ? $translations.en["$context"] : "…")}>
                      </StaticText>
                    </TextFormat>
                    <AccordeonShell
                    >
                    <svelte:fragment slot="label">
                      <StaticText
                         text={$lang ? ($translations[$lang] && $translations[$lang]["$artwork_context"] ? $translations[$lang]["$artwork_context"] : "artwork_context") : ($translations.en && $translations.en["$artwork_context"] ? $translations.en["$artwork_context"] : "…")}>
                      </StaticText>
                    </svelte:fragment>
                    <svelte:fragment slot="content">
                      <DataCell
                         column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/e735b0c9-b3c8-4df8-8da6-b8d1101a56f2"
                         format="richText"
                         centerContent={false}
                      >
                      </DataCell>
                    </svelte:fragment>
                    </AccordeonShell>
                    <AccordeonShell
                    >
                    <svelte:fragment slot="label">
                      <StaticText
                         text={$lang ? ($translations[$lang] && $translations[$lang]["$artist_context"] ? $translations[$lang]["$artist_context"] : "artist_context") : ($translations.en && $translations.en["$artist_context"] ? $translations.en["$artist_context"] : "…")}>
                      </StaticText>
                    </svelte:fragment>
                    <svelte:fragment slot="content">
                      <DataCell
                         column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/personID"
                         format="richText"
                         centerContent={false}
                      >
                      </DataCell>
                    </svelte:fragment>
                    </AccordeonShell>
                    <AccordeonShell
                    >
                    <svelte:fragment slot="label">
                      <StaticText
                         text={$lang ? ($translations[$lang] && $translations[$lang]["$bird_context"] ? $translations[$lang]["$bird_context"] : "bird_context") : ($translations.en && $translations.en["$bird_context"] ? $translations.en["$bird_context"] : "…")}>
                      </StaticText>
                    </svelte:fragment>
                    <svelte:fragment slot="content">
                      <DataCell
                         column="3d764bfb-ebf1-4e17-b756-e819c1d8794c/ad594afc-25f2-412f-843d-0cb3b5ce8739"
                         format="richText"
                         centerContent={false}
                      >
                      </DataCell>
                    </svelte:fragment>
                    </AccordeonShell>
                  </svelte:fragment>
                  </DataCard>
                </Spacing>
                <SectionShell
                >
                  <Spacing
                     top="m"
                           >
                    <Button
                       text={$lang ? ($translations[$lang] && $translations[$lang]["$download_metadata"] ? $translations[$lang]["$download_metadata"] : "download_metadata") : ($translations.en && $translations.en["$download_metadata"] ? $translations.en["$download_metadata"] : "…")}   type="secondary"
                       size="small"
                       flex="normal"
                       disabled={false}
                          effect={{"effectType":"link","url":"static/exports/mgk-fuer-die-voegel-metadata-v1.csv"}}
                    >
                    </Button>
                  </Spacing>
                </SectionShell>
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
