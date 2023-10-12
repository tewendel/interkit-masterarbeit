import { registerActions, InterkitClient } from 'interkit'

export default () => registerActions([
  {
    triggers: ["QRCodeScanned"],
    method: function (arg) {
       console.log("scanned", arg)
    }
  }
])
