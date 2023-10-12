export const twinterkitSource = `
Miau!|Meow!

[[Miau?|Meow?->examples]]
` // end twinterkitSource

/* Warning! This code has been generated in Twine-ish-mode.
 * Changes below might be overwritten when it is edited the next time,
 * changes above will not work until you re-edit in twine-ish mode
 */

export const onArrive = async (api) => {
  api.sendTextT(`Miau!|Meow!`)
  api.sendChoiceT({
    "choice0": "Miau?|Meow?"
  })
}

export const onMessage = async (msg, api) => {
  switch (msg.payload.key) {
    case 'choice0':
      api.moveTo('examples')
      break
  }
}