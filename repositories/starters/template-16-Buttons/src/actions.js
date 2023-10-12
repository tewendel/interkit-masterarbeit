import { registerActions, InterkitClient } from 'interkit'

export default () => registerActions([
  {
    triggers: ["test"],
    method: function (arg) {
       alert("action triggered (see actions.js)")
    }
  }
])
