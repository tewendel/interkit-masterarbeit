<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AppBase from "interkit/components/AppBase.svelte";
import Spacing from "interkit/components/Spacing.svelte";
import StaticText from "interkit/components/StaticText.svelte";
import TextFormat from "interkit/components/TextFormat.svelte";
import styleTokens from "./styleTokens.json";
globalThis.styleTokens = styleTokens;
console.log('AppBase styleTokens', styleTokens);
initActions();
$: $translations, translations, t, $lang, lang, console.log('AppBase i18n $', { t, $translations, translations, $lang, lang });
console.log('AppBase i18n', { t, $translations, translations, $lang, lang });
</script>

<AppBase
   >
  <Spacing
     top="m"
     right="m"
     bottom="m"
     left="m"
  >
    <TextFormat
       interfaceFormat="none"
       contentFormat="headline-1"
    >
      <StaticText
         text="Hello, world!"
      >
      </StaticText>
    </TextFormat>
  </Spacing>
</AppBase>
