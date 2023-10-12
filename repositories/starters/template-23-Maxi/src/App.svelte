<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import Absolute from "interkit/components/Absolute.svelte";
import AccordeonShell from "interkit/components/AccordeonShell.svelte";
import AnonymousLogin from "interkit/components/AnonymousLogin.svelte";
import AppBase from "interkit/components/AppBase.svelte";
import ARViewer from "interkit/components/ARViewer.svelte";
import AudioPlayer from "interkit/components/AudioPlayer.svelte";
import Button from "interkit/components/Button.svelte";
import ButtonBar from "interkit/components/ButtonBar.svelte";
import CenterModal from "interkit/components/CenterModal.svelte";
import Chat from "interkit/components/Chat.svelte";
import ChatRoute from "interkit/components/ChatRoute.svelte";
import ColumnShell from "interkit/components/ColumnShell.svelte";
import DataCard from "interkit/components/DataCard.svelte";
import DataCarousel from "interkit/components/DataCarousel.svelte";
import DataCell from "interkit/components/DataCell.svelte";
import DataList from "interkit/components/DataList.svelte";
import DataLoaderMulti from "interkit/components/DataLoaderMulti.svelte";
import DataLoaderSingle from "interkit/components/DataLoaderSingle.svelte";
import DataRouteSingle from "interkit/components/DataRouteSingle.svelte";
import DataTile from "interkit/components/DataTile.svelte";
import ExternalMapAppButton from "interkit/components/ExternalMapAppButton.svelte";
import HorizontalSpacer from "interkit/components/HorizontalSpacer.svelte";
import Icon from "interkit/components/Icon.svelte";
import IfUIKey from "interkit/components/IfUIKey.svelte";
import LangSwitch from "interkit/components/LangSwitch.svelte";
import LayoutShellAudio from "interkit/components/LayoutShellAudio.svelte";
import ListItem from "interkit/components/ListItem.svelte";
import MapSimple from "interkit/components/MapSimple.svelte";
import MapViewButton from "interkit/components/MapViewButton.svelte";
import Mosaic from "interkit/components/Mosaic.svelte";
import NavBar from "interkit/components/NavBar.svelte";
import NavButton from "interkit/components/NavButton.svelte";
import PictureBook from "interkit/components/PictureBook.svelte";
import PopoutAudioButton from "interkit/components/PopoutAudioButton.svelte";
import QRScanner from "interkit/components/QRScanner.svelte";
import Route from "interkit/components/Route.svelte";
import ScrollContainer from "interkit/components/ScrollContainer.svelte";
import SectionShell from "interkit/components/SectionShell.svelte";
import SlideInModal from "interkit/components/SlideInModal.svelte";
import Snackbar from "interkit/components/Snackbar.svelte";
import Spacing from "interkit/components/Spacing.svelte";
import StaticText from "interkit/components/StaticText.svelte";
import StoryBoardImage from "interkit/components/StoryBoardImage.svelte";
import ChatBoardsList from "interkit/components/ChatBoardsList.svelte";
import Styling from "interkit/components/Styling.svelte";
import Tab from "interkit/components/Tab.svelte";
import TabBar from "interkit/components/TabBar.svelte";
import TextFormat from "interkit/components/TextFormat.svelte";
import TopBarShell from "interkit/components/TopBarShell.svelte";
import UserCard from "interkit/components/UserCard.svelte";
import UserVarSwitch from "interkit/components/UserVarSwitch.svelte";
import styleTokens from "./styleTokens.json";
globalThis.styleTokens = styleTokens;
console.log('AppBase styleTokens', styleTokens);
initActions();
$: $translations, translations, t, $lang, lang, console.log('AppBase i18n $', { t, $translations, translations, $lang, lang });
console.log('AppBase i18n', { t, $translations, translations, $lang, lang });
</script>

<AppBase
   languages="en,de"
