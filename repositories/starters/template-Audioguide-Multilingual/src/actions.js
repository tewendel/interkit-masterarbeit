import { registerActions, InterkitClient } from 'interkit'
import { t, translations, lang } from 'interkit/i18n.js';
import { get } from 'svelte/store'

export default () => registerActions([
  {
    triggers: ["playAudio"],
    method: async function (arg) {
      
      if(arg?.payload?.elementRow) {
        // play the audio
        await InterkitClient.playFloatingAudio(
          arg.payload.elementRow, 
          "elements/audio$" + get(lang) // get current language
        )
        // hide the scanner
        InterkitClient.setUiKey("scanner", "false")
      }
     
    }
  }
])
