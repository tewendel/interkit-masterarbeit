<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AppBase from "interkit/components/AppBase.svelte";
import Button from "interkit/components/Button.svelte";
import DataCard from "interkit/components/DataCard.svelte";
import DataList from "interkit/components/DataList.svelte";
import DataLoaderMulti from "interkit/components/DataLoaderMulti.svelte";
import DataRouteMulti from "interkit/components/DataRouteMulti.svelte";
import DataRouteSingle from "interkit/components/DataRouteSingle.svelte";
import HorizontalSpacer from "interkit/components/HorizontalSpacer.svelte";
import Icon from "interkit/components/Icon.svelte";
import IfDataAnnotation from "interkit/components/IfDataAnnotation.svelte";
import Label from "interkit/components/Label.svelte";
import LayoutShell from "interkit/components/LayoutShell.svelte";
import NavButton from "interkit/components/NavButton.svelte";
import ScrollContainer from "interkit/components/ScrollContainer.svelte";
import SectionShell from "interkit/components/SectionShell.svelte";
import Spacing from "interkit/components/Spacing.svelte";
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
  <DataRouteMulti
     path="/"
     sheet="elements"
     keepAlive={false}
        hideColumn="elements/hide"
           discoverableColumn="undefined/undefined"
        >
    <LayoutShell
    >
    <svelte:fragment slot="TopBar">
      <StaticText
         text="All Cats"
      >
      </StaticText>
    </svelte:fragment>
    <svelte:fragment slot="Content">
      <ScrollContainer
      >
        <SectionShell
        >
          <DataLoaderMulti
             sheetKey="elements"
                hideColumn="elements/hide"
                   discoverableColumn="undefined/undefined"
             discoverAnnotation="discovered"
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
                  <IfDataAnnotation
                     key="bookmarked"
                     value="true"
                  >
                  <svelte:fragment slot="iftrue">
                    <Label
                       type="icon"
                             icon="Full-Bookmark"
                    >
                    </Label>
                  </svelte:fragment>
                  <svelte:fragment slot="else">
                  </svelte:fragment>
                  </IfDataAnnotation>
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
      </ScrollContainer>
    </svelte:fragment>
    <svelte:fragment slot="BottomBar">
        <NavButton
           text="All Cats"
           disabled={false}
           effect={{"effectType":"route","path":"/"}}
        >
          <Icon
             type="Thin-Archiv"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text="My Cats"
           disabled={false}
           effect={{"effectType":"route","path":"/bookmarked"}}
        >
          <Icon
             type="Thin-Bookmark"
             inverse={false}
          >
          </Icon>
        </NavButton>
    </svelte:fragment>
    </LayoutShell>
  </DataRouteMulti>
  <DataRouteMulti
     path="/bookmarked"
     sheet="elements"
     keepAlive={false}
        hideColumn=""
     includeOnlyAnnotated="bookmarked"
        discoverableColumn="elements/discoverable"
        >
    <LayoutShell
    >
    <svelte:fragment slot="TopBar">
      <StaticText
         text="My Cats"
      >
      </StaticText>
    </svelte:fragment>
    <svelte:fragment slot="Content">
      <ScrollContainer
      >
        <SectionShell
        >
          <DataLoaderMulti
             sheetKey="elements"
                hideColumn="elements/hide"
             includeOnlyAnnotated="bookmarked"
                discoverableColumn="elements/discoverable"
             discoverAnnotation="discovered"
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
                  <IfDataAnnotation
                     key="bookmarked"
                     value="true"
                  >
                  <svelte:fragment slot="iftrue">
                    <Label
                       type="icon"
                             icon="Full-Bookmark"
                    >
                    </Label>
                  </svelte:fragment>
                  <svelte:fragment slot="else">
                  </svelte:fragment>
                  </IfDataAnnotation>
              </svelte:fragment>
              <svelte:fragment slot="content">
              </svelte:fragment>
              </DataCard>
            </svelte:fragment>
            <svelte:fragment slot="emptyElement">
              <Spacing
                 top="s"
                 right="s"
                 bottom="s"
                 left="s"
              >
                <StaticText
                   text="You haven't bookmarked any cats yet."
                >
                </StaticText>
              </Spacing>
            </svelte:fragment>
            </DataList>
          </DataLoaderMulti>
        </SectionShell>
      </ScrollContainer>
    </svelte:fragment>
    <svelte:fragment slot="BottomBar">
        <NavButton
           text="All Cats"
           disabled={false}
           effect={{"effectType":"route","path":"/"}}
        >
          <Icon
             type="Thin-Archiv"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text="My Cats"
           disabled={false}
           effect={{"effectType":"route","path":"/bookmarked"}}
        >
          <Icon
             type="Thin-Bookmark"
             inverse={false}
          >
          </Icon>
        </NavButton>
    </svelte:fragment>
    </LayoutShell>
  </DataRouteMulti>
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
          <IfDataAnnotation
             key="bookmarked"
             value="true"
          >
          <svelte:fragment slot="iftrue">
            <Label
               type="icon"
                     icon="Full-Bookmark"
            >
            </Label>
          </svelte:fragment>
          <svelte:fragment slot="else">
          </svelte:fragment>
          </IfDataAnnotation>
      </svelte:fragment>
      <svelte:fragment slot="content">
          <IfDataAnnotation
             key="bookmarked"
             value="true"
          >
          <svelte:fragment slot="iftrue">
            <Button
               text="Remove Bookmark"
               type="secondary"
               size="medium"
               flex="normal"
               disabled={false}
               effect={{"effectType":"setDataAnnotation","value":"false","key":"bookmarked"}}
            >
            </Button>
          </svelte:fragment>
          <svelte:fragment slot="else">
            <Button
               text="Add Bookmark"
               type="primary"
               size="medium"
               flex="normal"
               disabled={false}
               effect={{"effectType":"setDataAnnotation","value":"true","key":"bookmarked"}}
            >
              <Icon
                 type="Full-Bookmark"
                 inverse={true}
              >
              </Icon>
            </Button>
          </svelte:fragment>
          </IfDataAnnotation>
      </svelte:fragment>
      </DataCard>
    </svelte:fragment>
    </TopBarShell>
  </DataRouteSingle>
