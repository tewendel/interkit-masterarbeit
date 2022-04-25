//import { send } from 'interkit/api';
//import { moveTo } from projectApi

//export const name = "demo handler"

//export const onArrive = () => {
//  send.text("hallo, herzlich willkommen")
//}
//

export const onMessage = async (msg, api) => {
  api.send(`${msg.payload.text}, seriously?`)
  /*if(msg.text == "hey") {
    moveTo("step2") // daraus wir pfeil im admin interface generiert
  }*/
}
