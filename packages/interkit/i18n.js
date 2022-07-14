import { InterkitClient } from './'
import { writable } from 'svelte/store'

const fallbackLang = 'de'
const validLangs = ['de', 'en']

let userProjectData = InterkitClient.userProjectDataStore

const lang = writable()

userProjectData.subscribe(data => {
  console.log('uPD sub', data)
  if (data && data.lang) {
    lang.set(data.lang)
  }
})

// const t = (id, lang) => 'ttt' + lang + id
/*
const t = {
  'de': {
    '$AFoE': 'Ein Fragment vong Eden',
    '$foo': 'föö',
    '$Technisches': 'Technisches',
    '$Weiterlesen': 'Weiterlesen',
  },
  'en': {
    '$AFoE': 'A Fragment of Eden',
    '$foo': 'fuu',
    '$Technisches': 'Technical',
    '$Weiterlesen': 'Read on',
  }
}
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

const setup = async () => {
  console.log('i18n setup', { projectId })
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
  console.log('i18n setup', { rows })
  console.log('i18n setup $rows', $rows)
}

const projectIdSub = InterkitClient.projectId
projectIdSub.subscribe(id => {
  console.log('i18n projectId subscription', id)
  projectId = id
  // maybe the server is already connected?
  setup()
})

InterkitClient.connected.subscribe(status => {
  console.log('i18n connected subscription', { status })
  if (!status) return
  // server has to be connected before setup to store
  setup()
})

const build = rows => {
  console.log('i18n build', { rows })
  if (!rows) return
  const newT = {}
  rows.forEach(row => {
    const _id = row?.values?._id
    console.log('i18n build', { row, _id })
    if (!_id) return
    for (const lang in row.values) {
      console.log('i18n build', { _id, lang, value: row?.values?.[lang] })
      if (validLangs.indexOf(lang) === -1) continue
      newT[lang] = newT[lang] || {}
      newT[lang]['$' + _id] = row.values[lang]
    }
  })
  console.log('i18n build', { newT })
  t.set(newT)
}

/*
        InterkitClient.call('user.updateUserProjectData', {
          userId: user._id,
          projectId,
          key: "userVars",
          value: vars
        })
        */

// $: lang = $userProjectData?.lang

export {
  t,
  lang
}
