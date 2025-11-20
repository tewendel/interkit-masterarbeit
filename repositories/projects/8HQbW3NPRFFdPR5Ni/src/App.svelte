<script>
import initActions from "./actions.js"; 
initActions(); 
import { t, translations, lang } from 'interkit/i18n.js';
$: $translations, translations, t, $lang, lang, console.log('AppBase i18n $', { t, $translations, translations, $lang, lang });
console.log('AppBase i18n', { t, $translations, translations, $lang, lang });
import AppBase from "interkit/components/AppBase.svelte";
import StaticText from "interkit/components/StaticText.svelte";
</script>

<AppBase
   >
  <StaticText
     text="Welcome"
     tag="h1"
  >
  </StaticText>
</AppBase>
