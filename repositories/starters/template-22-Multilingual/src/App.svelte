<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AnonymousLogin from "interkit/components/AnonymousLogin.svelte";
import AppBase from "interkit/components/AppBase.svelte";
import Chat from "interkit/components/Chat.svelte";
import DataCell from "interkit/components/DataCell.svelte";
import DataList from "interkit/components/DataList.svelte";
import DataLoaderMulti from "interkit/components/DataLoaderMulti.svelte";
import LangSwitch from "interkit/components/LangSwitch.svelte";
import Overlay from "interkit/components/Overlay.svelte";
import Spacing from "interkit/components/Spacing.svelte";
import StaticText from "interkit/components/StaticText.svelte";
import styleTokens from "./styleTokens.json";
globalThis.styleTokens = styleTokens;
console.log('AppBase styleTokens', styleTokens);
initActions();
$: $translations, translations, t, $lang, lang, console.log('AppBase i18n $', { t, $translations, translations, $lang, lang });
console.log('AppBase i18n', { t, $translations, translations, $lang, lang });
</script>

<AppBase
   languages="de,en"
>
  <AnonymousLogin
     defaultLang="en"
     >
    <LangSwitch
       label={$lang ? ($translations[$lang] && $translations[$lang]["$langswitch_label"] ? $translations[$lang]["$langswitch_label"] : "langswitch_label") : "…"}   reloadAfterSwitch="no"
    >
    </LangSwitch>
    <StaticText
       text={$lang ? ($translations[$lang] && $translations[$lang]["$cats"] ? $translations[$lang]["$cats"] : "cats") : "…"}>
    </StaticText>
    <DataLoaderMulti
       sheetKey="4aa16a47-fcea-4ca9-a288-e687b0112c88"
          hideColumn="elements/hide"
             discoverableColumn="undefined/undefined"
       discoverAnnotation="discovered"
       >
      <DataList
      >
      <svelte:fragment slot="dataElement">
        <Spacing
                    >
          <StaticText
             text="🐈"
          >
          </StaticText>
          <DataCell
             column={$lang ? "4aa16a47-fcea-4ca9-a288-e687b0112c88/" + "name$lang".replace("$lang", "$" + $lang) : "4aa16a47-fcea-4ca9-a288-e687b0112c88/name$lang"}   format="string"
             inline={true}
             centerContent={false}
          >
          </DataCell>
        </Spacing>
      </svelte:fragment>
      <svelte:fragment slot="emptyElement">
      </svelte:fragment>
      </DataList>
    </DataLoaderMulti>
    <StaticText
       text={$lang ? ($translations[$lang] && $translations[$lang]["$example_untranslated_text"] ? $translations[$lang]["$example_untranslated_text"] : "example_untranslated_text") : "…"}>
    </StaticText>
    <Overlay
          customStyle="height: 45vh; top: auto; bottom: 0; left: 1em; right: 1em; border: 1px solid black; border-bottom: 0;"
    >
      <Chat
         board="board1"
         messagesReportableDefault="TRUE"
         typingDurationTypeChoiceDefault="0.0"
         typingDurationTypeTextPerCharacter="0.075"
         >
      <svelte:fragment slot="Player">
      </svelte:fragment>
      </Chat>
    </Overlay>
  </AnonymousLogin>
</AppBase>
