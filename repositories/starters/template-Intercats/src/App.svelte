<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AppBase from "interkit/components/AppBase.svelte";
import AudioPlayer from "interkit/components/AudioPlayer.svelte";
import Button from "interkit/components/Button.svelte";
import ButtonBar from "interkit/components/ButtonBar.svelte";
import DataCard from "interkit/components/DataCard.svelte";
import DataCarousel from "interkit/components/DataCarousel.svelte";
import DataCell from "interkit/components/DataCell.svelte";
import DataLoaderMulti from "interkit/components/DataLoaderMulti.svelte";
import DataLoaderSingle from "interkit/components/DataLoaderSingle.svelte";
import DataRouteSingle from "interkit/components/DataRouteSingle.svelte";
import DataTile from "interkit/components/DataTile.svelte";
import HorizontalSpacer from "interkit/components/HorizontalSpacer.svelte";
import Icon from "interkit/components/Icon.svelte";
import Image from "interkit/components/Image.svelte";
import LayoutShell from "interkit/components/LayoutShell.svelte";
import LayoutShellAudio from "interkit/components/LayoutShellAudio.svelte";
import ListItem from "interkit/components/ListItem.svelte";
import Mosaic from "interkit/components/Mosaic.svelte";
import NavBar from "interkit/components/NavBar.svelte";
import NavButton from "interkit/components/NavButton.svelte";
import PopoutAudioButton from "interkit/components/PopoutAudioButton.svelte";
import QRScanner from "interkit/components/QRScanner.svelte";
import Route from "interkit/components/Route.svelte";
import ScrollContainer from "interkit/components/ScrollContainer.svelte";
import SectionShell from "interkit/components/SectionShell.svelte";
import Spacing from "interkit/components/Spacing.svelte";
import StaticText from "interkit/components/StaticText.svelte";
import Styling from "interkit/components/Styling.svelte";
import TextFormat from "interkit/components/TextFormat.svelte";
import styleTokens from "./styleTokens.json";
globalThis.styleTokens = styleTokens;
console.log('AppBase styleTokens', styleTokens);
initActions();
$: $translations, translations, t, $lang, lang, console.log('AppBase i18n $', { t, $translations, translations, $lang, lang });
console.log('AppBase i18n', { t, $translations, translations, $lang, lang });
</script>

<AppBase
   languages="de"
