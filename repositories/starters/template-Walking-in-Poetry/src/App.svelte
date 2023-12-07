<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AppBase from "interkit/components/AppBase.svelte";
import Button from "interkit/components/Button.svelte";
import ButtonBar from "interkit/components/ButtonBar.svelte";
import DataCell from "interkit/components/DataCell.svelte";
import DataLoaderMulti from "interkit/components/DataLoaderMulti.svelte";
import DataRouteSingle from "interkit/components/DataRouteSingle.svelte";
import ExternalMapAppButton from "interkit/components/ExternalMapAppButton.svelte";
import HorizontalSpacer from "interkit/components/HorizontalSpacer.svelte";
import Icon from "interkit/components/Icon.svelte";
import IfDataAnnotation from "interkit/components/IfDataAnnotation.svelte";
import IfNext from "interkit/components/IfNext.svelte";
import IfPrevious from "interkit/components/IfPrevious.svelte";
import IfUIKey from "interkit/components/IfUIKey.svelte";
import Image from "interkit/components/Image.svelte";
import LayoutShellAudio from "interkit/components/LayoutShellAudio.svelte";
import MapSimple from "interkit/components/MapSimple.svelte";
import Overlay from "interkit/components/Overlay.svelte";
import QRScanner from "interkit/components/QRScanner.svelte";
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

<AppBase
   >
  <DataLoaderMulti
     sheetKey="elements"
     sortColumn="elements/index"
     hideColumn="elements/hide"
                 >
    <Route
       path="/"
       keepAlive={false}
    >
      <Image
         mediafileKey="ef22fc02-fcc3-46b4-bdcb-1e4d7961e3b3"
                  width="100%"
               >
      </Image>
      <Spacing
         top="m"
         right="m"
         bottom="m"
         left="m"
      >
        <ButtonBar
           justify="center"
           >
          <TextFormat
             interfaceFormat="none"
             contentFormat="headline-2"
          >
            <StaticText
               text="Walking in Poetry"
            >
            </StaticText>
          </TextFormat>
        </ButtonBar>
      </Spacing>
      <ButtonBar
         justify="center"
         >
        <Button
           text="start"
           type="primary"
           size="medium"
           flex="normal"
              effect={{"effectType":"route","path":"/element/7428881c-84cb-4da5-9f0d-6fec6713eb7c"}}
        >
        </Button>
      </ButtonBar>
    </Route>
    <DataRouteSingle
       path="/element"
       sheet="elements"
    >
      <LayoutShellAudio
      >
      <svelte:fragment slot="TopBar">
      </svelte:fragment>
      <svelte:fragment slot="Content">
        <ScrollContainer
        >
          <Image
                   imageColumn="elements/clueImage"
                width="100%"
                   >
          </Image>
          <HorizontalSpacer
          >
          <svelte:fragment slot="left">
          </svelte:fragment>
          <svelte:fragment slot="center">
            <TextFormat
               interfaceFormat="none"
               contentFormat="headline-2"
            >
              <DataCell
                 column="elements/title"
                 format="string"
                 centerContent={false}
              >
              </DataCell>
            </TextFormat>
          </svelte:fragment>
          <svelte:fragment slot="right">
          </svelte:fragment>
          </HorizontalSpacer>
          <Spacing
             top="m"
             right="m"
             bottom="m"
             left="m"
          >
            <StaticText
               text="Here's the location of this station on the map."
            >
            </StaticText>
          </Spacing>
          <Spacing
             top="none"
             right="m"
             bottom="m"
             left="m"
          >
            <MapSimple
                  markerPositionsColumn="elements/location"
               customIconColumn="elements/mapMarkerIcon"
               markerLabelColumn="elements/markerLabel"
               markerTitleColumn="elements/markerTitle"
               checkedProperty="checked"
                     mapId="map"
               height="300px"
               showControls={true}
               showPopups={false}
               inline={true}
               nearestElementMode={false}
               disableControls={false}
               singleElementContext={true}
               tileLayer="https://tile.openstreetmap.org/&#123;z&#125;/&#123;x&#125;/&#123;y&#125;.png"
                     closeButtonLabel="Schließen"
            >
            <svelte:fragment slot="popup">
            </svelte:fragment>
            <svelte:fragment slot="button">
              <ButtonBar
                 justify="right"
                 >
                <ExternalMapAppButton
                   buttonOptions={{"text":"Navigate","type":"secondary","size":"medium","flex":"normal"}}
                   locationColumn="elements/location"
                >
                <svelte:fragment slot="Icon">
                  <Icon
                     type="Full-Map"
                     inverse={false}
                  >
                  </Icon>
                </svelte:fragment>
                </ExternalMapAppButton>
              </ButtonBar>
            </svelte:fragment>
            </MapSimple>
          </Spacing>
          <Spacing
             top="m"
             right="m"
             bottom="m"
             left="m"
          >
            <IfDataAnnotation
               key="unlocked"
               value="true"
            >
            <svelte:fragment slot="iftrue">
              <IfNext
              >
              <svelte:fragment slot="iftrue">
                <StaticText
                   text="You have scanned the QR code. Here is your poem."
                >
                </StaticText>
              </svelte:fragment>
              <svelte:fragment slot="else">
                <StaticText
                   text="Congratulations! You've made it to the last location in the tour."
                >
                </StaticText>
              </svelte:fragment>
              </IfNext>
              <Spacing
                 top="m"
                 right="m"
                 bottom="none"
                 left="m"
              >
                <SectionShell
                >
                  <DataCell
                     column="elements/content"
                     format="richText"
                     centerContent={false}
                  >
                  </DataCell>
                </SectionShell>
              </Spacing>
            </svelte:fragment>
            <svelte:fragment slot="else">
              <DataCell
                 column="elements/clueText"
                 format="string"
                 centerContent={false}
              >
              </DataCell>
            </svelte:fragment>
            </IfDataAnnotation>
          </Spacing>
          <Spacing
                   bottom="m"
             >
            <ButtonBar
               justify="center"
               >
              <IfPrevious
              >
              <svelte:fragment slot="iftrue">
                <Button
                   text="previous"
                   type="secondary"
                   size="medium"
                   flex="normal"
                      effect={{"effectType":"previous","value":"true","key":"checked","path":"/element"}}
                >
                </Button>
              </svelte:fragment>
              <svelte:fragment slot="else">
              </svelte:fragment>
              </IfPrevious>
              <IfDataAnnotation
                 key="unlocked"
                 value="true"
              >
              <svelte:fragment slot="iftrue">
                <IfNext
                >
                <svelte:fragment slot="iftrue">
                  <Button
                     text="next"
                     type="primary"
                     size="medium"
                     flex="normal"
                        effect={{"effectType":"next","value":"true","key":"checked","path":"/element"}}
                  >
                  </Button>
                </svelte:fragment>
                <svelte:fragment slot="else">
                </svelte:fragment>
                </IfNext>
              </svelte:fragment>
              <svelte:fragment slot="else">
                <Button
                   text="scan this location"
                   type="primary"
                   size="medium"
                   flex="normal"
                      effect={{"effectType":"setUIKey","value":"true","key":"scanner"}}
                >
                </Button>
              </svelte:fragment>
              </IfDataAnnotation>
            </ButtonBar>
          </Spacing>
        </ScrollContainer>
        <IfUIKey
           storeType="UIKey"
           key="scanner"
           value="true"
        >
        <svelte:fragment slot="iftrue">
            <Overlay
               zIndex="1001"
               >
              <QRScanner
                 elementKeyColumn="elements/qrCode"
                 closeEffect={{"effectType":"setUIKey","value":"false","key":"scanner"}}
                 scanEffect={{"effectType":"actionTrigger","trigger":"unlock"}}
              >
              </QRScanner>
            </Overlay>
        </svelte:fragment>
        <svelte:fragment slot="else">
        </svelte:fragment>
        </IfUIKey>
      </svelte:fragment>
      <svelte:fragment slot="Player">
      </svelte:fragment>
      <svelte:fragment slot="BottomBar">
      </svelte:fragment>
      </LayoutShellAudio>
    </DataRouteSingle>
  </DataLoaderMulti>
