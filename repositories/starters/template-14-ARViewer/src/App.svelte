<script>
import initActions from "./actions.js"; 
initActions(); 
import { t, translations, lang } from 'interkit/i18n.js';
$: $translations, translations, t, $lang, lang, console.log('AppBase i18n $', { t, $translations, translations, $lang, lang });
console.log('AppBase i18n', { t, $translations, translations, $lang, lang });
import AppBase from "interkit/components/AppBase.svelte";
import ARViewer from "interkit/components/ARViewer.svelte";
import Button from "interkit/components/Button.svelte";
import DataLoaderSingle from "interkit/components/DataLoaderSingle.svelte";
import Route from "interkit/components/Route.svelte";
import Spacing from "interkit/components/Spacing.svelte";
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
      <Button
         text="Open AR Viewer"
         effect={{"effectType":"route","path":"/item"}}
            size="large"
         flex="fill"
      >
      </Button>
    </Spacing>
  </Route>
  <Route
     path="/item"
     keepAlive={false}
  >
    <DataLoaderSingle
       sheet="elements"
       rowKey="101a271e-8f72-43b7-bfe2-be5ede8102fd"
       >
      <ARViewer
         titleColumn="elements/title"
         glbColumn="elements/glbFile"
         usdzColumn="elements/usdzFile"
         modelPreviewImageColumn="elements/modelPreviewImageColumn"
         videoColumn="elements/video"
            startButtonText="Start"
         videoButtonText="Video"
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
    </DataLoaderSingle>
  </Route>
</AppBase>

<Route
   path="/item"
   keepAlive={false}
>
  <DataLoaderSingle
     sheet="elements"
     rowKey="101a271e-8f72-43b7-bfe2-be5ede8102fd"
     >
    <ARViewer
       titleColumn="elements/title"
       glbColumn="elements/glbFile"
       usdzColumn="elements/usdzFile"
       modelPreviewImageColumn="elements/modelPreviewImageColumn"
       videoColumn="elements/video"
          startButtonText="Start"
       videoButtonText="Video"
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
  </DataLoaderSingle>
</Route>