>
  <Route
     path="/"
     keepAlive={false}
  >
    <LayoutShellAudio
    >
    <svelte:fragment slot="TopBar">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
          <TextFormat
             interfaceFormat="headline-2"
             contentFormat="headline-2"
          >
            <StaticText
               text="InterCats"
            >
            </StaticText>
          </TextFormat>
        </svelte:fragment>
        <svelte:fragment slot="center">
        </svelte:fragment>
        <svelte:fragment slot="right">
          <Button
                type="link"
             size="small"
             flex="normal"
             disabled={false}
             effect={{"effectType":"route","path":"/Menu"}}
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
      <ScrollContainer
      >
        <SectionShell
        >
          <DataLoaderSingle
             sheet="d7d9c91b-84b3-47c2-bb24-4e87f5f7b78a"
             rowKey="6d1526da-fcad-46de-94fb-7f1c140530dd"
             >
            <DataCell
               column="d7d9c91b-84b3-47c2-bb24-4e87f5f7b78a/9ee9e589-e773-4433-a6f5-b5a3789e1177"
               format="richText"
               centerContent={false}
            >
            </DataCell>
          </DataLoaderSingle>
        </SectionShell>
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
        </svelte:fragment>
        <svelte:fragment slot="center">
          <DataLoaderMulti
             sheetKey="b41a4cc0-7b84-43f6-9733-a552dddd4d26"
                         discoverableColumn="elements/discoverable"
             discoverAnnotation="discovered"
             >
            <DataCarousel
               mode="continuous"
               roundedCorners={false}
               background={false}
               gaps={true}
            >
            <svelte:fragment slot="contentElement">
              <Button
                    type="secondary"
                 size="small"
                 flex="normal"
                 disabled={false}
                 effect={{"effectType":"dataRouteSingle","path":"/Filter"}}
              >
                <DataCell
                   column="b41a4cc0-7b84-43f6-9733-a552dddd4d26/fb85a6fe-3e1d-49ee-b886-e67c1208d0ac"
                   format="string"
                   centerContent={false}
                >
                </DataCell>
              </Button>
            </svelte:fragment>
            <svelte:fragment slot="emptyElement">
            </svelte:fragment>
            </DataCarousel>
          </DataLoaderMulti>
        </svelte:fragment>
        <svelte:fragment slot="right">
        </svelte:fragment>
        </HorizontalSpacer>
        <Spacing
           top="s"
           right="s"
           bottom="s"
           left="s"
        >
          <DataLoaderMulti
             sheetKey="elements"
             sortColumn="elements/a40f7dc6-7431-4abb-beca-18bc35ceee64"
                      discoverableColumn="elements/discoverable"
             discoverAnnotation="discovered"
             >
            <Mosaic
               gap={true}
            >
            <svelte:fragment slot="contentElement">
              <DataTile
                 imageColumn="elements/eb7d204d-67fc-4491-9a8c-e8cc0dabb2b6"
                 headlineColumn="elements/empty"
                 label1Column="elements/empty"
                 subtitle1Column="elements/subtitle1"
                 descriptionColumn="elements/empty"
                 rightArrow={false}
                 disabled={false}
                 variant="square"
                 flexibleSize={true}
                 effect={{"effectType":"dataRouteSingle","path":"/Werke"}}
              >
              <svelte:fragment slot="chips">
              </svelte:fragment>
              <svelte:fragment slot="buttons">
              </svelte:fragment>
              </DataTile>
            </svelte:fragment>
            <svelte:fragment slot="emptyElement">
            </svelte:fragment>
            </Mosaic>
          </DataLoaderMulti>
        </Spacing>
      </ScrollContainer>
    </svelte:fragment>
    <svelte:fragment slot="Player">
        <AudioPlayer
           audioColumn="elements/0d2776e9-9338-48dd-b750-49ba6cbf95b8"
           titleColumn="elements/title"
        >
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
             effect={{"effectType":"route","path":"/Saalplan"}}
          >
            <Icon
               type="Thin-Map"
               inverse={false}
            >
            </Icon>
          </NavButton>
          <NavButton
                disabled={false}
             effect={{"effectType":"route","path":"/QR"}}
          >
            <Icon
               type="Thin-QR-Scan"
               inverse={false}
            >
            </Icon>
          </NavButton>
        </NavBar>
    </svelte:fragment>
    </LayoutShellAudio>
  </Route>
  <Route
     path="/Saalplan"
     keepAlive={false}
  >
    <LayoutShellAudio
    >
    <svelte:fragment slot="TopBar">
      <HorizontalSpacer
      >
      <svelte:fragment slot="left">
      </svelte:fragment>
      <svelte:fragment slot="center">
        <TextFormat
           interfaceFormat="none"
           contentFormat="headline-3"
        >
          <StaticText
             text="Saalplan"
          >
          </StaticText>
        </TextFormat>
      </svelte:fragment>
      <svelte:fragment slot="right">
      </svelte:fragment>
      </HorizontalSpacer>
    </svelte:fragment>
    <svelte:fragment slot="Content">
      <ScrollContainer
      >
        <Spacing
           top="m"
                 >
          <Image
             mediafileKey="baa6c74c-0430-4457-a451-7c7e04c0a4a0"
                      width="100%"
                   >
          </Image>
          <DataLoaderMulti
             sheetKey="elements"
             sortColumn="elements/a40f7dc6-7431-4abb-beca-18bc35ceee64"
                      discoverableColumn="elements/discoverable"
             discoverAnnotation="discovered"
             >
            <Spacing
               top="m"
               right="s"
                  left="s"
            >
              <Mosaic
                 >
              <svelte:fragment slot="contentElement">
                <Styling
                   styleTokens={{"colorText":"#000000","colorTextStrong":"#000000","colorTextSoft":"#4C4C4C","colorTextLink":"#2D40A1","colorBackground":"#FFFFFF","colorBackgroundHighlight":"#E5E5E5","colorBackgroundBackdrop":"#F2F2F2","colorBorder":"#999999","colorDummyAsset":"#FFDBD3","colorTextButtonPressed":"#000000","colorBackgroundButtonPressed":"#B2B2B2","colorTextButtonDanger":"#000000","colorBackgroundButtonDanger":"#FF6A49","colorBackgroundButtonDangerPressed":"#FFA996","colorTextButtonPrimary":"#FFFFFF","colorTextButtonPrimaryPressed":"#FFFFFF","colorBackgroundButtonPrimary":"#000000","colorBackgroundButtonPrimaryPressed":"#4C4C4C","colorBorderButtonPrimary":"#000000","colorBorderButtonPrimaryPressed":"#000000","colorBackgroundLabel1":"#ffffff","colorTextLabel1":"#000000","colorBackgroundChatMe":"#FFFFFF","colorBackgroundChatOther":"#F2F2F2","colorPagination":"#000000","borderWidth":"1px","borderRadius":"1rem","borderRadiusButton":"1rem","borderRadiusLabel":"0.5rem","boxShadow":"0 0 1px rgba(0, 0, 0, 0.5)","googleFont":"Inter:wght@400;500;600;700;900","googleFont2":"Inter:wght@400;500;600;700;900","fontFamilyInterface":"Inter, sans-serif","fontFamilyContent":"Inter, sans-serif","fontHeadline1":"400 3rem/3.5rem var(--font-family-interface)","fontHeadline2":"400 1.875rem/2.25rem var(--font-family-interface)","fontHeadline3":"400 1.5rem/1.75rem var(--font-family-interface)","fontHeadline4":"400 1.25rem/1.5rem var(--font-family-interface)","fontHeadline5":"700 1rem/1.5rem var(--font-family-interface)","fontBody1":"400 1rem/1.5rem var(--font-family-interface)","fontBody2":"400 0.875rem/1.3125rem var(--font-family-interface)","fontSubtitle1":"400 1rem/1.3125rem var(--font-family-interface)","fontSubtitle2":"500 0.875rem/1.125rem var(--font-family-interface)","fontButton":"600 0.75rem/1rem var(--font-family-interface)","fontCaption":"400 0.75rem/1rem var(--font-family-interface)","fontCaptionBold":"700 0.75rem/1rem var(--font-family-interface)","fontOverline":"500 0.625rem/0.75rem var(--font-family-interface)","fontContentHeadline1":"900 3rem/3.5rem var(--font-family-content)","fontContentHeadline2":"900 1.875rem/2.25rem var(--font-family-content)","fontContentHeadline3":"900 1.5rem/1.75rem var(--font-family-content)","fontContentHeadline4":"900 1.25rem/1.5rem var(--font-family-content)","fontContentHeadline5":"700 1rem/1.5rem var(--font-family-content)","fontContentBody1":"400 1rem/1.5rem var(--font-family-content)","fontContentBody2":"400 0.875rem/1.5rem var(--font-family-content)","letterSpacingHeadline1":"0","letterSpacingHeadline2":"-0.03125rem","letterSpacingHeadline3":"-0.015625rem","letterSpacingHeadline4":"-0.015625rem","letterSpacingHeadline5":"0","letterSpacingBody1":"0.015625rem","letterSpacingBody2":"0.015625rem","letterSpacingSubtitle1":"0.009375rem","letterSpacingSubtitle2":"0.00625rem","letterSpacingButton":"0","letterSpacingCaption":"0","letterSpacingCaptionBold":"0","letterSpacingOverline":"0","letterSpacingContentHeadline1":"-0.0625rem","letterSpacingContentHeadline2":"-0.03125rem","letterSpacingContentHeadline3":"-0.03125rem","letterSpacingContentHeadline4":"0","letterSpacingContentHeadline5":"-0.02rem","letterSpacingContentBody1":"-0.015625rem","letterSpacingContentBody2":"0","scale":1,"distanceScaleFactor":1,"inset":"var(--distance-scale-factor)","insetX":"var(--inset)","insetY":"var(--inset)","outsetX":"var(--distance-scale-factor)","outsetY":"var(--distance-scale-factor)"}}
                >
                  <DataTile
                     imageColumn="elements/eb7d204d-67fc-4491-9a8c-e8cc0dabb2b6"
                     headlineColumn="elements/empty"
                     label1Column="elements/a40f7dc6-7431-4abb-beca-18bc35ceee64"
                     subtitle1Column="elements/subtitle1"
                     descriptionColumn="elements/empty"
                     rightArrow={false}
                     disabled={false}
                     variant="square"
                     flexibleSize={true}
                     effect={{"effectType":"dataRouteSingle","path":"/Werke"}}
                  >
                  <svelte:fragment slot="chips">
                  </svelte:fragment>
                  <svelte:fragment slot="buttons">
                  </svelte:fragment>
                  </DataTile>
                </Styling>
              </svelte:fragment>
              <svelte:fragment slot="emptyElement">
              </svelte:fragment>
              </Mosaic>
            </Spacing>
          </DataLoaderMulti>
        </Spacing>
      </ScrollContainer>
    </svelte:fragment>
    <svelte:fragment slot="Player">
        <AudioPlayer
           audioColumn="elements/0d2776e9-9338-48dd-b750-49ba6cbf95b8"
           titleColumn="elements/title"
        >
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
             effect={{"effectType":"route","path":"/Saalplan"}}
          >
            <Icon
               type="Thin-Map"
               inverse={false}
            >
            </Icon>
          </NavButton>
          <NavButton
                disabled={false}
             effect={{"effectType":"route","path":"/QR"}}
          >
            <Icon
               type="Thin-QR-Scan"
               inverse={false}
            >
            </Icon>
          </NavButton>
        </NavBar>
    </svelte:fragment>
    </LayoutShellAudio>
  </Route>
  <Route
     path="/QR"
     keepAlive={false}
  >
    <QRScanner
       elementKeyColumn="elements/c7aa516d-0671-4492-a518-dda924e9a34f"
       closeEffect={{"effectType":"route","path":"/"}}
       scanEffect={{"effectType":"dataRouteSingle","path":"/Werke"}}
    >
    </QRScanner>
  </Route>
  <Route
     path="/Menu"
     keepAlive={false}
  >
    <LayoutShell
    >
    <svelte:fragment slot="TopBar">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
          <Button
                type="link"
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
      <ScrollContainer
      >
        <ListItem
           text="Über InterCats"
           effect={{"effectType":"route","path":"/Intercats"}}
        >
        </ListItem>
        <ListItem
           text="Über CatMuseum"
           effect={{"effectType":"route","path":"/Catmuseum"}}
        >
        </ListItem>
        <ListItem
           text="Impressum"
           effect={{"effectType":"route","path":"/Impressum"}}
        >
        </ListItem>
      </ScrollContainer>
    </svelte:fragment>
    <svelte:fragment slot="BottomBar">
    </svelte:fragment>
    </LayoutShell>
  </Route>
  <Route
     path="/Intercats"
     keepAlive={false}
  >
    <LayoutShell
    >
    <svelte:fragment slot="TopBar">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
          <Button
                type="link"
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
      <Spacing
         top="m"
         right="m"
         bottom="m"
         left="m"
      >
        <DataLoaderSingle
           sheet="d7d9c91b-84b3-47c2-bb24-4e87f5f7b78a"
           rowKey="f329c416-178c-477c-8b20-5ee60528725d"
           >
          <DataCell
             column="d7d9c91b-84b3-47c2-bb24-4e87f5f7b78a/9ee9e589-e773-4433-a6f5-b5a3789e1177"
             format="richText"
             centerContent={false}
          >
          </DataCell>
        </DataLoaderSingle>
      </Spacing>
    </svelte:fragment>
    <svelte:fragment slot="BottomBar">
    </svelte:fragment>
    </LayoutShell>
  </Route>
  <Route
     path="/Catmuseum"
     keepAlive={false}
  >
    <LayoutShell
    >
    <svelte:fragment slot="TopBar">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
          <Button
                type="link"
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
      <Spacing
         top="m"
         right="m"
         bottom="m"
         left="m"
      >
        <DataLoaderSingle
           sheet="d7d9c91b-84b3-47c2-bb24-4e87f5f7b78a"
           rowKey="5e694b2e-8bc8-4b06-a73a-8d45711e0b27"
           >
          <DataCell
             column="d7d9c91b-84b3-47c2-bb24-4e87f5f7b78a/9ee9e589-e773-4433-a6f5-b5a3789e1177"
             format="richText"
             centerContent={false}
          >
          </DataCell>
        </DataLoaderSingle>
      </Spacing>
    </svelte:fragment>
    <svelte:fragment slot="BottomBar">
    </svelte:fragment>
    </LayoutShell>
  </Route>
  <Route
     path="/Impressum"
     keepAlive={false}
  >
    <LayoutShell
    >
    <svelte:fragment slot="TopBar">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
          <Button
                type="link"
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
      <Spacing
         top="m"
         right="m"
         bottom="m"
         left="m"
      >
        <DataLoaderSingle
           sheet="d7d9c91b-84b3-47c2-bb24-4e87f5f7b78a"
           rowKey="8580cab7-7be2-422a-a0fb-b6f430ed86cd"
           >
          <DataCell
             column="d7d9c91b-84b3-47c2-bb24-4e87f5f7b78a/9ee9e589-e773-4433-a6f5-b5a3789e1177"
             format="richText"
             centerContent={false}
          >
          </DataCell>
        </DataLoaderSingle>
      </Spacing>
    </svelte:fragment>
    <svelte:fragment slot="BottomBar">
    </svelte:fragment>
    </LayoutShell>
  </Route>
  <DataRouteSingle
     path="/Werke"
     sheet="elements"
  >
    <LayoutShellAudio
    >
    <svelte:fragment slot="TopBar">
        <HorizontalSpacer
        >
        <svelte:fragment slot="left">
          <Button
                type="link"
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
      <ScrollContainer
      >
        <DataLoaderMulti
           sheetKey="elements"
                       discoverableColumn="elements/discoverable"
           discoverAnnotation="discovered"
           >
          <DataCard
             variant="full"
                effect={undefined}
             imageColumn="elements/image"
             headlineColumn="elements/title"
             label1Column="elements/empty"
             subtitle1Column="elements/empty"
             label2Column="elements/empty"
             subtitle2Column="elements/empty"
             label3Column="elements/empty"
             subtitle3Column="elements/supertext"
             descriptionColumn="elements/empty"
          >
          <svelte:fragment slot="chips">
          </svelte:fragment>
          <svelte:fragment slot="content">
            <Spacing
                     bottom="s"
               left="m"
            >
              <ButtonBar
                 justify="left"
                 >
                <PopoutAudioButton
                   audioColumn="elements/0d2776e9-9338-48dd-b750-49ba6cbf95b8"
                   buttonOptions={{"text":"","type":"secondary","size":"medium","flex":"normal"}}
                >
                </PopoutAudioButton>
              </ButtonBar>
            </Spacing>
            <DataCell
               column="elements/description"
               format="richText"
               centerContent={false}
            >
            </DataCell>
          </svelte:fragment>
          </DataCard>
        </DataLoaderMulti>
      </ScrollContainer>
    </svelte:fragment>
    <svelte:fragment slot="Player">
        <AudioPlayer
           audioColumn="elements/0d2776e9-9338-48dd-b750-49ba6cbf95b8"
           titleColumn="elements/title"
        >
        </AudioPlayer>
    </svelte:fragment>
    <svelte:fragment slot="BottomBar">
    </svelte:fragment>
    </LayoutShellAudio>
  </DataRouteSingle>
  <DataRouteSingle
     path="/Filter"
     sheet="b41a4cc0-7b84-43f6-9733-a552dddd4d26"
  >
    <LayoutShellAudio
    >
    <svelte:fragment slot="TopBar">
      <HorizontalSpacer
      >
      <svelte:fragment slot="left">
        <Button
              type="link"
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
        <TextFormat
           interfaceFormat="none"
           contentFormat="headline-3"
        >
          <DataCell
             column="b41a4cc0-7b84-43f6-9733-a552dddd4d26/fb85a6fe-3e1d-49ee-b886-e67c1208d0ac"
             format="string"
             centerContent={false}
          >
          </DataCell>
        </TextFormat>
      </svelte:fragment>
      <svelte:fragment slot="right">
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
          <DataLoaderMulti
             sheetKey="elements"
             sortColumn="elements/a40f7dc6-7431-4abb-beca-18bc35ceee64"
             hideColumn="elements/empty"
                   discoverableColumn="elements/discoverable"
             discoverAnnotation="discovered"
             referenceColumn="elements/622dcc7c-1275-4de2-94c8-e0dbb812bd62"
          >
            <Mosaic
               >
            <svelte:fragment slot="contentElement">
              <DataTile
                 imageColumn="elements/eb7d204d-67fc-4491-9a8c-e8cc0dabb2b6"
                 headlineColumn="elements/empty"
                 label1Column="elements/empty"
                 subtitle1Column="elements/subtitle1"
                 descriptionColumn="elements/empty"
                 rightArrow={false}
                 disabled={false}
                 variant="square"
                 flexibleSize={true}
                 effect={{"effectType":"dataRouteSingle","path":"/Werke"}}
              >
              <svelte:fragment slot="chips">
              </svelte:fragment>
              <svelte:fragment slot="buttons">
              </svelte:fragment>
              </DataTile>
            </svelte:fragment>
            <svelte:fragment slot="emptyElement">
            </svelte:fragment>
            </Mosaic>
          </DataLoaderMulti>
        </Spacing>
      </ScrollContainer>
    </svelte:fragment>
    <svelte:fragment slot="Player">
        <AudioPlayer
           audioColumn="elements/0d2776e9-9338-48dd-b750-49ba6cbf95b8"
           titleColumn="elements/title"
        >
        </AudioPlayer>
    </svelte:fragment>
    <svelte:fragment slot="BottomBar">
    </svelte:fragment>
    </LayoutShellAudio>
  </DataRouteSingle>
