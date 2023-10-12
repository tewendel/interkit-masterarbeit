<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AppBase from "interkit/components/AppBase.svelte";
import DataCard from "interkit/components/DataCard.svelte";
import DataList from "interkit/components/DataList.svelte";
import DataLoaderMulti from "interkit/components/DataLoaderMulti.svelte";
import ScrollContainer from "interkit/components/ScrollContainer.svelte";
import SectionShell from "interkit/components/SectionShell.svelte";
import StaticText from "interkit/components/StaticText.svelte";
import styleTokens from "./styleTokens.json";
globalThis.styleTokens = styleTokens;
console.log('AppBase styleTokens', styleTokens);
initActions();
$: $translations, translations, t, $lang, lang, console.log('AppBase i18n $', { t, $translations, translations, $lang, lang });
console.log('AppBase i18n', { t, $translations, translations, $lang, lang });
</script>

<AppBase
   >
  <ScrollContainer
  >
    <SectionShell
    >
      <DataLoaderMulti
         sheetKey="elements"
            hideColumn="elements/hide"
               discoverableColumn="undefined/undefined"
            >
        <DataList
        >
        <svelte:fragment slot="dataElement">
          <DataCard
             variant="large"
                effect={undefined}
             imageColumn="elements/image"
             headlineColumn="elements/name"
             label1Column="elements/empty"
             subtitle1Column="elements/subtitle1"
             label2Column="elements/comment"
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
          <StaticText
             text="The list is empty."
          >
          </StaticText>
        </svelte:fragment>
        </DataList>
      </DataLoaderMulti>
    </SectionShell>
  </ScrollContainer>
</AppBase>
