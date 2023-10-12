export const onArrive = async (api, t) => {
  // access current language
  api.sendText('your language: ' + api.userLang)
  api.sendText('your language, index: ' + api.userLangIndex)
  // use current language
  if (api.userLang === 'en') api.sendText('your language is English')
  if (api.userLangIndex === 0) api.sendText('deine Sprache ist Deutsch')
  // ...as an array index
  let text1 = ['Katzen', 'Cats'][api.userLangIndex]
  // ...as an object key
  let text2 = {
    de: 'Kätzchen',
    en: 'Kittens'
  } [api.userLang]
  api.sendText(text1 + ' & ' + text2)
  // the t() helper function
  api.sendText(t('sind|are'))
  // ...also works with arrays
  api.sendText(t(['neugierig', 'curious']))
  // ...and objects
  api.sendText(t({
    en: 'aren\'t they',
    de: 'nicht wahr'
  }))
  // there are also the send…T helper functions
  api.sendTextT('Hunde weniger, oder?|Dogs not so much, right?')
  api.sendSystemT('nur Spaß|Just kidding')
  api.sendChoiceT({
    y: 'Ja|Yes',
    n: ['Nein', 'No']
  })
}

export const onMessage = async (msg, api) => {
  switch (msg.payload.key) {
    case 'y':
      await api.sendTextT('Wuff :(|Woof :(')
      break
    case 'n':
      await api.sendTextT('Wuff :)|Woof :)')
      break
  }
  api.moveTo('start')
}