</AppBase>

<Route
   path="/"
   keepAlive={false}
>
  <LayoutShellAudio
  >
  <svelte:fragment slot="TopBar">
      <HorizontalSpacer
      >
      <svelte:fragment slot="left">
        <TextFormat
           interfaceFormat="headline-2"
           contentFormat="headline-2"
        >
          <StaticText
             text="InterCats"
          >
          </StaticText>
        </TextFormat>
      </svelte:fragment>
      <svelte:fragment slot="center">
      </svelte:fragment>
      <svelte:fragment slot="right">
        <Button
              type="link"
           size="small"
           flex="normal"
           disabled={false}
           effect={{"effectType":"route","path":"/Menu"}}
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
    <ScrollContainer
    >
      <SectionShell
      >
        <DataLoaderSingle
           sheet="d7d9c91b-84b3-47c2-bb24-4e87f5f7b78a"
           rowKey="6d1526da-fcad-46de-94fb-7f1c140530dd"
           >
          <DataCell
             column="d7d9c91b-84b3-47c2-bb24-4e87f5f7b78a/9ee9e589-e773-4433-a6f5-b5a3789e1177"
             format="richText"
             centerContent={false}
          >
          </DataCell>
        </DataLoaderSingle>
      </SectionShell>
      <HorizontalSpacer
      >
      <svelte:fragment slot="left">
      </svelte:fragment>
      <svelte:fragment slot="center">
        <DataLoaderMulti
           sheetKey="b41a4cc0-7b84-43f6-9733-a552dddd4d26"
                       discoverableColumn="elements/discoverable"
           discoverAnnotation="discovered"
           >
          <DataCarousel
             mode="continuous"
             roundedCorners={false}
             background={false}
             gaps={true}
          >
          <svelte:fragment slot="contentElement">
            <Button
                  type="secondary"
               size="small"
               flex="normal"
               disabled={false}
               effect={{"effectType":"dataRouteSingle","path":"/Filter"}}
            >
              <DataCell
                 column="b41a4cc0-7b84-43f6-9733-a552dddd4d26/fb85a6fe-3e1d-49ee-b886-e67c1208d0ac"
                 format="string"
                 centerContent={false}
              >
              </DataCell>
            </Button>
          </svelte:fragment>
          <svelte:fragment slot="emptyElement">
          </svelte:fragment>
          </DataCarousel>
        </DataLoaderMulti>
      </svelte:fragment>
      <svelte:fragment slot="right">
      </svelte:fragment>
      </HorizontalSpacer>
      <Spacing
         top="s"
         right="s"
         bottom="s"
         left="s"
      >
        <DataLoaderMulti
           sheetKey="elements"
           sortColumn="elements/a40f7dc6-7431-4abb-beca-18bc35ceee64"
                    discoverableColumn="elements/discoverable"
           discoverAnnotation="discovered"
           >
          <Mosaic
             gap={true}
          >
          <svelte:fragment slot="contentElement">
            <DataTile
               imageColumn="elements/eb7d204d-67fc-4491-9a8c-e8cc0dabb2b6"
               headlineColumn="elements/empty"
               label1Column="elements/empty"
               subtitle1Column="elements/subtitle1"
               descriptionColumn="elements/empty"
               rightArrow={false}
               disabled={false}
               variant="square"
               flexibleSize={true}
               effect={{"effectType":"dataRouteSingle","path":"/Werke"}}
            >
            <svelte:fragment slot="chips">
            </svelte:fragment>
            <svelte:fragment slot="buttons">
            </svelte:fragment>
            </DataTile>
          </svelte:fragment>
          <svelte:fragment slot="emptyElement">
          </svelte:fragment>
          </Mosaic>
        </DataLoaderMulti>
      </Spacing>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="Player">
      <AudioPlayer
         audioColumn="elements/0d2776e9-9338-48dd-b750-49ba6cbf95b8"
         titleColumn="elements/title"
      >
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
           effect={{"effectType":"route","path":"/Saalplan"}}
        >
          <Icon
             type="Thin-Map"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
              disabled={false}
           effect={{"effectType":"route","path":"/QR"}}
        >
          <Icon
             type="Thin-QR-Scan"
             inverse={false}
          >
          </Icon>
        </NavButton>
      </NavBar>
  </svelte:fragment>
  </LayoutShellAudio>
