import { InterkitClient } from './'
import { get, writable } from 'svelte/store'

let userProjectData = InterkitClient.userProjectDataStore

const lang = writable()
const langIndex = writable()
const langs = writable([])

/* the two following subscriptions have to work in tandem against race conditions, since their order is murky.
 * (likeley langs will get set first and userProjectData later, I think)
 */

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
        langIndex.set(get(langs).indexOf(data.lang))
      }
    } else {
      if (get(langs)) {
        console.log('i18n userProjectData sub, data.lang not set, but langs are here, defaulting to first', get(langs))
        setUserLang(get(langs)[0])
      } else {
        console.log('i18n userProjectData sub, data.lang not set, no langs, setting to false')
        lang.set(false)
        langIndex.set(-1)
      }
    }
  })
}

/*
langs.subscribe(newLangs => {
  console.log('i18n langs subscribe, got', { newLangs })
  if (!newLangs.length) {
    console.log('i18n langs subscribe, not/empty Array, bailing')
    return
  }
  if (get(lang) === false) {
    console.log('i18n langs subscribe, lang not set in user project data, defaulting to first')
    lang.set(newLangs[0])
  } else {
    if (newLangs.indexOf(get(lang)) === -1) {
      console.log('i18n langs subscribe, lang was set in user project data, but seems invalid, resetting to default first')
      lang.set(newLangs[0])
    } else {
      console.log('i18n langs subscribe, lang was set in user project data, valid')
    }
  }
})
*/

const t = writable({
  'de': {
    '$test': 'de test'
  },
  'en': {
    '$test': 'en test'
  }
})

const sheetKey = 'bd74ea31-b3f7-4b97-8d33-43a586336524' // 'translation'
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
  const newT = {}
  rows.forEach(row => {
    const _id = row?.values?._id
    console.log('i18n build', { row, _id })
    if (!_id) return
    for (const lang in row.values) {
      console.log('i18n build', { _id, lang, value: row?.values?.[lang] })
      // if (validLangs.indexOf(lang) === -1) continue
      newT[lang] = newT[lang] || {}
      newT[lang]['$' + _id] = row.values[lang]
    }
  })
  console.groupEnd('i18n build rows')
  console.log('i18n build done', newT)
  t.set(newT)
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

export {
  t,
  lang,
  langIndex,
  langs,
  setUserLang,
  setupFrontend
}