>
  <AnonymousLogin
     defaultLang="en"
     >
    <DataLoaderMulti
       sheetKey="elements"
          hideColumn="elements/hide"
             discoverableColumn="elements/discoverable"
       discoverAnnotation="discovered"
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
          </svelte:fragment>
          <svelte:fragment slot="center">
          </svelte:fragment>
          <svelte:fragment slot="right">
            <Button
               text="Components"
               type="link"
               size="medium"
               flex="normal"
                  effect={{"effectType":"route","path":"/menu"}}
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
            <DataLoaderSingle
               sheet="text"
               rowKey="1"
               customKeyColumn="text/index"
            >
              <DataCell
                 column="text/content"
                 format="richText"
                 inline={false}
                 centerContent={false}
              >
              </DataCell>
            </DataLoaderSingle>
          </ScrollContainer>
        </svelte:fragment>
        <svelte:fragment slot="Player">
            <AudioPlayer
               audioColumn="elements/audio"
               titleColumn="elements/audio"
            >
              <DataCard
                 variant="full"
                    effect={undefined}
                 imageColumn="elements/image"
                 headlineColumn="elements/title"
                 label1Column="elements/label1"
                 subtitle1Column="elements/subtitle1"
                 label2Column="elements/label2"
                 subtitle2Column="elements/subtitle2"
                 label3Column="elements/label3"
                 subtitle3Column="elements/subtitle3"
                 descriptionColumn="elements/description"
              >
              <svelte:fragment slot="chips">
              </svelte:fragment>
              <svelte:fragment slot="content">
              </svelte:fragment>
              </DataCard>
            </AudioPlayer>
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
            <NavBar
            >
              <NavButton
                 text="Home"
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
                 text="Archive"
                 disabled={false}
                 effect={{"effectType":"route","path":"/archive"}}
              >
                <Icon
                   type="Thin-Archiv"
                   inverse={false}
                >
                </Icon>
              </NavButton>
              <NavButton
                 text="Chat"
                 disabled={false}
                 effect={{"effectType":"route","path":"/chat"}}
              >
                <Icon
                   type="Thin-Chat"
                   inverse={false}
                >
                </Icon>
              </NavButton>
              <NavButton
                 text="Map"
                 disabled={false}
                 effect={{"effectType":"route","path":"/map"}}
              >
                <Icon
                   type="Thin-Map"
                   inverse={false}
                >
                </Icon>
              </NavButton>
            </NavBar>
        </svelte:fragment>
        </LayoutShellAudio>
      </Route>
      <Route
         path="/archive"
         keepAlive={false}
      >
        <LayoutShellAudio
        >
        <svelte:fragment slot="TopBar">
        </svelte:fragment>
        <svelte:fragment slot="Content">
          <TopBarShell
          >
          <svelte:fragment slot="TopBar">
            <TabBar
            >
              <Tab
                 text="Tab 1"
                 effect={{"effectType":"setUIKey","value":"1","key":"tabs"}}
                 execOnMount={true}
              >
              </Tab>
              <Tab
                 text="Tab 2"
                 effect={{"effectType":"setUIKey","value":"2","key":"tabs"}}
                 execOnMount={false}
              >
              </Tab>
              <Tab
                 text="Tab 3"
                 effect={{"effectType":"setUIKey","value":"3","key":"tabs"}}
                 execOnMount={false}
              >
              </Tab>
            </TabBar>
          </svelte:fragment>
          <svelte:fragment slot="Content">
            <ScrollContainer
            >
                <IfUIKey
                   storeType="UIKey"
                   key="tabs"
                   value="1"
                >
                <svelte:fragment slot="iftrue">
                  <SectionShell
                  >
                    <DataLoaderMulti
                       sheetKey="elements"
                          hideColumn="elements/hide"
                             discoverableColumn="elements/discoverable"
                       discoverAnnotation="discovered"
                       >
                      <DataList
                      >
                      <svelte:fragment slot="dataElement">
                        <DataCard
                           variant="medium"
                           rightArrow={true}
                           effect={{"effectType":"dataRouteSingle","path":"/element"}}
                           imageColumn="elements/image"
                           headlineColumn="elements/title"
                           label1Column="elements/label1"
                           subtitle1Column="elements/subtitle1"
                           label2Column="elements/label2"
                           subtitle2Column="elements/subtitle2"
                           label3Column="elements/label3"
                           subtitle3Column="elements/subtitle3"
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
                    </DataLoaderMulti>
                  </SectionShell>
                </svelte:fragment>
                <svelte:fragment slot="else">
                </svelte:fragment>
                </IfUIKey>
            </ScrollContainer>
              <Absolute
                       right="20px"
                 bottom="20px"
              >
                <Styling
                   styleTokens={{"colorText":"#000000","colorTextStrong":"#000000","colorTextSoft":"#4C4C4C","colorTextLink":"#2D40A1","colorBackground":"#FFFFFF","colorBackgroundHighlight":"#E5E5E5","colorBackgroundBackdrop":"#F2F2F2","colorBorder":"#999999","colorDummyAsset":"#FFDBD3","distanceScaleFactor":1,"colorTextButtonPressed":"#000000","colorBackgroundButtonPressed":"#B2B2B2","colorTextButtonDanger":"#000000","colorBackgroundButtonDanger":"#FF6A49","colorBackgroundButtonDangerPressed":"#FFA996","colorTextButtonPrimary":"#FFFFFF","colorTextButtonPrimaryPressed":"#FFFFFF","colorBackgroundButtonPrimary":"#000000","colorBackgroundButtonPrimaryPressed":"#4C4C4C","colorBorderButtonPrimary":"#ffffff","colorBorderButtonPrimaryPressed":"#000000","colorBackgroundLabel1":"#B2B2B2","colorTextLabel1":"#000000","colorBackgroundChatMe":"#E5E5E5","colorBackgroundChatOther":"#000000","colorPagination":"#000000","borderWidth":"4px","borderRadius":"24px","borderRadiusButton":"16px","borderRadiusLabel":"8px","boxShadow":"0px 0px 1px rgba(0, 0, 0, 0.5)"}}
                >
                  <Button
                     text="Scan"
                     type="primary"
                     size="large"
                     flex="normal"
                        effect={{"effectType":"route","path":"/qr-general"}}
                  >
                    <Icon
                       type="Full-QR-Scan"
                       inverse={true}
                    >
                    </Icon>
                  </Button>
                </Styling>
              </Absolute>
          </svelte:fragment>
          </TopBarShell>
        </svelte:fragment>
        <svelte:fragment slot="Player">
            <AudioPlayer
               audioColumn="elements/audio"
               titleColumn="elements/audio"
            >
              <DataCard
                 variant="full"
                    effect={undefined}
                 imageColumn="elements/image"
                 headlineColumn="elements/title"
                 label1Column="elements/label1"
                 subtitle1Column="elements/subtitle1"
                 label2Column="elements/label2"
                 subtitle2Column="elements/subtitle2"
                 label3Column="elements/label3"
                 subtitle3Column="elements/subtitle3"
                 descriptionColumn="elements/description"
              >
              <svelte:fragment slot="chips">
              </svelte:fragment>
              <svelte:fragment slot="content">
              </svelte:fragment>
              </DataCard>
            </AudioPlayer>
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
            <NavBar
            >
              <NavButton
                 text="Home"
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
                 text="Archive"
                 disabled={false}
                 effect={{"effectType":"route","path":"/archive"}}
              >
                <Icon
                   type="Thin-Archiv"
                   inverse={false}
                >
                </Icon>
              </NavButton>
              <NavButton
                 text="Chat"
                 disabled={false}
                 effect={{"effectType":"route","path":"/chat"}}
              >
                <Icon
                   type="Thin-Chat"
                   inverse={false}
                >
                </Icon>
              </NavButton>
              <NavButton
                 text="Map"
                 disabled={false}
                 effect={{"effectType":"route","path":"/map"}}
              >
                <Icon
                   type="Thin-Map"
                   inverse={false}
                >
                </Icon>
              </NavButton>
            </NavBar>
        </svelte:fragment>
        </LayoutShellAudio>
      </Route>
      <DataRouteSingle
         path="/element"
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
            <DataCard
               variant="full"
                  effect={undefined}
               imageColumn="elements/image"
               headlineColumn="elements/title"
               label1Column="elements/label1"
               subtitle1Column="elements/subtitle1"
               label2Column="elements/label2"
               subtitle2Column="elements/subtitle2"
               label3Column="elements/label3"
               subtitle3Column="elements/subtitle3"
               descriptionColumn="elements/description"
            >
            <svelte:fragment slot="chips">
            </svelte:fragment>
            <svelte:fragment slot="content">
              <ButtonBar
                 justify="left"
                 >
                <PopoutAudioButton
                   audioColumn="elements/audio"
                   buttonOptions={{"text":"","type":"secondary","size":"medium","flex":"normal"}}
                >
                </PopoutAudioButton>
                <Button
                      type="secondary"
                   size="medium"
                   flex="normal"
                      effect={{"effectType":"dataRouteSingle","path":"/ar"}}
                >
                  <Icon
                     type="Thin-AR"
                     inverse={false}
                  >
                  </Icon>
                </Button>
                <Button
                      type="secondary"
                   size="medium"
                   flex="normal"
                      effect={{"effectType":"dataRouteSingle","path":"/qr"}}
                >
                  <Icon
                     type="Thin-QR-Scan"
                     inverse={false}
                  >
                  </Icon>
                </Button>
                <ExternalMapAppButton
                   buttonOptions={undefined}
                   locationColumn="elements/location"
                >
                <svelte:fragment slot="Icon">
                  <Icon
                     type="Thin-Map"
                     inverse={false}
                  >
                  </Icon>
                </svelte:fragment>
                </ExternalMapAppButton>
              </ButtonBar>
            </svelte:fragment>
            </DataCard>
          </ScrollContainer>
        </svelte:fragment>
        <svelte:fragment slot="Player">
            <AudioPlayer
               audioColumn="elements/audio"
               titleColumn="elements/audio"
            >
              <DataCard
                 variant="full"
                    effect={undefined}
                 imageColumn="elements/image"
                 headlineColumn="elements/title"
                 label1Column="elements/label1"
                 subtitle1Column="elements/subtitle1"
                 label2Column="elements/label2"
                 subtitle2Column="elements/subtitle2"
                 label3Column="elements/label3"
                 subtitle3Column="elements/subtitle3"
                 descriptionColumn="elements/description"
              >
              <svelte:fragment slot="chips">
              </svelte:fragment>
              <svelte:fragment slot="content">
              </svelte:fragment>
              </DataCard>
            </AudioPlayer>
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
        </svelte:fragment>
        </LayoutShellAudio>
      </DataRouteSingle>
      <Route
         path="/chat"
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
               contentFormat="none"
            >
              <StaticText
                 text="Chat"
              >
              </StaticText>
            </TextFormat>
          </svelte:fragment>
          <svelte:fragment slot="right">
          </svelte:fragment>
          </HorizontalSpacer>
        </svelte:fragment>
        <svelte:fragment slot="Content">
          <ChatBoardsList
             path="/board"
          >
          </ChatBoardsList>
        </svelte:fragment>
        <svelte:fragment slot="Player">
            <AudioPlayer
               audioColumn="elements/audio"
               titleColumn="elements/audio"
            >
              <DataCard
                 variant="full"
                    effect={undefined}
                 imageColumn="elements/image"
                 headlineColumn="elements/title"
                 label1Column="elements/label1"
                 subtitle1Column="elements/subtitle1"
                 label2Column="elements/label2"
                 subtitle2Column="elements/subtitle2"
                 label3Column="elements/label3"
                 subtitle3Column="elements/subtitle3"
                 descriptionColumn="elements/description"
              >
              <svelte:fragment slot="chips">
              </svelte:fragment>
              <svelte:fragment slot="content">
              </svelte:fragment>
              </DataCard>
            </AudioPlayer>
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
            <NavBar
            >
              <NavButton
                 text="Home"
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
                 text="Archive"
                 disabled={false}
                 effect={{"effectType":"route","path":"/archive"}}
              >
                <Icon
                   type="Thin-Archiv"
                   inverse={false}
                >
                </Icon>
              </NavButton>
              <NavButton
                 text="Chat"
                 disabled={false}
                 effect={{"effectType":"route","path":"/chat"}}
              >
                <Icon
                   type="Thin-Chat"
                   inverse={false}
                >
                </Icon>
              </NavButton>
              <NavButton
                 text="Map"
                 disabled={false}
                 effect={{"effectType":"route","path":"/map"}}
              >
                <Icon
                   type="Thin-Map"
                   inverse={false}
                >
                </Icon>
              </NavButton>
            </NavBar>
        </svelte:fragment>
        </LayoutShellAudio>
      </Route>
      <ChatRoute
         path="/board"
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
                    effect={{"effectType":"back"}}
              >
                <Icon
                   type="Thin-Arrow-Left"
                   inverse={false}
                >
                </Icon>
              </Button>
            <StoryBoardImage
                  topBarImage={true}
            >
            </StoryBoardImage>
          </svelte:fragment>
          <svelte:fragment slot="center">
          </svelte:fragment>
          <svelte:fragment slot="right">
          </svelte:fragment>
          </HorizontalSpacer>
        </svelte:fragment>
        <svelte:fragment slot="Content">
          <Chat
             board="board1"
             messagesReportableDefault="TRUE"
             typingDurationTypeChoiceDefault="0.0"
             typingDurationTypeTextPerCharacter="0.075"
             >
          <svelte:fragment slot="Player">
              <AudioPlayer
                 audioColumn="elements/audio"
                 titleColumn="elements/audio"
              >
                <DataCard
                   variant="full"
                      effect={undefined}
                   imageColumn="elements/image"
                   headlineColumn="elements/title"
                   label1Column="elements/label1"
                   subtitle1Column="elements/subtitle1"
                   label2Column="elements/label2"
                   subtitle2Column="elements/subtitle2"
                   label3Column="elements/label3"
                   subtitle3Column="elements/subtitle3"
                   descriptionColumn="elements/description"
                >
                <svelte:fragment slot="chips">
                </svelte:fragment>
                <svelte:fragment slot="content">
                </svelte:fragment>
                </DataCard>
              </AudioPlayer>
          </svelte:fragment>
          </Chat>
        </svelte:fragment>
        <svelte:fragment slot="Player">
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
        </svelte:fragment>
        </LayoutShellAudio>
      </ChatRoute>
      <Route
         path="/map"
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
          </svelte:fragment>
          <svelte:fragment slot="right">
            <MapViewButton
                  type="layers"
               text="Layers"
               layerSelectPrompt="Select a layer for the map."
                                          >
            </MapViewButton>
            <MapViewButton
                     text="Filters"
                                             >
            </MapViewButton>
          </svelte:fragment>
          </HorizontalSpacer>
        </svelte:fragment>
        <svelte:fragment slot="Content">
          <MapSimple
                markerPositionsColumn="elements/location"
             customIconColumn="elements/image"
             markerLabelColumn="elements/index"
             markerTitleColumn="elements/title"
             checkedProperty="checked"
                hideOnMapColumn="elements/hideOnMap"
                   mapId="map"
             height="100%"
             showControls={true}
             showPopups={true}
             inline={false}
             nearestElementMode={false}
             disableControls={false}
             singleElementContext={false}
             tileLayer="https://tile.openstreetmap.org/&#123;z&#125;/&#123;x&#125;/&#123;y&#125;.png"
                   closeButtonLabel="Close"
          >
          <svelte:fragment slot="popup">
            <DataCard
               variant="small"
               rightArrow={true}
               effect={{"effectType":"dataRouteSingle","path":"/element"}}
               imageColumn="elements/image"
               headlineColumn="elements/title"
               label1Column="elements/label1"
               subtitle1Column="elements/subtitle1"
               label2Column="elements/label2"
               subtitle2Column="elements/subtitle2"
               label3Column="elements/label3"
               subtitle3Column="elements/subtitle3"
               descriptionColumn="elements/description"
            >
            <svelte:fragment slot="chips">
            </svelte:fragment>
            <svelte:fragment slot="content">
            </svelte:fragment>
            </DataCard>
          </svelte:fragment>
          <svelte:fragment slot="button">
          </svelte:fragment>
          </MapSimple>
            <Absolute
                     right="20px"
               bottom="20px"
            >
              <Styling
                 styleTokens={{"colorText":"#000000","colorTextStrong":"#000000","colorTextSoft":"#4C4C4C","colorTextLink":"#2D40A1","colorBackground":"#FFFFFF","colorBackgroundHighlight":"#E5E5E5","colorBackgroundBackdrop":"#F2F2F2","colorBorder":"#999999","colorDummyAsset":"#FFDBD3","distanceScaleFactor":1,"colorTextButtonPressed":"#000000","colorBackgroundButtonPressed":"#B2B2B2","colorTextButtonDanger":"#000000","colorBackgroundButtonDanger":"#FF6A49","colorBackgroundButtonDangerPressed":"#FFA996","colorTextButtonPrimary":"#FFFFFF","colorTextButtonPrimaryPressed":"#FFFFFF","colorBackgroundButtonPrimary":"#000000","colorBackgroundButtonPrimaryPressed":"#4C4C4C","colorBorderButtonPrimary":"#ffffff","colorBorderButtonPrimaryPressed":"#000000","colorBackgroundLabel1":"#B2B2B2","colorTextLabel1":"#000000","colorBackgroundChatMe":"#E5E5E5","colorBackgroundChatOther":"#000000","colorPagination":"#000000","borderWidth":"4px","borderRadius":"24px","borderRadiusButton":"16px","borderRadiusLabel":"8px","boxShadow":"0px 0px 1px rgba(0, 0, 0, 0.5)"}}
              >
                <Button
                   text="Scan"
                   type="primary"
                   size="large"
                   flex="normal"
                      effect={{"effectType":"route","path":"/qr-general"}}
                >
                  <Icon
                     type="Full-QR-Scan"
                     inverse={true}
                  >
                  </Icon>
                </Button>
              </Styling>
            </Absolute>
        </svelte:fragment>
        <svelte:fragment slot="Player">
            <AudioPlayer
               audioColumn="elements/audio"
               titleColumn="elements/audio"
            >
              <DataCard
                 variant="full"
                    effect={undefined}
                 imageColumn="elements/image"
                 headlineColumn="elements/title"
                 label1Column="elements/label1"
                 subtitle1Column="elements/subtitle1"
                 label2Column="elements/label2"
                 subtitle2Column="elements/subtitle2"
                 label3Column="elements/label3"
                 subtitle3Column="elements/subtitle3"
                 descriptionColumn="elements/description"
              >
              <svelte:fragment slot="chips">
              </svelte:fragment>
              <svelte:fragment slot="content">
              </svelte:fragment>
              </DataCard>
            </AudioPlayer>
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
            <NavBar
            >
              <NavButton
                 text="Home"
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
                 text="Archive"
                 disabled={false}
                 effect={{"effectType":"route","path":"/archive"}}
              >
                <Icon
                   type="Thin-Archiv"
                   inverse={false}
                >
                </Icon>
              </NavButton>
              <NavButton
                 text="Chat"
                 disabled={false}
                 effect={{"effectType":"route","path":"/chat"}}
              >
                <Icon
                   type="Thin-Chat"
                   inverse={false}
                >
                </Icon>
              </NavButton>
              <NavButton
                 text="Map"
                 disabled={false}
                 effect={{"effectType":"route","path":"/map"}}
              >
                <Icon
                   type="Thin-Map"
                   inverse={false}
                >
                </Icon>
              </NavButton>
            </NavBar>
        </svelte:fragment>
        </LayoutShellAudio>
      </Route>
      <Route
         path="/menu"
         keepAlive={false}
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
               text="Language"
               effect={undefined}
            >
              <LangSwitch
                    reloadAfterSwitch="yes"
              >
              </LangSwitch>
            </ListItem>
            <ListItem
               text="Custom User Variable"
               effect={undefined}
            >
              <UserVarSwitch
                 userVarName="test"
              >
              </UserVarSwitch>
            </ListItem>
            <ListItem
               text="Cards"
               effect={{"effectType":"route","path":"/menu/cards"}}
            >
              <Icon
                 type="Thin-Arrow-Right"
                 inverse={false}
              >
              </Icon>
            </ListItem>
            <ListItem
               text="Tiles"
               effect={{"effectType":"route","path":"/menu/tiles"}}
            >
              <Icon
                 type="Thin-Arrow-Right"
                 inverse={false}
              >
              </Icon>
            </ListItem>
            <ListItem
               text="Carousel"
               effect={{"effectType":"route","path":"/menu/carousel"}}
            >
              <Icon
                 type="Thin-Arrow-Right"
                 inverse={false}
              >
              </Icon>
            </ListItem>
            <ListItem
               text="Mosaic"
               effect={{"effectType":"route","path":"/menu/mosaic"}}
            >
              <Icon
                 type="Thin-Arrow-Right"
                 inverse={false}
              >
              </Icon>
            </ListItem>
            <ListItem
               text="PictureBook"
               effect={{"effectType":"route","path":"/menu/picturebook"}}
            >
              <Icon
                 type="Thin-Arrow-Right"
                 inverse={false}
              >
              </Icon>
            </ListItem>
            <ListItem
               text="Accordeon"
               effect={{"effectType":"route","path":"/menu/accordeon"}}
            >
              <Icon
                 type="Thin-Arrow-Right"
                 inverse={false}
              >
              </Icon>
            </ListItem>
            <ListItem
               text="Modals"
               effect={{"effectType":"route","path":"/menu/modals"}}
            >
              <Icon
                 type="Thin-Arrow-Right"
                 inverse={false}
              >
              </Icon>
            </ListItem>
            <ListItem
               text="Map (inline)"
               effect={{"effectType":"route","path":"/menu/inlinemap"}}
            >
              <Icon
                 type="Thin-Arrow-Right"
                 inverse={false}
              >
              </Icon>
            </ListItem>
          </ScrollContainer>
        </svelte:fragment>
        <svelte:fragment slot="Player">
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
        </svelte:fragment>
        </LayoutShellAudio>
      </Route>
      <Route
         path="/menu/cards"
         keepAlive={false}
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
            <SectionShell
            >
              <UserCard
                 imageVar="profilePicture"
                                      >
              </UserCard>
              <DataLoaderSingle
                 sheet="elements"
                 rowKey="af1684d5-7153-4e51-9721-14613060b44f"
                 >
                <DataCard
                   variant="large"
                      effect={undefined}
                   imageColumn="elements/image"
                   headlineColumn="elements/title"
                   label1Column="elements/label1"
                   subtitle1Column="elements/subtitle1"
                   label2Column="elements/label2"
                   subtitle2Column="elements/subtitle2"
                   label3Column="elements/label3"
                   subtitle3Column="elements/subtitle3"
                   descriptionColumn="elements/description"
                >
                <svelte:fragment slot="chips">
                </svelte:fragment>
                <svelte:fragment slot="content">
                </svelte:fragment>
                </DataCard>
                <DataCard
                   variant="medium"
                      effect={undefined}
                   imageColumn="elements/image"
                   headlineColumn="elements/title"
                   label1Column="elements/label1"
                   subtitle1Column="elements/subtitle1"
                   label2Column="elements/label2"
                   subtitle2Column="elements/subtitle2"
                   label3Column="elements/label3"
                   subtitle3Column="elements/subtitle3"
                   descriptionColumn="elements/description"
                >
                <svelte:fragment slot="chips">
                </svelte:fragment>
                <svelte:fragment slot="content">
                </svelte:fragment>
                </DataCard>
                <DataCard
                   variant="small"
                      effect={undefined}
                   imageColumn="elements/image"
                   headlineColumn="elements/title"
                   label1Column="elements/label1"
                   subtitle1Column="elements/subtitle1"
                   label2Column="elements/label2"
                   subtitle2Column="elements/subtitle2"
                   label3Column="elements/label3"
                   subtitle3Column="elements/subtitle3"
                   descriptionColumn="elements/description"
                >
                <svelte:fragment slot="chips">
                </svelte:fragment>
                <svelte:fragment slot="content">
                </svelte:fragment>
                </DataCard>
              </DataLoaderSingle>
            </SectionShell>
          </ScrollContainer>
        </svelte:fragment>
        <svelte:fragment slot="Player">
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
        </svelte:fragment>
        </LayoutShellAudio>
      </Route>
      <Route
         path="/menu/carousel"
         keepAlive={false}
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
            <DataCarousel
                  roundedCorners={false}
               background={true}
               gaps={true}
            >
            <svelte:fragment slot="contentElement">
              <DataCard
                 variant="large"
                    effect={undefined}
                 imageColumn="elements/image"
                 headlineColumn="elements/title"
                 label1Column="elements/label1"
                 subtitle1Column="elements/subtitle1"
                 label2Column="elements/label2"
                 subtitle2Column="elements/subtitle2"
                 label3Column="elements/label3"
                 subtitle3Column="elements/subtitle3"
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
            </DataCarousel>
            <DataCarousel
               mode="continuous"
               roundedCorners={false}
               background={true}
               gaps={true}
            >
            <svelte:fragment slot="contentElement">
              <DataTile
                 imageColumn="elements/image"
                 headlineColumn="elements/empty"
                 label1Column="elements/label1"
                 subtitle1Column="elements/subtitle1"
                 descriptionColumn="elements/description"
                 rightArrow={false}
                 disabled={false}
                    flexibleSize={false}
                 effect={undefined}
              >
              <svelte:fragment slot="chips">
              </svelte:fragment>
              <svelte:fragment slot="buttons">
              </svelte:fragment>
              </DataTile>
            </svelte:fragment>
            <svelte:fragment slot="emptyElement">
            </svelte:fragment>
            </DataCarousel>
          </ScrollContainer>
        </svelte:fragment>
        <svelte:fragment slot="Player">
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
        </svelte:fragment>
        </LayoutShellAudio>
      </Route>
      <Route
         path="/menu/tiles"
         keepAlive={false}
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
            <SectionShell
            >
              <ColumnShell
                 columns="2"
              >
              <svelte:fragment slot="col1">
                <DataLoaderSingle
                   sheet="elements"
                   rowKey="af1684d5-7153-4e51-9721-14613060b44f"
                   >
                  <DataTile
                     imageColumn="elements/image"
                     headlineColumn="elements/empty"
                     label1Column="elements/label1"
                     subtitle1Column="elements/subtitle1"
                     descriptionColumn="elements/description"
                     rightArrow={false}
                     disabled={false}
                        flexibleSize={true}
                     effect={undefined}
                  >
                  <svelte:fragment slot="chips">
                  </svelte:fragment>
                  <svelte:fragment slot="buttons">
                  </svelte:fragment>
                  </DataTile>
                </DataLoaderSingle>
              </svelte:fragment>
              <svelte:fragment slot="col2">
                <DataTile
                   imageColumn="elements/image"
                   headlineColumn="elements/title"
                   label1Column="elements/label1"
                   subtitle1Column="elements/subtitle1"
                   descriptionColumn="elements/description"
                   rightArrow={false}
                   disabled={false}
                      flexibleSize={true}
                   effect={undefined}
                >
                <svelte:fragment slot="chips">
                </svelte:fragment>
                <svelte:fragment slot="buttons">
                </svelte:fragment>
                </DataTile>
              </svelte:fragment>
              <svelte:fragment slot="col3">
              </svelte:fragment>
              </ColumnShell>
              <ColumnShell
                 columns="3"
              >
              <svelte:fragment slot="col1">
                <DataTile
                   imageColumn="elements/image"
                   headlineColumn="elements/title"
                   label1Column="elements/label1"
                   subtitle1Column="elements/subtitle1"
                   descriptionColumn="elements/description"
                   rightArrow={false}
                   disabled={false}
                      flexibleSize={true}
                   effect={undefined}
                >
                <svelte:fragment slot="chips">
                </svelte:fragment>
                <svelte:fragment slot="buttons">
                </svelte:fragment>
                </DataTile>
              </svelte:fragment>
              <svelte:fragment slot="col2">
                <DataTile
                   imageColumn="elements/image"
                   headlineColumn="elements/title"
                   label1Column="elements/label1"
                   subtitle1Column="elements/subtitle1"
                   descriptionColumn="elements/description"
                   rightArrow={false}
                   disabled={false}
                      flexibleSize={true}
                   effect={undefined}
                >
                <svelte:fragment slot="chips">
                </svelte:fragment>
                <svelte:fragment slot="buttons">
                </svelte:fragment>
                </DataTile>
              </svelte:fragment>
              <svelte:fragment slot="col3">
                <DataTile
                   imageColumn="elements/image"
                   headlineColumn="elements/title"
                   label1Column="elements/label1"
                   subtitle1Column="elements/subtitle1"
                   descriptionColumn="elements/description"
                   rightArrow={false}
                   disabled={false}
                      flexibleSize={true}
                   effect={undefined}
                >
                <svelte:fragment slot="chips">
                </svelte:fragment>
                <svelte:fragment slot="buttons">
                </svelte:fragment>
                </DataTile>
              </svelte:fragment>
              </ColumnShell>
              <DataTile
                 imageColumn="elements/image"
                 headlineColumn="elements/title"
                 label1Column="elements/label1"
                 subtitle1Column="elements/subtitle1"
                 descriptionColumn="elements/description"
                 rightArrow={false}
                 disabled={false}
                    flexibleSize={true}
                 effect={undefined}
              >
              <svelte:fragment slot="chips">
              </svelte:fragment>
              <svelte:fragment slot="buttons">
              </svelte:fragment>
              </DataTile>
            </SectionShell>
          </ScrollContainer>
        </svelte:fragment>
        <svelte:fragment slot="Player">
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
        </svelte:fragment>
        </LayoutShellAudio>
      </Route>
      <Route
         path="/menu/mosaic"
         keepAlive={false}
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
            <SectionShell
            >
              <Mosaic
                 gap={true}
              >
              <svelte:fragment slot="contentElement">
                <DataTile
                   imageColumn="elements/image"
                   headlineColumn="elements/empty"
                   label1Column="elements/label1"
                   subtitle1Column="elements/subtitle1"
                   descriptionColumn="elements/description"
                   rightArrow={false}
                   disabled={false}
                      flexibleSize={true}
                   effect={undefined}
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
            </SectionShell>
          </ScrollContainer>
        </svelte:fragment>
        <svelte:fragment slot="Player">
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
        </svelte:fragment>
        </LayoutShellAudio>
      </Route>
      <Route
         path="/menu/picturebook"
         keepAlive={false}
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
          <PictureBook
             imageColumn="elements/image"
             orderColumn="elements/order"
          >
          <svelte:fragment slot="contentElement">
            <Spacing
               top="s"
               right="s"
                  >
              <DataCell
                 column="elements/title"
                 format="string"
                 inline={false}
                 centerContent={true}
              >
              </DataCell>
            </Spacing>
          </svelte:fragment>
          </PictureBook>
        </svelte:fragment>
        <svelte:fragment slot="Player">
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
        </svelte:fragment>
        </LayoutShellAudio>
      </Route>
      <Route
         path="/menu/modals"
         keepAlive={false}
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
            <SlideInModal
                  headline="Hello"
                  >
            <svelte:fragment slot="buttons">
            </svelte:fragment>
            </SlideInModal>
            <CenterModal
                        headline="Hello"
                  >
            <svelte:fragment slot="buttons">
              <Button
                 text="Confirm"
                 type="primary"
                 size="medium"
                 flex="fill"
                 disabled={false}
                 effect={undefined}
              >
              </Button>
            </svelte:fragment>
            </CenterModal>
            <SectionShell
            >
              <Snackbar
                          prompt="Hello"
                 effect={undefined}
              >
              <svelte:fragment slot="buttons">
              </svelte:fragment>
              </Snackbar>
              <Snackbar
                 variant="informative"
                       prompt="Hello"
                 effect={undefined}
              >
              <svelte:fragment slot="buttons">
              </svelte:fragment>
              </Snackbar>
              <Snackbar
                 variant="responseNeeded"
                          effect={undefined}
              >
              <svelte:fragment slot="buttons">
                <Button
                   text="Confirm"
                   type="primary"
                   size="medium"
                   flex="fill"
                   disabled={false}
                   effect={undefined}
                >
                </Button>
              </svelte:fragment>
              </Snackbar>
            </SectionShell>
          </ScrollContainer>
        </svelte:fragment>
        <svelte:fragment slot="Player">
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
        </svelte:fragment>
        </LayoutShellAudio>
      </Route>
      <Route
         path="/menu/inlinemap"
         keepAlive={false}
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
          <SectionShell
          >
            <DataLoaderSingle
               sheet="elements"
               rowKey="af1684d5-7153-4e51-9721-14613060b44f"
               >
              <MapSimple
                    markerPositionsColumn="elements/location"
                 customIconColumn="elements/mapMarkerIcon"
                 markerLabelColumn="elements/markerLabel"
                 markerTitleColumn="elements/markerTitle"
                 checkedProperty="checked"
                    hideOnMapColumn="elements/hideOnMap"
                       mapId="map"
                 height="300px"
                 showControls={false}
                 showPopups={false}
                 inline={true}
                 nearestElementMode={false}
                 disableControls={true}
                 singleElementContext={true}
                 tileLayer="https://tile.openstreetmap.org/&#123;z&#125;/&#123;x&#125;/&#123;y&#125;.png"
                       closeButtonLabel="Close"
              >
              <svelte:fragment slot="popup">
              </svelte:fragment>
              <svelte:fragment slot="button">
                <Button
                   text="Open Map"
                   type="secondary"
                   size="medium"
                   flex="fill"
                   disabled={false}
                   effect={undefined}
                >
                </Button>
              </svelte:fragment>
              </MapSimple>
            </DataLoaderSingle>
          </SectionShell>
        </svelte:fragment>
        <svelte:fragment slot="Player">
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
        </svelte:fragment>
        </LayoutShellAudio>
      </Route>
      <Route
         path="/menu/accordeon"
         keepAlive={false}
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
          <SectionShell
          >
            <AccordeonShell
            >
            <svelte:fragment slot="label">
              <Icon
                 type="Thin-Archiv"
                 inverse={false}
              >
              </Icon>
              <StaticText
                 text="part one"
              >
              </StaticText>
            </svelte:fragment>
            <svelte:fragment slot="content">
              <StaticText
                 text="content one"
              >
              </StaticText>
            </svelte:fragment>
            </AccordeonShell>
            <AccordeonShell
            >
            <svelte:fragment slot="label">
              <Icon
                 type="Thin-Archiv"
                 inverse={false}
              >
              </Icon>
              <StaticText
                 text="part two"
              >
              </StaticText>
            </svelte:fragment>
            <svelte:fragment slot="content">
              <StaticText
                 text="content two"
              >
              </StaticText>
            </svelte:fragment>
            </AccordeonShell>
          </SectionShell>
        </svelte:fragment>
        <svelte:fragment slot="Player">
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
        </svelte:fragment>
        </LayoutShellAudio>
      </Route>
      <DataRouteSingle
         path="/ar"
         sheet="elements"
      >
        <ARViewer
           titleColumn="elements/title"
           glbColumn="elements/glbFile"
           usdzColumn="elements/usdzFile"
           modelPreviewImageColumn="elements/image"
           videoColumn="elements/video"
           startButtonText="Start AR"
           videoButtonText="Watch Video"
           >
        <svelte:fragment slot="iosInfo">
        </svelte:fragment>
        <svelte:fragment slot="androidInfo">
        </svelte:fragment>
        <svelte:fragment slot="videoFallbackInfo">
        </svelte:fragment>
        <svelte:fragment slot="videoOnlyInfo">
        </svelte:fragment>
        </ARViewer>
      </DataRouteSingle>
      <DataRouteSingle
         path="/qr"
         sheet="elements"
      >
        <QRScanner
           elementKeyColumn="elements/qrKey"
           closeEffect={{"effectType":"back"}}
           scanEffect={undefined}
        >
        </QRScanner>
      </DataRouteSingle>
      <Route
         path="/qr-general"
         keepAlive={false}
      >
        <QRScanner
           elementKeyColumn="elements/index"
           closeEffect={{"effectType":"back"}}
           scanEffect={{"effectType":"dataRouteSingle","path":"/element"}}
        >
        </QRScanner>
      </Route>
    </DataLoaderMulti>
  </AnonymousLogin>
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
    </svelte:fragment>
    <svelte:fragment slot="center">
    </svelte:fragment>
    <svelte:fragment slot="right">
      <Button
         text="Components"
         type="link"
         size="medium"
         flex="normal"
            effect={{"effectType":"route","path":"/menu"}}
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
      <DataLoaderSingle
         sheet="text"
         rowKey="1"
         customKeyColumn="text/index"
      >
        <DataCell
           column="text/content"
           format="richText"
           inline={false}
           centerContent={false}
        >
        </DataCell>
      </DataLoaderSingle>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="Player">
      <AudioPlayer
         audioColumn="elements/audio"
         titleColumn="elements/audio"
      >
        <DataCard
           variant="full"
              effect={undefined}
           imageColumn="elements/image"
           headlineColumn="elements/title"
           label1Column="elements/label1"
           subtitle1Column="elements/subtitle1"
           label2Column="elements/label2"
           subtitle2Column="elements/subtitle2"
           label3Column="elements/label3"
           subtitle3Column="elements/subtitle3"
           descriptionColumn="elements/description"
        >
        <svelte:fragment slot="chips">
        </svelte:fragment>
        <svelte:fragment slot="content">
        </svelte:fragment>
        </DataCard>
      </AudioPlayer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
           text="Home"
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
           text="Archive"
           disabled={false}
           effect={{"effectType":"route","path":"/archive"}}
        >
          <Icon
             type="Thin-Archiv"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text="Chat"
           disabled={false}
           effect={{"effectType":"route","path":"/chat"}}
        >
          <Icon
             type="Thin-Chat"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text="Map"
           disabled={false}
           effect={{"effectType":"route","path":"/map"}}
        >
          <Icon
             type="Thin-Map"
             inverse={false}
          >
          </Icon>
        </NavButton>
      </NavBar>
  </svelte:fragment>
  </LayoutShellAudio>
