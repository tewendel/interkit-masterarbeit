export const twinterkitSource = `
Willkommen zum Katzen-Chat!|Welcome to cat chat!

[[Weiter auf Deutsch|Switch to German->de]]
[[Zu Englisch wechseln|Stay English->en]]
` // end twinterkitSource

/* Warning! This code has been generated in Twine-ish-mode.
 * Changes below might be overwritten when it is edited the next time,
 * changes above will not work until you re-edit in twine-ish mode
 */

export const onArrive = async (api) => {
  api.sendTextT(`Willkommen zum Katzen-Chat!|Welcome to cat chat!`)
  api.sendChoiceT({
    "choice0": "Weiter auf Deutsch|Switch to German",
    "choice1": "Zu Englisch wechseln|Stay English"
  })
}

export const onMessage = async (msg, api) => {
  switch (msg.payload.key) {
    case 'choice0':
      api.moveTo('de')
      break
    case 'choice1':
      api.moveTo('en')
      break
  }
}