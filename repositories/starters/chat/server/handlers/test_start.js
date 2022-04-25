// start

export const onArrive = async (api) => {
 api.send("welcome")
}

export const onMessage = async (msg, api) => {
  api.send("Okay")
}