</Route>

<Route
   path="/archive"
   keepAlive={false}
>
  <LayoutShellAudio
  >
  <svelte:fragment slot="TopBar">
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <TopBarShell
    >
    <svelte:fragment slot="TopBar">
      <TabBar
      >
        <Tab
           text="Tab 1"
           effect={{"effectType":"setUIKey","value":"1","key":"tabs"}}
           execOnMount={true}
        >
        </Tab>
        <Tab
           text="Tab 2"
           effect={{"effectType":"setUIKey","value":"2","key":"tabs"}}
           execOnMount={false}
        >
        </Tab>
        <Tab
           text="Tab 3"
           effect={{"effectType":"setUIKey","value":"3","key":"tabs"}}
           execOnMount={false}
        >
        </Tab>
      </TabBar>
    </svelte:fragment>
    <svelte:fragment slot="Content">
      <ScrollContainer
      >
          <IfUIKey
             storeType="UIKey"
             key="tabs"
             value="1"
          >
          <svelte:fragment slot="iftrue">
            <SectionShell
            >
              <DataLoaderMulti
                 sheetKey="elements"
                    hideColumn="elements/hide"
                       discoverableColumn="elements/discoverable"
                 discoverAnnotation="discovered"
                 >
                <DataList
                >
                <svelte:fragment slot="dataElement">
                  <DataCard
                     variant="medium"
                     rightArrow={true}
                     effect={{"effectType":"dataRouteSingle","path":"/element"}}
                     imageColumn="elements/image"
                     headlineColumn="elements/title"
                     label1Column="elements/label1"
                     subtitle1Column="elements/subtitle1"
                     label2Column="elements/label2"
                     subtitle2Column="elements/subtitle2"
                     label3Column="elements/label3"
                     subtitle3Column="elements/subtitle3"
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
              </DataLoaderMulti>
            </SectionShell>
          </svelte:fragment>
          <svelte:fragment slot="else">
          </svelte:fragment>
          </IfUIKey>
      </ScrollContainer>
        <Absolute
                 right="20px"
           bottom="20px"
        >
          <Styling
             styleTokens={{"colorText":"#000000","colorTextStrong":"#000000","colorTextSoft":"#4C4C4C","colorTextLink":"#2D40A1","colorBackground":"#FFFFFF","colorBackgroundHighlight":"#E5E5E5","colorBackgroundBackdrop":"#F2F2F2","colorBorder":"#999999","colorDummyAsset":"#FFDBD3","distanceScaleFactor":1,"colorTextButtonPressed":"#000000","colorBackgroundButtonPressed":"#B2B2B2","colorTextButtonDanger":"#000000","colorBackgroundButtonDanger":"#FF6A49","colorBackgroundButtonDangerPressed":"#FFA996","colorTextButtonPrimary":"#FFFFFF","colorTextButtonPrimaryPressed":"#FFFFFF","colorBackgroundButtonPrimary":"#000000","colorBackgroundButtonPrimaryPressed":"#4C4C4C","colorBorderButtonPrimary":"#ffffff","colorBorderButtonPrimaryPressed":"#000000","colorBackgroundLabel1":"#B2B2B2","colorTextLabel1":"#000000","colorBackgroundChatMe":"#E5E5E5","colorBackgroundChatOther":"#000000","colorPagination":"#000000","borderWidth":"4px","borderRadius":"24px","borderRadiusButton":"16px","borderRadiusLabel":"8px","boxShadow":"0px 0px 1px rgba(0, 0, 0, 0.5)"}}
          >
            <Button
               text="Scan"
               type="primary"
               size="large"
               flex="normal"
                  effect={{"effectType":"route","path":"/qr-general"}}
            >
              <Icon
                 type="Full-QR-Scan"
                 inverse={true}
              >
              </Icon>
            </Button>
          </Styling>
        </Absolute>
    </svelte:fragment>
    </TopBarShell>
  </svelte:fragment>
  <svelte:fragment slot="Player">
      <AudioPlayer
         audioColumn="elements/audio"
         titleColumn="elements/audio"
      >
        <DataCard
           variant="full"
              effect={undefined}
           imageColumn="elements/image"
           headlineColumn="elements/title"
           label1Column="elements/label1"
           subtitle1Column="elements/subtitle1"
           label2Column="elements/label2"
           subtitle2Column="elements/subtitle2"
           label3Column="elements/label3"
           subtitle3Column="elements/subtitle3"
           descriptionColumn="elements/description"
        >
        <svelte:fragment slot="chips">
        </svelte:fragment>
        <svelte:fragment slot="content">
        </svelte:fragment>
        </DataCard>
      </AudioPlayer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
           text="Home"
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
           text="Archive"
           disabled={false}
           effect={{"effectType":"route","path":"/archive"}}
        >
          <Icon
             type="Thin-Archiv"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text="Chat"
           disabled={false}
           effect={{"effectType":"route","path":"/chat"}}
        >
          <Icon
             type="Thin-Chat"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text="Map"
           disabled={false}
           effect={{"effectType":"route","path":"/map"}}
        >
          <Icon
             type="Thin-Map"
             inverse={false}
          >
          </Icon>
        </NavButton>
      </NavBar>
  </svelte:fragment>
  </LayoutShellAudio>
