import { registerActions, InterkitClient } from 'interkit'

export default () => registerActions([
  {
    triggers: ["start"],
    method: function (arg) {
	       InterkitClient.setUserVar("profilePicture", "9da1631a-0b3a-498d-abbf-1958873b6fbe")
    	   InterkitClient.setUserVar("name", "Anna")
       InterkitClient.setUserVar("level", "1")
    }
  }
])
