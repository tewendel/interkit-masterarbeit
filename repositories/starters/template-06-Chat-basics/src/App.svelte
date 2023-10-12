<script>
import initActions from "./actions.js"; 
initActions(); 
import { t, translations, lang } from 'interkit/i18n.js';
$: $translations, translations, t, $lang, lang, console.log('AppBase i18n $', { t, $translations, translations, $lang, lang });
console.log('AppBase i18n', { t, $translations, translations, $lang, lang });
import AnonymousLogin from "interkit/components/AnonymousLogin.svelte";
import AppBase from "interkit/components/AppBase.svelte";
import Chat from "interkit/components/Chat.svelte";
</script>

<AppBase
   languages="en"
>
  <AnonymousLogin
     defaultLang="en"
     >
    <Chat
       board="board1"
       messagesReportableDefault="TRUE"
       typingDurationTypeChoiceDefault="0.0"
       typingDurationTypeTextPerCharacter="0.075"
       >
    </Chat>
  </AnonymousLogin>
</AppBase>