</Route>

<Route
   path="/menu"
   keepAlive={false}
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
         text="Language"
         effect={undefined}
      >
        <LangSwitch
              reloadAfterSwitch="yes"
        >
        </LangSwitch>
      </ListItem>
      <ListItem
         text="Custom User Variable"
         effect={undefined}
      >
        <UserVarSwitch
           userVarName="test"
        >
        </UserVarSwitch>
      </ListItem>
      <ListItem
         text="Cards"
         effect={{"effectType":"route","path":"/menu/cards"}}
      >
        <Icon
           type="Thin-Arrow-Right"
           inverse={false}
        >
        </Icon>
      </ListItem>
      <ListItem
         text="Tiles"
         effect={{"effectType":"route","path":"/menu/tiles"}}
      >
        <Icon
           type="Thin-Arrow-Right"
           inverse={false}
        >
        </Icon>
      </ListItem>
      <ListItem
         text="Carousel"
         effect={{"effectType":"route","path":"/menu/carousel"}}
      >
        <Icon
           type="Thin-Arrow-Right"
           inverse={false}
        >
        </Icon>
      </ListItem>
      <ListItem
         text="Mosaic"
         effect={{"effectType":"route","path":"/menu/mosaic"}}
      >
        <Icon
           type="Thin-Arrow-Right"
           inverse={false}
        >
        </Icon>
      </ListItem>
      <ListItem
         text="PictureBook"
         effect={{"effectType":"route","path":"/menu/picturebook"}}
      >
        <Icon
           type="Thin-Arrow-Right"
           inverse={false}
        >
        </Icon>
      </ListItem>
      <ListItem
         text="Accordeon"
         effect={{"effectType":"route","path":"/menu/accordeon"}}
      >
        <Icon
           type="Thin-Arrow-Right"
           inverse={false}
        >
        </Icon>
      </ListItem>
      <ListItem
         text="Modals"
         effect={{"effectType":"route","path":"/menu/modals"}}
      >
        <Icon
           type="Thin-Arrow-Right"
           inverse={false}
        >
        </Icon>
      </ListItem>
      <ListItem
         text="Map (inline)"
         effect={{"effectType":"route","path":"/menu/inlinemap"}}
      >
        <Icon
           type="Thin-Arrow-Right"
           inverse={false}
        >
        </Icon>
      </ListItem>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="Player">
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShellAudio>
</Route>

