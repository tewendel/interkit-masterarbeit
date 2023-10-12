<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AppBase from "interkit/components/AppBase.svelte";
import Button from "interkit/components/Button.svelte";
import DataCard from "interkit/components/DataCard.svelte";
import DataCell from "interkit/components/DataCell.svelte";
import DataList from "interkit/components/DataList.svelte";
import DataLoaderMulti from "interkit/components/DataLoaderMulti.svelte";
import DataRouteMulti from "interkit/components/DataRouteMulti.svelte";
import DataRouteSingle from "interkit/components/DataRouteSingle.svelte";
import HorizontalSpacer from "interkit/components/HorizontalSpacer.svelte";
import Icon from "interkit/components/Icon.svelte";
import LayoutShell from "interkit/components/LayoutShell.svelte";
import NavBar from "interkit/components/NavBar.svelte";
import NavButton from "interkit/components/NavButton.svelte";
import Route from "interkit/components/Route.svelte";
import ScrollContainer from "interkit/components/ScrollContainer.svelte";
import SectionShell from "interkit/components/SectionShell.svelte";
import StaticText from "interkit/components/StaticText.svelte";
import TextFormat from "interkit/components/TextFormat.svelte";
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
  <DataRouteMulti
     path="/"
     sheet="elements"
     keepAlive={false}
        hideColumn="elements/hide"
           discoverableColumn="elements/discoverable"
        >
    <LayoutShell
    >
    <svelte:fragment slot="TopBar">
      <StaticText
         text="Cats"
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
               variant="large"
                  effect={{"effectType":"dataRouteSingle","path":"/cat"}}
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
             text="Cats"
             disabled={false}
             effect={{"effectType":"route","path":"/"}}
          >
          </NavButton>
          <NavButton
             text="Categories"
             disabled={false}
             effect={{"effectType":"route","path":"/categories"}}
          >
          </NavButton>
        </NavBar>
    </svelte:fragment>
    </LayoutShell>
  </DataRouteMulti>
  <DataRouteSingle
     path="/cat"
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
           column="categories/title"
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
        </svelte:fragment>
        </DataCard>
        <SectionShell
        >
          <StaticText
             text="This cat belongs to the following categories"
          >
          </StaticText>
          <DataLoaderMulti
             sheetKey="categories"
                hideColumn="elements/hide"
                   discoverableColumn="elements/discoverable"
                referenceColumn="elements/category"
          >
            <DataList
            >
            <svelte:fragment slot="dataElement">
              <Button
                    type="list-item"
                 size="small"
                 flex="normal"
                    effect={{"effectType":"dataRouteSingle","path":"/category"}}
              >
                <DataCell
                   column="categories/name"
                   format="string"
                   inline={false}
                   centerContent={false}
                >
                </DataCell>
              </Button>
            </svelte:fragment>
            <svelte:fragment slot="emptyElement">
            </svelte:fragment>
            </DataList>
          </DataLoaderMulti>
        </SectionShell>
      </ScrollContainer>
    </svelte:fragment>
    </TopBarShell>
  </DataRouteSingle>
  <Route
     path="/categories"
     keepAlive={false}
  >
    <LayoutShell
    >
    <svelte:fragment slot="TopBar">
      <StaticText
         text="Categories"
      >
      </StaticText>
    </svelte:fragment>
    <svelte:fragment slot="Content">
      <ScrollContainer
      >
        <SectionShell
        >
          <DataLoaderMulti
             sheetKey="categories"
                hideColumn="elements/hide"
                   discoverableColumn="elements/discoverable"
                >
            <DataList
            >
            <svelte:fragment slot="dataElement">
              <Button
                    type="list-item"
                 size="medium"
                 flex="normal"
                    effect={{"effectType":"dataRouteSingle","path":"/category"}}
              >
                <DataCell
                   column="categories/name"
                   format="string"
                   inline={false}
                   centerContent={false}
                >
                </DataCell>
              </Button>
            </svelte:fragment>
            <svelte:fragment slot="emptyElement">
            </svelte:fragment>
            </DataList>
          </DataLoaderMulti>
        </SectionShell>
      </ScrollContainer>
    </svelte:fragment>
    <svelte:fragment slot="BottomBar">
        <NavBar
        >
          <NavButton
             text="Cats"
             disabled={false}
             effect={{"effectType":"route","path":"/"}}
          >
          </NavButton>
          <NavButton
             text="Categories"
             disabled={false}
             effect={{"effectType":"route","path":"/categories"}}
          >
          </NavButton>
        </NavBar>
    </svelte:fragment>
    </LayoutShell>
  </Route>
  <DataRouteSingle
     path="/category"
     sheet="categories"
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
           interfaceFormat="headline-4"
           contentFormat="none"
        >
          <DataCell
             column="categories/name"
             format="string"
             inline={false}
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
      <DataCell
         column="categories/description"
         format="richText"
         inline={false}
         centerContent={false}
      >
      </DataCell>
      <SectionShell
      >
        <DataLoaderMulti
           sheetKey="elements"
              hideColumn="elements/hide"
                 discoverableColumn="elements/discoverable"
              referenceColumn="elements/category"
        >
          <DataList
          >
          <svelte:fragment slot="dataElement">
            <DataCard
               variant="medium"
                  effect={{"effectType":"dataRouteSingle","path":"/cat"}}
               imageColumn="elements/image"
               headlineColumn="categories/title"
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
    </TopBarShell>
  </DataRouteSingle>
