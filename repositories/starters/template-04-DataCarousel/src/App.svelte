<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AppBase from "interkit/components/AppBase.svelte";
import DataCard from "interkit/components/DataCard.svelte";
import DataCarousel from "interkit/components/DataCarousel.svelte";
import DataLoaderMulti from "interkit/components/DataLoaderMulti.svelte";
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
  </DataLoaderMulti>
</AppBase>