<Route
   path="/menu/cards"
   keepAlive={false}
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
      <SectionShell
      >
        <UserCard
           imageVar="profilePicture"
                                >
        </UserCard>
        <DataLoaderSingle
           sheet="elements"
           rowKey="af1684d5-7153-4e51-9721-14613060b44f"
           >
          <DataCard
             variant="large"
                effect={undefined}
             imageColumn="elements/image"
             headlineColumn="elements/title"
             label1Column="elements/label1"
             subtitle1Column="elements/subtitle1"
             label2Column="elements/label2"
             subtitle2Column="elements/subtitle2"
             label3Column="elements/label3"
             subtitle3Column="elements/subtitle3"
             descriptionColumn="elements/description"
          >
          <svelte:fragment slot="chips">
          </svelte:fragment>
          <svelte:fragment slot="content">
          </svelte:fragment>
          </DataCard>
          <DataCard
             variant="medium"
                effect={undefined}
             imageColumn="elements/image"
             headlineColumn="elements/title"
             label1Column="elements/label1"
             subtitle1Column="elements/subtitle1"
             label2Column="elements/label2"
             subtitle2Column="elements/subtitle2"
             label3Column="elements/label3"
             subtitle3Column="elements/subtitle3"
             descriptionColumn="elements/description"
          >
          <svelte:fragment slot="chips">
          </svelte:fragment>
          <svelte:fragment slot="content">
          </svelte:fragment>
          </DataCard>
          <DataCard
             variant="small"
                effect={undefined}
             imageColumn="elements/image"
             headlineColumn="elements/title"
             label1Column="elements/label1"
             subtitle1Column="elements/subtitle1"
             label2Column="elements/label2"
             subtitle2Column="elements/subtitle2"
             label3Column="elements/label3"
             subtitle3Column="elements/subtitle3"
             descriptionColumn="elements/description"
          >
          <svelte:fragment slot="chips">
          </svelte:fragment>
          <svelte:fragment slot="content">
          </svelte:fragment>
          </DataCard>
        </DataLoaderSingle>
      </SectionShell>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="Player">
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShellAudio>
</Route>

