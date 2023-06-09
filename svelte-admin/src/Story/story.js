import { writable } from 'svelte/store'

import { projectId } from '../admin.js'
import { boardsApi as api } from '../BundleServer.js'
import { genericErrorHandler, errorify } from '../apiHelpers.js'

export const boards = writable([])

let boardsLoaded = false;
let board = null
let currentBoardId = null

const loadBoardList = async (projectId) => {
  await api(projectId, '/')
    .then(async res => {
      const json = await res.json()
      errorify(json)
      boards.set(json.result)
      console.log('story.loadBoardList', boards)
      boardsLoaded = true;
    })
    .catch(genericErrorHandler)
}

projectId.subscribe(id => {
  if (!id) return
  // loadBoardList(id)
})

export default {
}
