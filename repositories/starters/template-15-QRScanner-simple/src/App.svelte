<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AppBase from "interkit/components/AppBase.svelte";
import Button from "interkit/components/Button.svelte";
import DataCard from "interkit/components/DataCard.svelte";
import DataRouteSingle from "interkit/components/DataRouteSingle.svelte";
import HorizontalSpacer from "interkit/components/HorizontalSpacer.svelte";
import Icon from "interkit/components/Icon.svelte";
import QRScanner from "interkit/components/QRScanner.svelte";
import Route from "interkit/components/Route.svelte";
import Spacing from "interkit/components/Spacing.svelte";
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
  <Route
     path="/"
     keepAlive={false}
  >
    <Spacing
       top="m"
       right="m"
       bottom="m"
       left="m"
    >
    </Spacing>
    <Spacing
       top="none"
       right="m"
       bottom="m"
       left="m"
    >
      <Button
         text="Open scanner"
         type="primary"
         size="medium"
         flex="normal"
            effect={{"effectType":"route","path":"/scanner"}}
      >
      </Button>
    </Spacing>
  </Route>
  <Route
     path="/scanner"
     keepAlive={false}
  >
    <QRScanner
       elementKeyColumn="elements/qrKey"
       closeEffect={{"effectType":"back"}}
       scanEffect={{"effectType":"dataRouteSingle","path":"/elements"}}
    >
    </QRScanner>
  </Route>
  <DataRouteSingle
     path="/elements"
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
              effect={{"effectType":"route","path":"/"}}
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
      </svelte:fragment>
      <svelte:fragment slot="content">
      </svelte:fragment>
      </DataCard>
    </svelte:fragment>
    </TopBarShell>
  </DataRouteSingle>
</AppBase>

<DataRouteSingle
   path="/elements"
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
            effect={{"effectType":"route","path":"/"}}
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
    </svelte:fragment>
    <svelte:fragment slot="content">
    </svelte:fragment>
    </DataCard>
  </svelte:fragment>
  </TopBarShell>
</DataRouteSingle>

<Route
   path="/scanner"
   keepAlive={false}
>
  <QRScanner
     elementKeyColumn="elements/qrKey"
     closeEffect={{"effectType":"back"}}
     scanEffect={{"effectType":"dataRouteSingle","path":"/elements"}}
  >
  </QRScanner>
</Route>

<Route
   path="/"
   keepAlive={false}
>
  <Spacing
     top="m"
     right="m"
     bottom="m"
     left="m"
  >
  </Spacing>
  <Spacing
     top="none"
     right="m"
     bottom="m"
     left="m"
  >
    <Button
       text="Open scanner"
       type="primary"
       size="medium"
       flex="normal"
          effect={{"effectType":"route","path":"/scanner"}}
    >
    </Button>
  </Spacing>
</Route>