<DataRouteSingle
   path="/element"
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
      <DataCard
         variant="full"
            effect={undefined}
         imageColumn="elements/image"
         headlineColumn="elements/title"
         label1Column="elements/label1"
         subtitle1Column="elements/subtitle1"
         label2Column="elements/label2"
         subtitle2Column="elements/subtitle2"
         label3Column="elements/label3"
         subtitle3Column="elements/subtitle3"
         descriptionColumn="elements/description"
      >
      <svelte:fragment slot="chips">
      </svelte:fragment>
      <svelte:fragment slot="content">
        <ButtonBar
           justify="left"
           >
          <PopoutAudioButton
             audioColumn="elements/audio"
             buttonOptions={{"text":"","type":"secondary","size":"medium","flex":"normal"}}
          >
          </PopoutAudioButton>
          <Button
                type="secondary"
             size="medium"
             flex="normal"
                effect={{"effectType":"dataRouteSingle","path":"/ar"}}
          >
            <Icon
               type="Thin-AR"
               inverse={false}
            >
            </Icon>
          </Button>
          <Button
                type="secondary"
             size="medium"
             flex="normal"
                effect={{"effectType":"dataRouteSingle","path":"/qr"}}
          >
            <Icon
               type="Thin-QR-Scan"
               inverse={false}
            >
            </Icon>
          </Button>
          <ExternalMapAppButton
             buttonOptions={undefined}
             locationColumn="elements/location"
          >
          <svelte:fragment slot="Icon">
            <Icon
               type="Thin-Map"
               inverse={false}
            >
            </Icon>
          </svelte:fragment>
          </ExternalMapAppButton>
        </ButtonBar>
      </svelte:fragment>
      </DataCard>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="Player">
      <AudioPlayer
         audioColumn="elements/audio"
         titleColumn="elements/audio"
      >
        <DataCard
           variant="full"
              effect={undefined}
           imageColumn="elements/image"
           headlineColumn="elements/title"
           label1Column="elements/label1"
           subtitle1Column="elements/subtitle1"
           label2Column="elements/label2"
           subtitle2Column="elements/subtitle2"
           label3Column="elements/label3"
           subtitle3Column="elements/subtitle3"
           descriptionColumn="elements/description"
        >
        <svelte:fragment slot="chips">
        </svelte:fragment>
        <svelte:fragment slot="content">
        </svelte:fragment>
        </DataCard>
      </AudioPlayer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShellAudio>
</DataRouteSingle>

