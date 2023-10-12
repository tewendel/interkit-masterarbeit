import { registerActions, InterkitClient } from 'interkit'
import { get } from 'svelte/store'

export default () => registerActions([
  {
    triggers: ["scan"],
    method: async function (arg) {
    	   console.log("scan", arg)
      if(!arg?.payload?.targetFound) {
        console.warn("User scanned a wrong code")
      }
      let element = arg?.payload?.elementRow;
      if(element) {
              
        // set this element to checked
        InterkitClient.setElementProperty(element.key, "checked", "true")
      
        // find next element through index
        let elements = await InterkitClient.getRows("elements")
        
        let nextElement = elements?.find(e => e?.values?.index == element.values.next)
        
        console.log("nextElement found", nextElement)
        
        // set that element to discovered
        if(nextElement) {
          InterkitClient.setElementProperty(nextElement.key, "discovered", "true")
        } else {
          // if no next element, set this one as final
          InterkitClient.setElementProperty(element.key, "final", "true")
        }
        
        // hide the scanner
        InterkitClient.setUiKey("showScanner", "false")

        
        
      }
    
    }
  }
])