</AppBase>

<DataRouteMulti
   path="/"
   sheet="elements"
   keepAlive={false}
      hideColumn="elements/hide"
         discoverableColumn="elements/discoverable"
      >
  <LayoutShell
  >
  <svelte:fragment slot="TopBar">
    <StaticText
       text="Cats"
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
             variant="large"
                effect={{"effectType":"dataRouteSingle","path":"/cat"}}
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
           text="Cats"
           disabled={false}
           effect={{"effectType":"route","path":"/"}}
        >
        </NavButton>
        <NavButton
           text="Categories"
           disabled={false}
           effect={{"effectType":"route","path":"/categories"}}
        >
        </NavButton>
      </NavBar>
  </svelte:fragment>
  </LayoutShell>
</DataRouteMulti>

<DataRouteSingle
   path="/cat"
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
         column="categories/title"
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
      </svelte:fragment>
      </DataCard>
      <SectionShell
      >
        <StaticText
           text="This cat belongs to the following categories"
        >
        </StaticText>
        <DataLoaderMulti
           sheetKey="categories"
              hideColumn="elements/hide"
                 discoverableColumn="elements/discoverable"
              referenceColumn="elements/category"
        >
          <DataList
          >
          <svelte:fragment slot="dataElement">
            <Button
                  type="list-item"
               size="small"
               flex="normal"
                  effect={{"effectType":"dataRouteSingle","path":"/category"}}
            >
              <DataCell
                 column="categories/name"
                 format="string"
                 inline={false}
                 centerContent={false}
              >
              </DataCell>
            </Button>
          </svelte:fragment>
          <svelte:fragment slot="emptyElement">
          </svelte:fragment>
          </DataList>
        </DataLoaderMulti>
      </SectionShell>
    </ScrollContainer>
  </svelte:fragment>
  </TopBarShell>
</DataRouteSingle>

<Route
   path="/categories"
   keepAlive={false}
>
  <LayoutShell
  >
  <svelte:fragment slot="TopBar">
    <StaticText
       text="Categories"
    >
    </StaticText>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <ScrollContainer
    >
      <SectionShell
      >
        <DataLoaderMulti
           sheetKey="categories"
              hideColumn="elements/hide"
                 discoverableColumn="elements/discoverable"
              >
          <DataList
          >
          <svelte:fragment slot="dataElement">
            <Button
                  type="list-item"
               size="medium"
               flex="normal"
                  effect={{"effectType":"dataRouteSingle","path":"/category"}}
            >
              <DataCell
                 column="categories/name"
                 format="string"
                 inline={false}
                 centerContent={false}
              >
              </DataCell>
            </Button>
          </svelte:fragment>
          <svelte:fragment slot="emptyElement">
          </svelte:fragment>
          </DataList>
        </DataLoaderMulti>
      </SectionShell>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
           text="Cats"
           disabled={false}
           effect={{"effectType":"route","path":"/"}}
        >
        </NavButton>
        <NavButton
           text="Categories"
           disabled={false}
           effect={{"effectType":"route","path":"/categories"}}
        >
        </NavButton>
      </NavBar>
  </svelte:fragment>
  </LayoutShell>
</Route>

<DataRouteSingle
   path="/category"
   sheet="categories"
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
         interfaceFormat="headline-4"
         contentFormat="none"
      >
        <DataCell
           column="categories/name"
           format="string"
           inline={false}
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
    <DataCell
       column="categories/description"
       format="richText"
       inline={false}
       centerContent={false}
    >
    </DataCell>
    <SectionShell
    >
      <DataLoaderMulti
         sheetKey="elements"
            hideColumn="elements/hide"
               discoverableColumn="elements/discoverable"
            referenceColumn="elements/category"
      >
        <DataList
        >
        <svelte:fragment slot="dataElement">
          <DataCard
             variant="medium"
                effect={{"effectType":"dataRouteSingle","path":"/cat"}}
             imageColumn="elements/image"
             headlineColumn="categories/title"
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
  </TopBarShell>
</DataRouteSingle>