</Route>

<Route
   path="/Saalplan"
   keepAlive={false}
>
  <LayoutShellAudio
  >
  <svelte:fragment slot="TopBar">
    <HorizontalSpacer
    >
    <svelte:fragment slot="left">
    </svelte:fragment>
    <svelte:fragment slot="center">
      <TextFormat
         interfaceFormat="none"
         contentFormat="headline-3"
      >
        <StaticText
           text="Saalplan"
        >
        </StaticText>
      </TextFormat>
    </svelte:fragment>
    <svelte:fragment slot="right">
    </svelte:fragment>
    </HorizontalSpacer>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <ScrollContainer
    >
      <Spacing
         top="m"
               >
        <Image
           mediafileKey="baa6c74c-0430-4457-a451-7c7e04c0a4a0"
                    width="100%"
                 >
        </Image>
        <DataLoaderMulti
           sheetKey="elements"
           sortColumn="elements/a40f7dc6-7431-4abb-beca-18bc35ceee64"
                    discoverableColumn="elements/discoverable"
           discoverAnnotation="discovered"
           >
          <Spacing
             top="m"
             right="s"
                left="s"
          >
            <Mosaic
               >
            <svelte:fragment slot="contentElement">
              <Styling
                 styleTokens={{"colorText":"#000000","colorTextStrong":"#000000","colorTextSoft":"#4C4C4C","colorTextLink":"#2D40A1","colorBackground":"#FFFFFF","colorBackgroundHighlight":"#E5E5E5","colorBackgroundBackdrop":"#F2F2F2","colorBorder":"#999999","colorDummyAsset":"#FFDBD3","colorTextButtonPressed":"#000000","colorBackgroundButtonPressed":"#B2B2B2","colorTextButtonDanger":"#000000","colorBackgroundButtonDanger":"#FF6A49","colorBackgroundButtonDangerPressed":"#FFA996","colorTextButtonPrimary":"#FFFFFF","colorTextButtonPrimaryPressed":"#FFFFFF","colorBackgroundButtonPrimary":"#000000","colorBackgroundButtonPrimaryPressed":"#4C4C4C","colorBorderButtonPrimary":"#000000","colorBorderButtonPrimaryPressed":"#000000","colorBackgroundLabel1":"#ffffff","colorTextLabel1":"#000000","colorBackgroundChatMe":"#FFFFFF","colorBackgroundChatOther":"#F2F2F2","colorPagination":"#000000","borderWidth":"1px","borderRadius":"1rem","borderRadiusButton":"1rem","borderRadiusLabel":"0.5rem","boxShadow":"0 0 1px rgba(0, 0, 0, 0.5)","googleFont":"Inter:wght@400;500;600;700;900","googleFont2":"Inter:wght@400;500;600;700;900","fontFamilyInterface":"Inter, sans-serif","fontFamilyContent":"Inter, sans-serif","fontHeadline1":"400 3rem/3.5rem var(--font-family-interface)","fontHeadline2":"400 1.875rem/2.25rem var(--font-family-interface)","fontHeadline3":"400 1.5rem/1.75rem var(--font-family-interface)","fontHeadline4":"400 1.25rem/1.5rem var(--font-family-interface)","fontHeadline5":"700 1rem/1.5rem var(--font-family-interface)","fontBody1":"400 1rem/1.5rem var(--font-family-interface)","fontBody2":"400 0.875rem/1.3125rem var(--font-family-interface)","fontSubtitle1":"400 1rem/1.3125rem var(--font-family-interface)","fontSubtitle2":"500 0.875rem/1.125rem var(--font-family-interface)","fontButton":"600 0.75rem/1rem var(--font-family-interface)","fontCaption":"400 0.75rem/1rem var(--font-family-interface)","fontCaptionBold":"700 0.75rem/1rem var(--font-family-interface)","fontOverline":"500 0.625rem/0.75rem var(--font-family-interface)","fontContentHeadline1":"900 3rem/3.5rem var(--font-family-content)","fontContentHeadline2":"900 1.875rem/2.25rem var(--font-family-content)","fontContentHeadline3":"900 1.5rem/1.75rem var(--font-family-content)","fontContentHeadline4":"900 1.25rem/1.5rem var(--font-family-content)","fontContentHeadline5":"700 1rem/1.5rem var(--font-family-content)","fontContentBody1":"400 1rem/1.5rem var(--font-family-content)","fontContentBody2":"400 0.875rem/1.5rem var(--font-family-content)","letterSpacingHeadline1":"0","letterSpacingHeadline2":"-0.03125rem","letterSpacingHeadline3":"-0.015625rem","letterSpacingHeadline4":"-0.015625rem","letterSpacingHeadline5":"0","letterSpacingBody1":"0.015625rem","letterSpacingBody2":"0.015625rem","letterSpacingSubtitle1":"0.009375rem","letterSpacingSubtitle2":"0.00625rem","letterSpacingButton":"0","letterSpacingCaption":"0","letterSpacingCaptionBold":"0","letterSpacingOverline":"0","letterSpacingContentHeadline1":"-0.0625rem","letterSpacingContentHeadline2":"-0.03125rem","letterSpacingContentHeadline3":"-0.03125rem","letterSpacingContentHeadline4":"0","letterSpacingContentHeadline5":"-0.02rem","letterSpacingContentBody1":"-0.015625rem","letterSpacingContentBody2":"0","scale":1,"distanceScaleFactor":1,"inset":"var(--distance-scale-factor)","insetX":"var(--inset)","insetY":"var(--inset)","outsetX":"var(--distance-scale-factor)","outsetY":"var(--distance-scale-factor)"}}
              >
                <DataTile
                   imageColumn="elements/eb7d204d-67fc-4491-9a8c-e8cc0dabb2b6"
                   headlineColumn="elements/empty"
                   label1Column="elements/a40f7dc6-7431-4abb-beca-18bc35ceee64"
                   subtitle1Column="elements/subtitle1"
                   descriptionColumn="elements/empty"
                   rightArrow={false}
                   disabled={false}
                   variant="square"
                   flexibleSize={true}
                   effect={{"effectType":"dataRouteSingle","path":"/Werke"}}
                >
                <svelte:fragment slot="chips">
                </svelte:fragment>
                <svelte:fragment slot="buttons">
                </svelte:fragment>
                </DataTile>
              </Styling>
            </svelte:fragment>
            <svelte:fragment slot="emptyElement">
            </svelte:fragment>
            </Mosaic>
          </Spacing>
        </DataLoaderMulti>
      </Spacing>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="Player">
      <AudioPlayer
         audioColumn="elements/0d2776e9-9338-48dd-b750-49ba6cbf95b8"
         titleColumn="elements/title"
      >
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
           effect={{"effectType":"route","path":"/Saalplan"}}
        >
          <Icon
             type="Thin-Map"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
              disabled={false}
           effect={{"effectType":"route","path":"/QR"}}
        >
          <Icon
             type="Thin-QR-Scan"
             inverse={false}
          >
          </Icon>
        </NavButton>
      </NavBar>
  </svelte:fragment>
  </LayoutShellAudio>
