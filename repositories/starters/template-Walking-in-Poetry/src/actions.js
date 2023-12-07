import { registerActions, InterkitClient } from 'interkit'
import { get } from 'svelte/store'

export default () => registerActions([
    {
       triggers: ["unlock"],
       method: async function (arg) {
         
         console.log("unlock", arg?.payload?.elementKey)
         
         if(arg?.payload?.elementKey) {
         
           InterkitClient.setElementProperty(arg?.payload?.elementKey, "unlocked", "true")
           
           InterkitClient.setUiKey("scanner", "false")
         }
         
           
       }     	   
  }
])