</AppBase>

<Route
   path="/"
   keepAlive={false}
>
  <Image
     mediafileKey="ef22fc02-fcc3-46b4-bdcb-1e4d7961e3b3"
              width="100%"
           >
  </Image>
  <Spacing
     top="m"
     right="m"
     bottom="m"
     left="m"
  >
    <ButtonBar
       justify="center"
       >
      <TextFormat
         interfaceFormat="none"
         contentFormat="headline-2"
      >
        <StaticText
           text="Walking in Poetry"
        >
        </StaticText>
      </TextFormat>
    </ButtonBar>
  </Spacing>
  <ButtonBar
     justify="center"
     >
    <Button
       text="start"
       type="primary"
       size="medium"
       flex="normal"
          effect={{"effectType":"route","path":"/element/7428881c-84cb-4da5-9f0d-6fec6713eb7c"}}
    >
    </Button>
  </ButtonBar>
</Route>

<DataRouteSingle
   path="/element"
   sheet="elements"
>
  <LayoutShellAudio
  >
  <svelte:fragment slot="TopBar">
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <ScrollContainer
    >
      <Image
               imageColumn="elements/clueImage"
            width="100%"
               >
      </Image>
      <HorizontalSpacer
      >
      <svelte:fragment slot="left">
      </svelte:fragment>
      <svelte:fragment slot="center">
        <TextFormat
           interfaceFormat="none"
           contentFormat="headline-2"
        >
          <DataCell
             column="elements/title"
             format="string"
             centerContent={false}
          >
          </DataCell>
        </TextFormat>
      </svelte:fragment>
      <svelte:fragment slot="right">
      </svelte:fragment>
      </HorizontalSpacer>
      <Spacing
         top="m"
         right="m"
         bottom="m"
         left="m"
      >
        <StaticText
           text="Here's the location of this station on the map."
        >
        </StaticText>
      </Spacing>
      <Spacing
         top="none"
         right="m"
         bottom="m"
         left="m"
      >
        <MapSimple
              markerPositionsColumn="elements/location"
           customIconColumn="elements/mapMarkerIcon"
           markerLabelColumn="elements/markerLabel"
           markerTitleColumn="elements/markerTitle"
           checkedProperty="checked"
                 mapId="map"
           height="300px"
           showControls={true}
           showPopups={false}
           inline={true}
           nearestElementMode={false}
           disableControls={false}
           singleElementContext={true}
           tileLayer="https://tile.openstreetmap.org/&#123;z&#125;/&#123;x&#125;/&#123;y&#125;.png"
                 closeButtonLabel="Schließen"
        >
        <svelte:fragment slot="popup">
        </svelte:fragment>
        <svelte:fragment slot="button">
          <ButtonBar
             justify="right"
             >
            <ExternalMapAppButton
               buttonOptions={{"text":"Navigate","type":"secondary","size":"medium","flex":"normal"}}
               locationColumn="elements/location"
            >
            <svelte:fragment slot="Icon">
              <Icon
                 type="Full-Map"
                 inverse={false}
              >
              </Icon>
            </svelte:fragment>
            </ExternalMapAppButton>
          </ButtonBar>
        </svelte:fragment>
        </MapSimple>
      </Spacing>
      <Spacing
         top="m"
         right="m"
         bottom="m"
         left="m"
      >
        <IfDataAnnotation
           key="unlocked"
           value="true"
        >
        <svelte:fragment slot="iftrue">
          <IfNext
          >
          <svelte:fragment slot="iftrue">
            <StaticText
               text="You have scanned the QR code. Here is your poem."
            >
            </StaticText>
          </svelte:fragment>
          <svelte:fragment slot="else">
            <StaticText
               text="Congratulations! You've made it to the last location in the tour."
            >
            </StaticText>
          </svelte:fragment>
          </IfNext>
          <Spacing
             top="m"
             right="m"
             bottom="none"
             left="m"
          >
            <SectionShell
            >
              <DataCell
                 column="elements/content"
                 format="richText"
                 centerContent={false}
              >
              </DataCell>
            </SectionShell>
          </Spacing>
        </svelte:fragment>
        <svelte:fragment slot="else">
          <DataCell
             column="elements/clueText"
             format="string"
             centerContent={false}
          >
          </DataCell>
        </svelte:fragment>
        </IfDataAnnotation>
      </Spacing>
      <Spacing
               bottom="m"
         >
        <ButtonBar
           justify="center"
           >
          <IfPrevious
          >
          <svelte:fragment slot="iftrue">
            <Button
               text="previous"
               type="secondary"
               size="medium"
               flex="normal"
                  effect={{"effectType":"previous","value":"true","key":"checked","path":"/element"}}
            >
            </Button>
          </svelte:fragment>
          <svelte:fragment slot="else">
          </svelte:fragment>
          </IfPrevious>
          <IfDataAnnotation
             key="unlocked"
             value="true"
          >
          <svelte:fragment slot="iftrue">
            <IfNext
            >
            <svelte:fragment slot="iftrue">
              <Button
                 text="next"
                 type="primary"
                 size="medium"
                 flex="normal"
                    effect={{"effectType":"next","value":"true","key":"checked","path":"/element"}}
              >
              </Button>
            </svelte:fragment>
            <svelte:fragment slot="else">
            </svelte:fragment>
            </IfNext>
          </svelte:fragment>
          <svelte:fragment slot="else">
            <Button
               text="scan this location"
               type="primary"
               size="medium"
               flex="normal"
                  effect={{"effectType":"setUIKey","value":"true","key":"scanner"}}
            >
            </Button>
          </svelte:fragment>
          </IfDataAnnotation>
        </ButtonBar>
      </Spacing>
    </ScrollContainer>
    <IfUIKey
       storeType="UIKey"
       key="scanner"
       value="true"
    >
    <svelte:fragment slot="iftrue">
        <Overlay
           zIndex="1001"
           >
          <QRScanner
             elementKeyColumn="elements/qrCode"
             closeEffect={{"effectType":"setUIKey","value":"false","key":"scanner"}}
             scanEffect={{"effectType":"actionTrigger","trigger":"unlock"}}
          >
          </QRScanner>
        </Overlay>
    </svelte:fragment>
    <svelte:fragment slot="else">
    </svelte:fragment>
    </IfUIKey>
  </svelte:fragment>
  <svelte:fragment slot="Player">
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
  </svelte:fragment>
  </LayoutShellAudio>
</DataRouteSingle>