</Route>

<DataRouteSingle
   path="/Werke"
   sheet="elements"
>
  <LayoutShellAudio
  >
  <svelte:fragment slot="TopBar">
      <HorizontalSpacer
      >
      <svelte:fragment slot="left">
        <Button
              type="link"
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
    <ScrollContainer
    >
      <DataLoaderMulti
         sheetKey="elements"
                     discoverableColumn="elements/discoverable"
         discoverAnnotation="discovered"
         >
        <DataCard
           variant="full"
              effect={undefined}
           imageColumn="elements/image"
           headlineColumn="elements/title"
           label1Column="elements/empty"
           subtitle1Column="elements/empty"
           label2Column="elements/empty"
           subtitle2Column="elements/empty"
           label3Column="elements/empty"
           subtitle3Column="elements/supertext"
           descriptionColumn="elements/empty"
        >
        <svelte:fragment slot="chips">
        </svelte:fragment>
        <svelte:fragment slot="content">
          <Spacing
                   bottom="s"
             left="m"
          >
            <ButtonBar
               justify="left"
               >
              <PopoutAudioButton
                 audioColumn="elements/0d2776e9-9338-48dd-b750-49ba6cbf95b8"
                 buttonOptions={{"text":"","type":"secondary","size":"medium","flex":"normal"}}
              >
              </PopoutAudioButton>
            </ButtonBar>
          </Spacing>
          <DataCell
             column="elements/description"
             format="richText"
             centerContent={false}
          >
          </DataCell>
        </svelte:fragment>
        </DataCard>
      </DataLoaderMulti>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="Player">
      <AudioPlayer
         audioColumn="elements/0d2776e9-9338-48dd-b750-49ba6cbf95b8"
         titleColumn="elements/title"
      >
      </AudioPlayer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShellAudio>
