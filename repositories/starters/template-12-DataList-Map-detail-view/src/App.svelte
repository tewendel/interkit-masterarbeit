<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AppBase from "interkit/components/AppBase.svelte";
import Button from "interkit/components/Button.svelte";
import DataCard from "interkit/components/DataCard.svelte";
import DataCell from "interkit/components/DataCell.svelte";
import DataList from "interkit/components/DataList.svelte";
import DataLoaderMulti from "interkit/components/DataLoaderMulti.svelte";
import DataRouteSingle from "interkit/components/DataRouteSingle.svelte";
import HorizontalSpacer from "interkit/components/HorizontalSpacer.svelte";
import Icon from "interkit/components/Icon.svelte";
import LayoutShell from "interkit/components/LayoutShell.svelte";
import MapSimple from "interkit/components/MapSimple.svelte";
import NavBar from "interkit/components/NavBar.svelte";
import NavButton from "interkit/components/NavButton.svelte";
import Route from "interkit/components/Route.svelte";
import ScrollContainer from "interkit/components/ScrollContainer.svelte";
import SectionShell from "interkit/components/SectionShell.svelte";
import StaticText from "interkit/components/StaticText.svelte";
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
  <DataLoaderMulti
     sheetKey="elements"
        hideColumn="elements/hide"
           discoverableColumn="undefined/undefined"
        >
    <Route
       path="/"
       keepAlive={true}
    >
      <LayoutShell
      >
      <svelte:fragment slot="TopBar">
        <StaticText
           text="List View"
        >
        </StaticText>
      </svelte:fragment>
      <svelte:fragment slot="Content">
        <ScrollContainer
        >
          <SectionShell
          >
            <DataList
            >
            <svelte:fragment slot="dataElement">
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
            <svelte:fragment slot="emptyElement">
            </svelte:fragment>
            </DataList>
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
      </LayoutShell>
    </Route>
    <Route
       path="/map"
       keepAlive={true}
    >
      <LayoutShell
      >
      <svelte:fragment slot="TopBar">
        <StaticText
           text="Map View"
        >
        </StaticText>
      </svelte:fragment>
      <svelte:fragment slot="Content">
        <MapSimple
              markerPositionsColumn="elements/location"
           customIconColumn="elements/image"
           markerLabelColumn="elements/markerLabel"
           markerTitleColumn="elements/markerTitle"
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
                effect={{"effectType":"dataRouteSingle","path":"/element"}}
             imageColumn="elements/image"
             headlineColumn="elements/headline"
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
      </LayoutShell>
    </Route>
    <DataRouteSingle
       path="/element"
       sheet="elements"
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
          <DataCell
             column="elements/title"
             format="string"
             inline={false}
             centerContent={false}
          >
          </DataCell>
        </svelte:fragment>
        <svelte:fragment slot="right">
        </svelte:fragment>
        </HorizontalSpacer>
      </svelte:fragment>
      <svelte:fragment slot="Content">
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
      </svelte:fragment>
      </TopBarShell>
    </DataRouteSingle>
  </DataLoaderMulti>
</AppBase>

<Route
   path="/"
   keepAlive={true}
>
  <LayoutShell
  >
  <svelte:fragment slot="TopBar">
    <StaticText
       text="List View"
    >
    </StaticText>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <ScrollContainer
    >
      <SectionShell
      >
        <DataList
        >
        <svelte:fragment slot="dataElement">
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
        <svelte:fragment slot="emptyElement">
        </svelte:fragment>
        </DataList>
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
  </LayoutShell>
</Route>

<Route
   path="/map"
   keepAlive={true}
>
  <LayoutShell
  >
  <svelte:fragment slot="TopBar">
    <StaticText
       text="Map View"
    >
    </StaticText>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <MapSimple
          markerPositionsColumn="elements/location"
       customIconColumn="elements/image"
       markerLabelColumn="elements/markerLabel"
       markerTitleColumn="elements/markerTitle"
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
            effect={{"effectType":"dataRouteSingle","path":"/element"}}
         imageColumn="elements/image"
         headlineColumn="elements/headline"
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
  </LayoutShell>
</Route>

<DataRouteSingle
   path="/element"
   sheet="elements"
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
      <DataCell
         column="elements/title"
         format="string"
         inline={false}
         centerContent={false}
      >
      </DataCell>
    </svelte:fragment>
    <svelte:fragment slot="right">
    </svelte:fragment>
    </HorizontalSpacer>
  </svelte:fragment>
  <svelte:fragment slot="Content">
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
  </svelte:fragment>
  </TopBarShell>
</DataRouteSingle>
