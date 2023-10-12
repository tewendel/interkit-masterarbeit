<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AppBase from "interkit/components/AppBase.svelte";
import DataCard from "interkit/components/DataCard.svelte";
import DataLoaderMulti from "interkit/components/DataLoaderMulti.svelte";
import MapSimple from "interkit/components/MapSimple.svelte";
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
    <MapSimple
          markerPositionsColumn="elements/position"
       customIconColumn="elements/image"
       markerLabelColumn="elements/markerLabel"
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
         rightArrow={false}
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
    <svelte:fragment slot="button">
    </svelte:fragment>
    </MapSimple>
  </DataLoaderMulti>
</AppBase>
