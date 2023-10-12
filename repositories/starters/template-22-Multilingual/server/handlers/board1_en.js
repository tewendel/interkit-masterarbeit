export const twinterkitSource = `

` // end twinterkitSource

/* Warning! This code has been generated in Twine-ish-mode.
 * Changes below might be overwritten when it is edited the next time,
 * changes above will not work until you re-edit in twine-ish mode
 */

export const onArrive = async (api) => {
  await api.sendSystem('English')
  await api.setLang('en', 1)
  api.moveTo('welcome')
}

export const onMessage = async (msg, api) => {
  switch (msg.payload.key) {}
}