</DataRouteSingle>

<Route
   path="/Menu"
   keepAlive={false}
>
  <LayoutShell
  >
  <svelte:fragment slot="TopBar">
      <HorizontalSpacer
      >
      <svelte:fragment slot="left">
        <Button
              type="link"
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
    <ScrollContainer
    >
      <ListItem
         text="Über InterCats"
         effect={{"effectType":"route","path":"/Intercats"}}
      >
      </ListItem>
      <ListItem
         text="Über CatMuseum"
         effect={{"effectType":"route","path":"/Catmuseum"}}
      >
      </ListItem>
      <ListItem
         text="Impressum"
         effect={{"effectType":"route","path":"/Impressum"}}
      >
      </ListItem>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShell>
</Route>

<Route
   path="/Catmuseum"
   keepAlive={false}
>
  <LayoutShell
  >
  <svelte:fragment slot="TopBar">
      <HorizontalSpacer
      >
      <svelte:fragment slot="left">
        <Button
              type="link"
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
    <Spacing
       top="m"
       right="m"
       bottom="m"
       left="m"
    >
      <DataLoaderSingle
         sheet="d7d9c91b-84b3-47c2-bb24-4e87f5f7b78a"
         rowKey="5e694b2e-8bc8-4b06-a73a-8d45711e0b27"
         >
        <DataCell
           column="d7d9c91b-84b3-47c2-bb24-4e87f5f7b78a/9ee9e589-e773-4433-a6f5-b5a3789e1177"
           format="richText"
           centerContent={false}
        >
        </DataCell>
      </DataLoaderSingle>
    </Spacing>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShell>