<Route
   path="/menu/tiles"
   keepAlive={false}
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
      <SectionShell
      >
        <ColumnShell
           columns="2"
        >
        <svelte:fragment slot="col1">
          <DataLoaderSingle
             sheet="elements"
             rowKey="af1684d5-7153-4e51-9721-14613060b44f"
             >
            <DataTile
               imageColumn="elements/image"
               headlineColumn="elements/empty"
               label1Column="elements/label1"
               subtitle1Column="elements/subtitle1"
               descriptionColumn="elements/description"
               rightArrow={false}
               disabled={false}
                  flexibleSize={true}
               effect={undefined}
            >
            <svelte:fragment slot="chips">
            </svelte:fragment>
            <svelte:fragment slot="buttons">
            </svelte:fragment>
            </DataTile>
          </DataLoaderSingle>
        </svelte:fragment>
        <svelte:fragment slot="col2">
          <DataTile
             imageColumn="elements/image"
             headlineColumn="elements/title"
             label1Column="elements/label1"
             subtitle1Column="elements/subtitle1"
             descriptionColumn="elements/description"
             rightArrow={false}
             disabled={false}
                flexibleSize={true}
             effect={undefined}
          >
          <svelte:fragment slot="chips">
          </svelte:fragment>
          <svelte:fragment slot="buttons">
          </svelte:fragment>
          </DataTile>
        </svelte:fragment>
        <svelte:fragment slot="col3">
        </svelte:fragment>
        </ColumnShell>
        <ColumnShell
           columns="3"
        >
        <svelte:fragment slot="col1">
          <DataTile
             imageColumn="elements/image"
             headlineColumn="elements/title"
             label1Column="elements/label1"
             subtitle1Column="elements/subtitle1"
             descriptionColumn="elements/description"
             rightArrow={false}
             disabled={false}
                flexibleSize={true}
             effect={undefined}
          >
          <svelte:fragment slot="chips">
          </svelte:fragment>
          <svelte:fragment slot="buttons">
          </svelte:fragment>
          </DataTile>
        </svelte:fragment>
        <svelte:fragment slot="col2">
          <DataTile
             imageColumn="elements/image"
             headlineColumn="elements/title"
             label1Column="elements/label1"
             subtitle1Column="elements/subtitle1"
             descriptionColumn="elements/description"
             rightArrow={false}
             disabled={false}
                flexibleSize={true}
             effect={undefined}
          >
          <svelte:fragment slot="chips">
          </svelte:fragment>
          <svelte:fragment slot="buttons">
          </svelte:fragment>
          </DataTile>
        </svelte:fragment>
        <svelte:fragment slot="col3">
          <DataTile
             imageColumn="elements/image"
             headlineColumn="elements/title"
             label1Column="elements/label1"
             subtitle1Column="elements/subtitle1"
             descriptionColumn="elements/description"
             rightArrow={false}
             disabled={false}
                flexibleSize={true}
             effect={undefined}
          >
          <svelte:fragment slot="chips">
          </svelte:fragment>
          <svelte:fragment slot="buttons">
          </svelte:fragment>
          </DataTile>
        </svelte:fragment>
        </ColumnShell>
        <DataTile
           imageColumn="elements/image"
           headlineColumn="elements/title"
           label1Column="elements/label1"
           subtitle1Column="elements/subtitle1"
           descriptionColumn="elements/description"
           rightArrow={false}
           disabled={false}
              flexibleSize={true}
           effect={undefined}
        >
        <svelte:fragment slot="chips">
        </svelte:fragment>
        <svelte:fragment slot="buttons">
        </svelte:fragment>
        </DataTile>
      </SectionShell>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="Player">
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShellAudio>
</Route>

<Route
   path="/menu/carousel"
   keepAlive={false}
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
      <DataCarousel
            roundedCorners={false}
         background={true}
         gaps={true}
      >
      <svelte:fragment slot="contentElement">
        <DataCard
           variant="large"
              effect={undefined}
           imageColumn="elements/image"
           headlineColumn="elements/title"
           label1Column="elements/label1"
           subtitle1Column="elements/subtitle1"
           label2Column="elements/label2"
           subtitle2Column="elements/subtitle2"
           label3Column="elements/label3"
           subtitle3Column="elements/subtitle3"
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
      </DataCarousel>
      <DataCarousel
         mode="continuous"
         roundedCorners={false}
         background={true}
         gaps={true}
      >
      <svelte:fragment slot="contentElement">
        <DataTile
           imageColumn="elements/image"
           headlineColumn="elements/empty"
           label1Column="elements/label1"
           subtitle1Column="elements/subtitle1"
           descriptionColumn="elements/description"
           rightArrow={false}
           disabled={false}
              flexibleSize={false}
           effect={undefined}
        >
        <svelte:fragment slot="chips">
        </svelte:fragment>
        <svelte:fragment slot="buttons">
        </svelte:fragment>
        </DataTile>
      </svelte:fragment>
      <svelte:fragment slot="emptyElement">
      </svelte:fragment>
      </DataCarousel>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="Player">
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShellAudio>
</Route>

<Route
   path="/menu/mosaic"
   keepAlive={false}
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
      <SectionShell
      >
        <Mosaic
           gap={true}
        >
        <svelte:fragment slot="contentElement">
          <DataTile
             imageColumn="elements/image"
             headlineColumn="elements/empty"
             label1Column="elements/label1"
             subtitle1Column="elements/subtitle1"
             descriptionColumn="elements/description"
             rightArrow={false}
             disabled={false}
                flexibleSize={true}
             effect={undefined}
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
      </SectionShell>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="Player">
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShellAudio>
</Route>

<Route
   path="/menu/picturebook"
   keepAlive={false}
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
    <PictureBook
       imageColumn="elements/image"
       orderColumn="elements/order"
    >
    <svelte:fragment slot="contentElement">
      <Spacing
         top="s"
         right="s"
            >
        <DataCell
           column="elements/title"
           format="string"
           inline={false}
           centerContent={true}
        >
        </DataCell>
      </Spacing>
    </svelte:fragment>
    </PictureBook>
  </svelte:fragment>
  <svelte:fragment slot="Player">
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShellAudio>
</Route>

<Route
   path="/menu/modals"
   keepAlive={false}
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
      <SlideInModal
            headline="Hello"
            >
      <svelte:fragment slot="buttons">
      </svelte:fragment>
      </SlideInModal>
      <CenterModal
                  headline="Hello"
            >
      <svelte:fragment slot="buttons">
        <Button
           text="Confirm"
           type="primary"
           size="medium"
           flex="fill"
           disabled={false}
           effect={undefined}
        >
        </Button>
      </svelte:fragment>
      </CenterModal>
      <SectionShell
      >
        <Snackbar
                    prompt="Hello"
           effect={undefined}
        >
        <svelte:fragment slot="buttons">
        </svelte:fragment>
        </Snackbar>
        <Snackbar
           variant="informative"
                 prompt="Hello"
           effect={undefined}
        >
        <svelte:fragment slot="buttons">
        </svelte:fragment>
        </Snackbar>
        <Snackbar
           variant="responseNeeded"
                    effect={undefined}
        >
        <svelte:fragment slot="buttons">
          <Button
             text="Confirm"
             type="primary"
             size="medium"
             flex="fill"
             disabled={false}
             effect={undefined}
          >
          </Button>
        </svelte:fragment>
        </Snackbar>
      </SectionShell>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="Player">
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShellAudio>
</Route>

<Route
   path="/menu/inlinemap"
   keepAlive={false}
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
    <SectionShell
    >
      <DataLoaderSingle
         sheet="elements"
         rowKey="af1684d5-7153-4e51-9721-14613060b44f"
         >
        <MapSimple
              markerPositionsColumn="elements/location"
           customIconColumn="elements/mapMarkerIcon"
           markerLabelColumn="elements/markerLabel"
           markerTitleColumn="elements/markerTitle"
           checkedProperty="checked"
              hideOnMapColumn="elements/hideOnMap"
                 mapId="map"
           height="300px"
           showControls={false}
           showPopups={false}
           inline={true}
           nearestElementMode={false}
           disableControls={true}
           singleElementContext={true}
           tileLayer="https://tile.openstreetmap.org/&#123;z&#125;/&#123;x&#125;/&#123;y&#125;.png"
                 closeButtonLabel="Close"
        >
        <svelte:fragment slot="popup">
        </svelte:fragment>
        <svelte:fragment slot="button">
          <Button
             text="Open Map"
             type="secondary"
             size="medium"
             flex="fill"
             disabled={false}
             effect={undefined}
          >
          </Button>
        </svelte:fragment>
        </MapSimple>
      </DataLoaderSingle>
    </SectionShell>
  </svelte:fragment>
  <svelte:fragment slot="Player">
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShellAudio>
</Route>

<Route
   path="/menu/accordeon"
   keepAlive={false}
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
    <SectionShell
    >
      <AccordeonShell
      >
      <svelte:fragment slot="label">
        <Icon
           type="Thin-Archiv"
           inverse={false}
        >
        </Icon>
        <StaticText
           text="part one"
        >
        </StaticText>
      </svelte:fragment>
      <svelte:fragment slot="content">
        <StaticText
           text="content one"
        >
        </StaticText>
      </svelte:fragment>
      </AccordeonShell>
      <AccordeonShell
      >
      <svelte:fragment slot="label">
        <Icon
           type="Thin-Archiv"
           inverse={false}
        >
        </Icon>
        <StaticText
           text="part two"
        >
        </StaticText>
      </svelte:fragment>
      <svelte:fragment slot="content">
        <StaticText
           text="content two"
        >
        </StaticText>
      </svelte:fragment>
      </AccordeonShell>
    </SectionShell>
  </svelte:fragment>
  <svelte:fragment slot="Player">
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShellAudio>
</Route>

