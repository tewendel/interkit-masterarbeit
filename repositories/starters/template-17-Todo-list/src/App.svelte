<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AppBase from "interkit/components/AppBase.svelte";
import Button from "interkit/components/Button.svelte";
import DataCard from "interkit/components/DataCard.svelte";
import DataList from "interkit/components/DataList.svelte";
import DataRouteMulti from "interkit/components/DataRouteMulti.svelte";
import DataRouteSingle from "interkit/components/DataRouteSingle.svelte";
import HorizontalSpacer from "interkit/components/HorizontalSpacer.svelte";
import Icon from "interkit/components/Icon.svelte";
import IfDataAnnotation from "interkit/components/IfDataAnnotation.svelte";
import Label from "interkit/components/Label.svelte";
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
  <DataRouteMulti
     path="/"
     sheet="elements"
     keepAlive={false}
        hideColumn="elements/hide"
           discoverableColumn="undefined/undefined"
        >
    <TopBarShell
    >
    <svelte:fragment slot="TopBar">
      <StaticText
         text="Todo List"
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
                <IfDataAnnotation
                   key="checked"
                   value="true"
                >
                <svelte:fragment slot="iftrue">
                  <Label
                     type="icon"
                           icon="Full-Check"
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
        </SectionShell>
      </ScrollContainer>
    </svelte:fragment>
    </TopBarShell>
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
               key="checked"
               value="true"
            >
            <svelte:fragment slot="iftrue">
              <Label
                 type="icon"
                       icon="Full-Check"
              >
              </Label>
            </svelte:fragment>
            <svelte:fragment slot="else">
            </svelte:fragment>
            </IfDataAnnotation>
        </svelte:fragment>
        <svelte:fragment slot="content">
            <IfDataAnnotation
               key="checked"
               value="true"
            >
            <svelte:fragment slot="iftrue">
              <Button
                 text="mark as not done"
                 type="secondary"
                 size="medium"
                 flex="normal"
                 disabled={false}
                 effect={{"effectType":"setDataAnnotation","value":"false","key":"checked"}}
              >
              </Button>
            </svelte:fragment>
            <svelte:fragment slot="else">
              <Button
                 text="mark as done"
                 type="primary"
                 size="medium"
                 flex="normal"
                 disabled={false}
                 effect={{"effectType":"setDataAnnotation","value":"true","key":"checked"}}
              >
                <Icon
                   type="Full-Check"
                   inverse={true}
                >
                </Icon>
              </Button>
            </svelte:fragment>
            </IfDataAnnotation>
        </svelte:fragment>
        </DataCard>
      </ScrollContainer>
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
  <TopBarShell
  >
  <svelte:fragment slot="TopBar">
    <StaticText
       text="Todo List"
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
              <IfDataAnnotation
                 key="checked"
                 value="true"
              >
              <svelte:fragment slot="iftrue">
                <Label
                   type="icon"
                         icon="Full-Check"
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
      </SectionShell>
    </ScrollContainer>
  </svelte:fragment>
  </TopBarShell>
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
             key="checked"
             value="true"
          >
          <svelte:fragment slot="iftrue">
            <Label
               type="icon"
                     icon="Full-Check"
            >
            </Label>
          </svelte:fragment>
          <svelte:fragment slot="else">
          </svelte:fragment>
          </IfDataAnnotation>
      </svelte:fragment>
      <svelte:fragment slot="content">
          <IfDataAnnotation
             key="checked"
             value="true"
          >
          <svelte:fragment slot="iftrue">
            <Button
               text="mark as not done"
               type="secondary"
               size="medium"
               flex="normal"
               disabled={false}
               effect={{"effectType":"setDataAnnotation","value":"false","key":"checked"}}
            >
            </Button>
          </svelte:fragment>
          <svelte:fragment slot="else">
            <Button
               text="mark as done"
               type="primary"
               size="medium"
               flex="normal"
               disabled={false}
               effect={{"effectType":"setDataAnnotation","value":"true","key":"checked"}}
            >
              <Icon
                 type="Full-Check"
                 inverse={true}
              >
              </Icon>
            </Button>
          </svelte:fragment>
          </IfDataAnnotation>
      </svelte:fragment>
      </DataCard>
    </ScrollContainer>
  </svelte:fragment>
  </TopBarShell>
</DataRouteSingle>