</Route>

<Route
   path="/Impressum"
   keepAlive={false}
>
  <LayoutShell
  >
  <svelte:fragment slot="TopBar">
      <HorizontalSpacer
      >
      <svelte:fragment slot="left">
        <Button
              type="link"
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
    <Spacing
       top="m"
       right="m"
       bottom="m"
       left="m"
    >
      <DataLoaderSingle
         sheet="d7d9c91b-84b3-47c2-bb24-4e87f5f7b78a"
         rowKey="8580cab7-7be2-422a-a0fb-b6f430ed86cd"
         >
        <DataCell
           column="d7d9c91b-84b3-47c2-bb24-4e87f5f7b78a/9ee9e589-e773-4433-a6f5-b5a3789e1177"
           format="richText"
           centerContent={false}
        >
        </DataCell>
      </DataLoaderSingle>
    </Spacing>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShell>
</Route>

<Route
   path="/Intercats"
   keepAlive={false}
>
  <LayoutShell
  >
  <svelte:fragment slot="TopBar">
      <HorizontalSpacer
      >
      <svelte:fragment slot="left">
        <Button
              type="link"
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
    <Spacing
       top="m"
       right="m"
       bottom="m"
       left="m"
    >
      <DataLoaderSingle
         sheet="d7d9c91b-84b3-47c2-bb24-4e87f5f7b78a"
         rowKey="f329c416-178c-477c-8b20-5ee60528725d"
         >
        <DataCell
           column="d7d9c91b-84b3-47c2-bb24-4e87f5f7b78a/9ee9e589-e773-4433-a6f5-b5a3789e1177"
           format="richText"
           centerContent={false}
        >
        </DataCell>
      </DataLoaderSingle>
    </Spacing>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShell>