</AppBase>

<DataRouteMulti
   path="/"
   sheet="elements"
   keepAlive={false}
      hideColumn="elements/hide"
         discoverableColumn="undefined/undefined"
      >
  <LayoutShell
  >
  <svelte:fragment slot="TopBar">
    <StaticText
       text="All Cats"
    >
    </StaticText>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <ScrollContainer
    >
      <SectionShell
      >
        <DataLoaderMulti
           sheetKey="elements"
              hideColumn="elements/hide"
                 discoverableColumn="undefined/undefined"
           discoverAnnotation="discovered"
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
                <IfDataAnnotation
                   key="bookmarked"
                   value="true"
                >
                <svelte:fragment slot="iftrue">
                  <Label
                     type="icon"
                           icon="Full-Bookmark"
                  >
                  </Label>
                </svelte:fragment>
                <svelte:fragment slot="else">
                </svelte:fragment>
                </IfDataAnnotation>
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
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavButton
         text="All Cats"
         disabled={false}
         effect={{"effectType":"route","path":"/"}}
      >
        <Icon
           type="Thin-Archiv"
           inverse={false}
        >
        </Icon>
      </NavButton>
      <NavButton
         text="My Cats"
         disabled={false}
         effect={{"effectType":"route","path":"/bookmarked"}}
      >
        <Icon
           type="Thin-Bookmark"
           inverse={false}
        >
        </Icon>
      </NavButton>
  </svelte:fragment>
  </LayoutShell>
</DataRouteMulti>

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
        <IfDataAnnotation
           key="bookmarked"
           value="true"
        >
        <svelte:fragment slot="iftrue">
          <Label
             type="icon"
                   icon="Full-Bookmark"
          >
          </Label>
        </svelte:fragment>
        <svelte:fragment slot="else">
        </svelte:fragment>
        </IfDataAnnotation>
    </svelte:fragment>
    <svelte:fragment slot="content">
        <IfDataAnnotation
           key="bookmarked"
           value="true"
        >
        <svelte:fragment slot="iftrue">
          <Button
             text="Remove Bookmark"
             type="secondary"
             size="medium"
             flex="normal"
             disabled={false}
             effect={{"effectType":"setDataAnnotation","value":"false","key":"bookmarked"}}
          >
          </Button>
        </svelte:fragment>
        <svelte:fragment slot="else">
          <Button
             text="Add Bookmark"
             type="primary"
             size="medium"
             flex="normal"
             disabled={false}
             effect={{"effectType":"setDataAnnotation","value":"true","key":"bookmarked"}}
          >
            <Icon
               type="Full-Bookmark"
               inverse={true}
            >
            </Icon>
          </Button>
        </svelte:fragment>
        </IfDataAnnotation>
    </svelte:fragment>
    </DataCard>
  </svelte:fragment>
  </TopBarShell>
</DataRouteSingle>

<DataRouteMulti
   path="/bookmarked"
   sheet="elements"
   keepAlive={false}
      hideColumn=""
   includeOnlyAnnotated="bookmarked"
      discoverableColumn="elements/discoverable"
      >
  <LayoutShell
  >
  <svelte:fragment slot="TopBar">
    <StaticText
       text="My Cats"
    >
    </StaticText>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <ScrollContainer
    >
      <SectionShell
      >
        <DataLoaderMulti
           sheetKey="elements"
              hideColumn="elements/hide"
           includeOnlyAnnotated="bookmarked"
              discoverableColumn="elements/discoverable"
           discoverAnnotation="discovered"
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
                <IfDataAnnotation
                   key="bookmarked"
                   value="true"
                >
                <svelte:fragment slot="iftrue">
                  <Label
                     type="icon"
                           icon="Full-Bookmark"
                  >
                  </Label>
                </svelte:fragment>
                <svelte:fragment slot="else">
                </svelte:fragment>
                </IfDataAnnotation>
            </svelte:fragment>
            <svelte:fragment slot="content">
            </svelte:fragment>
            </DataCard>
          </svelte:fragment>
          <svelte:fragment slot="emptyElement">
            <Spacing
               top="s"
               right="s"
               bottom="s"
               left="s"
            >
              <StaticText
                 text="You haven't bookmarked any cats yet."
              >
              </StaticText>
            </Spacing>
          </svelte:fragment>
          </DataList>
        </DataLoaderMulti>
      </SectionShell>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavButton
         text="All Cats"
         disabled={false}
         effect={{"effectType":"route","path":"/"}}
      >
        <Icon
           type="Thin-Archiv"
           inverse={false}
        >
        </Icon>
      </NavButton>
      <NavButton
         text="My Cats"
         disabled={false}
         effect={{"effectType":"route","path":"/bookmarked"}}
      >
        <Icon
           type="Thin-Bookmark"
           inverse={false}
        >
        </Icon>
      </NavButton>
  </svelte:fragment>
  </LayoutShell>
</DataRouteMulti>
