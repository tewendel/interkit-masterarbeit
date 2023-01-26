import { InterkitClient } from './'
import { get, writable } from 'svelte/store'
import builtinTranslations from './i18n_messages.js'

let userProjectData = InterkitClient.userProjectDataStore

const lang = writable()
const langIndex = writable()
const langs = writable([])

/* has to be called after langs are populated from AppBase */
const setupFrontend = (setLangs) => {
  console.log('i18n setupFrontend', { setLangs })
  langs.set(setLangs)
  userProjectData.subscribe(data => {
    console.log('i18n userProjectData sub', { data, 'data.lang': data?.lang })
    if (data && data.lang) {
      if (get(langs)) {
        if (get(langs).indexOf(data.lang) === -1) {
          console.log('i18n userProjectData sub, data.lang set, but invalid, defaulting to first', get(langs))
          setUserLang(get(langs)[0])
        } else {
          console.log('i18n userProjectData sub, data.lang set, valid')
          lang.set(data.lang)
          langIndex.set(get(langs).indexOf(data.lang))
        }
      } else {
        console.warn('i18n userProjectData sub, data.lang set, langs not here, setting anyway')
        lang.set(data.lang)
        langIndex.set(get(langs)?.indexOf?.(data.lang))
      }
    } else {
      // TODO this caused problems with the async-ness
      // of (probably) projectId and multiple involved stores.
      // Now, we set this in the AnonymousLogin component,
      // which isn't ideal.
      console.log('i18n userProjectData sub, fired, but no data.lang, ignoring', { data })
      /*
      if (get(langs)) {
        console.log('i18n userProjectData sub, data.lang not set, but langs are here, defaulting to first', get(langs))
        setUserLang(get(langs)[0])
      } else {
        console.log('i18n userProjectData sub, data.lang not set, no langs, setting to false')
        lang.set(false)
        langIndex.set(-1)
      }
      */
    }
  })
}

const translations = writable(builtinTranslations)

const sheetKey = 'translation'
let sheetSub
let rowsSub
let projectId

const setupRows = async () => {
  console.log('i18n setupRows', { projectId })
  if (!projectId) return
  sheetSub = await InterkitClient.getSub(
    'rows',
    'rows',
    { sheetKey, projectId },
    _ => _.sheetKey === sheetKey
  )
  console.log('i18n setup', { sheetSub })
  if (!sheetSub || !sheetSub.data) return
  rowsSub = sheetSub.data
  rowsSub.subscribe(newRows => { build(newRows) })
}

const projectIdSub = InterkitClient.projectId
projectIdSub.subscribe(id => {
  console.log('i18n projectId subscription', id)
  projectId = id
  // maybe the server is already connected?
  setupRows()
})

InterkitClient.connected.subscribe(status => {
  console.log('i18n connected subscription', { status })
  if (!status) return
  // server has to be connected before setup to store
  setupRows()
})

const build = rows => {
  console.log('i18n build', { rows })
  if (!rows) return
  console.group('i18n build rows')
  const newT = { ...builtinTranslations }
  rows.forEach(row => {
    const _id = row?.values?._id
    console.log('i18n build', { row, _id })
    if (!_id) return
    for (const lang in row.values) {
      console.log('i18n build', { _id, lang, value: row?.values?.[lang] })
      newT[lang] = newT[lang] || {}
      newT[lang]['$' + _id] = row.values[lang]
    }
  })
  console.groupEnd('i18n build rows')
  console.log('i18n build done', newT)
  translations.set(newT)
}

const setUserLang = async (newLang) => {
  const userId = get(InterkitClient.userId)
  const newLangIndex = get(langs)?.indexOf(newLang)
  console.log('i18n setUserLang', { userId, newLang })
  if (!userId) {
    throw new Error('no userId')
  }
  await InterkitClient.call('user.updateUserProjectData', {
    userId,
    // projectId,
    key: "langIndex",
    value: newLangIndex
  })
  return InterkitClient.call('user.updateUserProjectData', {
    userId,
    // projectId,
    key: "lang",
    value: newLang
  })
}

const t = (id, fallback) => {
  fallback = fallback || '…'
  const langT = get(translations)?.[get(lang)]
  if (langT === null || typeof(langT) !== 'object') return fallback
  if (!(id in langT)) return id
  return langT[id]
}

export {
  builtinTranslations,
  t,
  translations,
  lang,
  langIndex,
  langs,
  setUserLang,
  setupFrontend
}