</Route>

<Route
   path="/QR"
   keepAlive={false}
>
  <QRScanner
     elementKeyColumn="elements/c7aa516d-0671-4492-a518-dda924e9a34f"
     closeEffect={{"effectType":"route","path":"/"}}
     scanEffect={{"effectType":"dataRouteSingle","path":"/Werke"}}
  >
  </QRScanner>
</Route>

<DataRouteSingle
   path="/Filter"
   sheet="b41a4cc0-7b84-43f6-9733-a552dddd4d26"
>
  <LayoutShellAudio
  >
  <svelte:fragment slot="TopBar">
    <HorizontalSpacer
    >
    <svelte:fragment slot="left">
      <Button
            type="link"
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
      <TextFormat
         interfaceFormat="none"
         contentFormat="headline-3"
      >
        <DataCell
           column="b41a4cc0-7b84-43f6-9733-a552dddd4d26/fb85a6fe-3e1d-49ee-b886-e67c1208d0ac"
           format="string"
           centerContent={false}
        >
        </DataCell>
      </TextFormat>
    </svelte:fragment>
    <svelte:fragment slot="right">
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
        <DataLoaderMulti
           sheetKey="elements"
           sortColumn="elements/a40f7dc6-7431-4abb-beca-18bc35ceee64"
           hideColumn="elements/empty"
                 discoverableColumn="elements/discoverable"
           discoverAnnotation="discovered"
           referenceColumn="elements/622dcc7c-1275-4de2-94c8-e0dbb812bd62"
        >
          <Mosaic
             >
          <svelte:fragment slot="contentElement">
            <DataTile
               imageColumn="elements/eb7d204d-67fc-4491-9a8c-e8cc0dabb2b6"
               headlineColumn="elements/empty"
               label1Column="elements/empty"
               subtitle1Column="elements/subtitle1"
               descriptionColumn="elements/empty"
               rightArrow={false}
               disabled={false}
               variant="square"
               flexibleSize={true}
               effect={{"effectType":"dataRouteSingle","path":"/Werke"}}
            >
            <svelte:fragment slot="chips">
            </svelte:fragment>
            <svelte:fragment slot="buttons">
            </svelte:fragment>
            </DataTile>
          </svelte:fragment>
          <svelte:fragment slot="emptyElement">
          </svelte:fragment>
          </Mosaic>
        </DataLoaderMulti>
      </Spacing>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="Player">
      <AudioPlayer
         audioColumn="elements/0d2776e9-9338-48dd-b750-49ba6cbf95b8"
         titleColumn="elements/title"
      >
      </AudioPlayer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShellAudio>
</DataRouteSingle>
