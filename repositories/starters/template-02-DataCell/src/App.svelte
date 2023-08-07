<script>
import initActions from "./actions.js"; 
initActions(); 
import { t, translations, lang } from 'interkit/i18n.js';
$: $translations, translations, t, $lang, lang, console.log('AppBase i18n $', { t, $translations, translations, $lang, lang });
console.log('AppBase i18n', { t, $translations, translations, $lang, lang });
import AppBase from "interkit/components/AppBase.svelte";
import DataCell from "interkit/components/DataCell.svelte";
import DataLoaderSingle from "interkit/components/DataLoaderSingle.svelte";
</script>

<AppBase
   >
  <DataLoaderSingle
     sheet="elements"
     rowKey="content1"
     customKeyColumn="elements/contentKey"
  >
    <DataCell
       column="elements/text"
       format="richText"
       inline={false}
       centerContent={false}
    >
    </DataCell>
  </DataLoaderSingle>
</AppBase>