<Route
   path="/map"
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
    </svelte:fragment>
    <svelte:fragment slot="right">
      <MapViewButton
            type="layers"
         text="Layers"
         layerSelectPrompt="Select a layer for the map."
                                    >
      </MapViewButton>
      <MapViewButton
               text="Filters"
                                       >
      </MapViewButton>
    </svelte:fragment>
    </HorizontalSpacer>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <MapSimple
          markerPositionsColumn="elements/location"
       customIconColumn="elements/image"
       markerLabelColumn="elements/index"
       markerTitleColumn="elements/title"
       checkedProperty="checked"
          hideOnMapColumn="elements/hideOnMap"
             mapId="map"
       height="100%"
       showControls={true}
       showPopups={true}
       inline={false}
       nearestElementMode={false}
       disableControls={false}
       singleElementContext={false}
       tileLayer="https://tile.openstreetmap.org/&#123;z&#125;/&#123;x&#125;/&#123;y&#125;.png"
             closeButtonLabel="Close"
    >
    <svelte:fragment slot="popup">
      <DataCard
         variant="small"
         rightArrow={true}
         effect={{"effectType":"dataRouteSingle","path":"/element"}}
         imageColumn="elements/image"
         headlineColumn="elements/title"
         label1Column="elements/label1"
         subtitle1Column="elements/subtitle1"
         label2Column="elements/label2"
         subtitle2Column="elements/subtitle2"
         label3Column="elements/label3"
         subtitle3Column="elements/subtitle3"
         descriptionColumn="elements/description"
      >
      <svelte:fragment slot="chips">
      </svelte:fragment>
      <svelte:fragment slot="content">
      </svelte:fragment>
      </DataCard>
    </svelte:fragment>
    <svelte:fragment slot="button">
    </svelte:fragment>
    </MapSimple>
      <Absolute
               right="20px"
         bottom="20px"
      >
        <Styling
           styleTokens={{"colorText":"#000000","colorTextStrong":"#000000","colorTextSoft":"#4C4C4C","colorTextLink":"#2D40A1","colorBackground":"#FFFFFF","colorBackgroundHighlight":"#E5E5E5","colorBackgroundBackdrop":"#F2F2F2","colorBorder":"#999999","colorDummyAsset":"#FFDBD3","distanceScaleFactor":1,"colorTextButtonPressed":"#000000","colorBackgroundButtonPressed":"#B2B2B2","colorTextButtonDanger":"#000000","colorBackgroundButtonDanger":"#FF6A49","colorBackgroundButtonDangerPressed":"#FFA996","colorTextButtonPrimary":"#FFFFFF","colorTextButtonPrimaryPressed":"#FFFFFF","colorBackgroundButtonPrimary":"#000000","colorBackgroundButtonPrimaryPressed":"#4C4C4C","colorBorderButtonPrimary":"#ffffff","colorBorderButtonPrimaryPressed":"#000000","colorBackgroundLabel1":"#B2B2B2","colorTextLabel1":"#000000","colorBackgroundChatMe":"#E5E5E5","colorBackgroundChatOther":"#000000","colorPagination":"#000000","borderWidth":"4px","borderRadius":"24px","borderRadiusButton":"16px","borderRadiusLabel":"8px","boxShadow":"0px 0px 1px rgba(0, 0, 0, 0.5)"}}
        >
          <Button
             text="Scan"
             type="primary"
             size="large"
             flex="normal"
                effect={{"effectType":"route","path":"/qr-general"}}
          >
            <Icon
               type="Full-QR-Scan"
               inverse={true}
            >
            </Icon>
          </Button>
        </Styling>
      </Absolute>
  </svelte:fragment>
  <svelte:fragment slot="Player">
      <AudioPlayer
         audioColumn="elements/audio"
         titleColumn="elements/audio"
      >
        <DataCard
           variant="full"
              effect={undefined}
           imageColumn="elements/image"
           headlineColumn="elements/title"
           label1Column="elements/label1"
           subtitle1Column="elements/subtitle1"
           label2Column="elements/label2"
           subtitle2Column="elements/subtitle2"
           label3Column="elements/label3"
           subtitle3Column="elements/subtitle3"
           descriptionColumn="elements/description"
        >
        <svelte:fragment slot="chips">
        </svelte:fragment>
        <svelte:fragment slot="content">
        </svelte:fragment>
        </DataCard>
      </AudioPlayer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
           text="Home"
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
           text="Archive"
           disabled={false}
           effect={{"effectType":"route","path":"/archive"}}
        >
          <Icon
             type="Thin-Archiv"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text="Chat"
           disabled={false}
           effect={{"effectType":"route","path":"/chat"}}
        >
          <Icon
             type="Thin-Chat"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text="Map"
           disabled={false}
           effect={{"effectType":"route","path":"/map"}}
        >
          <Icon
             type="Thin-Map"
             inverse={false}
          >
          </Icon>
        </NavButton>
      </NavBar>
  </svelte:fragment>
  </LayoutShellAudio>
</Route>

<Route
   path="/chat"
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
         contentFormat="none"
      >
        <StaticText
           text="Chat"
        >
        </StaticText>
      </TextFormat>
    </svelte:fragment>
    <svelte:fragment slot="right">
    </svelte:fragment>
    </HorizontalSpacer>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <ChatBoardsList
       path="/board"
    >
    </ChatBoardsList>
  </svelte:fragment>
  <svelte:fragment slot="Player">
      <AudioPlayer
         audioColumn="elements/audio"
         titleColumn="elements/audio"
      >
        <DataCard
           variant="full"
              effect={undefined}
           imageColumn="elements/image"
           headlineColumn="elements/title"
           label1Column="elements/label1"
           subtitle1Column="elements/subtitle1"
           label2Column="elements/label2"
           subtitle2Column="elements/subtitle2"
           label3Column="elements/label3"
           subtitle3Column="elements/subtitle3"
           descriptionColumn="elements/description"
        >
        <svelte:fragment slot="chips">
        </svelte:fragment>
        <svelte:fragment slot="content">
        </svelte:fragment>
        </DataCard>
      </AudioPlayer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
           text="Home"
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
           text="Archive"
           disabled={false}
           effect={{"effectType":"route","path":"/archive"}}
        >
          <Icon
             type="Thin-Archiv"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text="Chat"
           disabled={false}
           effect={{"effectType":"route","path":"/chat"}}
        >
          <Icon
             type="Thin-Chat"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text="Map"
           disabled={false}
           effect={{"effectType":"route","path":"/map"}}
        >
          <Icon
             type="Thin-Map"
             inverse={false}
          >
          </Icon>
        </NavButton>
      </NavBar>
  </svelte:fragment>
  </LayoutShellAudio>
</Route>

<ChatRoute
   path="/board"
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
              effect={{"effectType":"back"}}
        >
          <Icon
             type="Thin-Arrow-Left"
             inverse={false}
          >
          </Icon>
        </Button>
      <StoryBoardImage
            topBarImage={true}
      >
      </StoryBoardImage>
    </svelte:fragment>
    <svelte:fragment slot="center">
    </svelte:fragment>
    <svelte:fragment slot="right">
    </svelte:fragment>
    </HorizontalSpacer>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <Chat
       board="board1"
       messagesReportableDefault="TRUE"
       typingDurationTypeChoiceDefault="0.0"
       typingDurationTypeTextPerCharacter="0.075"
       >
    <svelte:fragment slot="Player">
        <AudioPlayer
           audioColumn="elements/audio"
           titleColumn="elements/audio"
        >
          <DataCard
             variant="full"
                effect={undefined}
             imageColumn="elements/image"
             headlineColumn="elements/title"
             label1Column="elements/label1"
             subtitle1Column="elements/subtitle1"
             label2Column="elements/label2"
             subtitle2Column="elements/subtitle2"
             label3Column="elements/label3"
             subtitle3Column="elements/subtitle3"
             descriptionColumn="elements/description"
          >
          <svelte:fragment slot="chips">
          </svelte:fragment>
          <svelte:fragment slot="content">
          </svelte:fragment>
          </DataCard>
        </AudioPlayer>
    </svelte:fragment>
    </Chat>
  </svelte:fragment>
  <svelte:fragment slot="Player">
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShellAudio>
</ChatRoute>

<Route
   path="/qr-general"
   keepAlive={false}
>
  <QRScanner
     elementKeyColumn="elements/index"
     closeEffect={{"effectType":"back"}}
     scanEffect={{"effectType":"dataRouteSingle","path":"/element"}}
  >
  </QRScanner>
</Route>

<DataRouteSingle
   path="/ar"
   sheet="elements"
>
  <ARViewer
     titleColumn="elements/title"
     glbColumn="elements/glbFile"
     usdzColumn="elements/usdzFile"
     modelPreviewImageColumn="elements/image"
     videoColumn="elements/video"
     startButtonText="Start AR"
     videoButtonText="Watch Video"
     >
  <svelte:fragment slot="iosInfo">
  </svelte:fragment>
  <svelte:fragment slot="androidInfo">
  </svelte:fragment>
  <svelte:fragment slot="videoFallbackInfo">
  </svelte:fragment>
  <svelte:fragment slot="videoOnlyInfo">
  </svelte:fragment>
  </ARViewer>
</DataRouteSingle>

<DataRouteSingle
   path="/qr"
   sheet="elements"
>
  <QRScanner
     elementKeyColumn="elements/qrKey"
     closeEffect={{"effectType":"back"}}
     scanEffect={undefined}
  >
  </QRScanner>
</DataRouteSingle>
