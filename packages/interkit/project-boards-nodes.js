import * as path from 'path'
import { existsSync, promises as fs } from 'fs'

const REPOSITORIES_PATH = process.env.REPOSITORIES_PATH

const newEmptyBoard = params => ({
  name: params.boardId,
  nodes: []
})

const newEmptyNode = `
export const onArrive = async (api) => {\n // do something\n}\n
export const onMessage = async (msg, api) => {\n  // do something\n}
`
const startNodeId = 'start'

const handleREnodeId = /[a-z0-9]+_([a-z0-9]+)\.js$/
const nodeFileNameRE = /^([a-z0-9]+)_([a-z0-9]+)\.js$/
const boardFileNameRE = /^([a-z0-9]+).json$/
const startNodeMetaCommentRE = /(\/\/|\/\*)\s*start!/

const projectBoardPath = (relative=false, projectId, boardIdOrPath, nodeId, suffix) => {
  // set relative to true for use from project server
  const p = relative ? ['.', 'handlers'] :
  [
    REPOSITORIES_PATH,
    'projects',
    projectId,
    'server',
    'handlers'
  ]
  if (typeof boardIdOrPath === 'object') {
    p.push(...boardIdOrPath)
  } else {
    const boardId = boardIdOrPath
    if (boardId) {
      if (nodeId) p.push(`${boardId}_${nodeId}${suffix ? suffix : '.js'}`)
      else p.push(`${boardId}${suffix ? suffix : '.json'}`)
    }
  }
  return path.join(...p)
}

const errorCode = code => {
  switch (code) {
    case 'ENOENT': return 404
    case 'EISDIR': return 400
    case 'EEXIST': return 400
    default: return 500
  }
}

const handleError = (e, res, resObj) => {
  res.status(errorCode(e?.code))
  resObj.errors.push({
    error: 'boards API error',
    // FIXME is this a possible security risk?
    errorMessage: e?.toString?.()
  })
}

// wraps a function for use in express context
function expressify (main) {
  return async (req, res) => {
    const resObj = {
      result: null,
      errors: []
    }
    const { projectId, boardId, nodeId } = req.params
    const handle = projectBoardPath(false, projectId, boardId, nodeId)
    try {
      resObj.result = await main(handle, req.params, req, res)
      res.status(200)
    } catch (e) {
      console.error(e)
      handleError(e, res, resObj)
    } finally {
      res.contentType('application/json')
      res.send(resObj)
    }
  }
}

const getNode = handle => fs.readFile(handle).then(file => file.toString())

// this contains the utility functions
const lib = {
  boards: {}
}

// this contains functions wrapped with expressify for use in express context (in bundler)
const api = {
  boards: {},
  nodes: {}
}

/* this takes 
  - handle: path to handlers directory
  returns list of boards
*/
lib.boards.list = handle => fs.readdir(handle)
  .then(allFiles => allFiles
    .map(_ => _.match(boardFileNameRE)?.[1])
    .filter(_ => _ !== undefined)
  )

api.boards.list = expressify(lib.boards.list)

/* this takes 
  - handle: path to board.json 
  - params: projectId, boardId, relative (set to true for use inside project server)
  return object with all nodes in the board and the starting
*/
lib.boards.read = async (handle, params) => {
  const board = await fs.readFile(handle)
    .then(file => JSON.parse(file.toString()))
  const handlePrefix = projectBoardPath(params.relative, params.projectId)
  board.nodes = board.nodes || []
  board.nodes.forEach(node => { node.contents = null })
  const allFiles = await fs.readdir(handlePrefix)
  let startIdByFilename
  let startIdByMetaComment
  await Promise.all(allFiles
    .filter(file => file.substr(0, params.boardId.length + 1) === params.boardId + '_')
    .map(async file => {
      const id = file.match(nodeFileNameRE)?.[2]
      const contents = await getNode(projectBoardPath(params.relative, params.projectId, [file]))
      const node = board.nodes.find(_ => _.id === id)
      // console.log(id, contents, node)
      if (!startIdByMetaComment && startNodeMetaCommentRE.test(contents)) {
        startIdByMetaComment = id
      }
      if (id === startNodeId && contents !== null) {
        startIdByFilename = id
      }
      if (node) {
        node.contents = contents
        node.path = file
        node.modified = false
      } else {
        board.nodes.push({
          id,
          posX: 10,
          posY: 10,
          contents,
          path: file,
          modified: false
        })
      }
    })
  )
  board.nodes = board.nodes.filter(node => node.contents !== null)
  let startId = startIdByMetaComment || (startIdByFilename || board.nodes[0]?.id)
  board.startId = startId
  return board
}

// expects projectId and boardId
lib.boards.readFromProject = (projectId, boardId) => {
  const handle = projectBoardPath(true, projectId, boardId)
  return lib.boards.read(handle, {projectId, boardId, relative: true})
}

api.boards.read = expressify(lib.boards.read)

api.boards.create = expressify(
  async (handle, params) => {
    const board = newEmptyBoard(params)
    const startNodeHandle = projectBoardPath(false, params.projectId, params.boardId, startNodeId)
    // wx: fail if path exists
    return Promise.all([
      fs.appendFile(handle, JSON.stringify(board), { flag: 'wx' }),
      fs.appendFile(startNodeHandle, newEmptyNode, { flag: 'wx' })
    ])
  }
)

// this just overwrites, doesnt merge
api.boards.update = expressify(
  async (handle, params, req) => {
    const data = JSON.parse(req.body.toString())
    data.nodes.forEach(node => { delete node.contents })
    return fs.writeFile(handle, JSON.stringify(data))
      .then(() => data)
  }
)

// deletes all files prefixed with boardId
api.boards.delete = expressify(
  async (handle, params) => {
    const handlePrefix = projectBoardPath(false, params.projectId)
    const files = await fs.readdir(handlePrefix)
      .then(allFiles => allFiles.filter(
        file => file.substr(0, params.boardId.length) === params.boardId)
      )
    return Promise.all(
      files.map(file => fs.unlink(projectBoardPath(false, params.projectId, [file])))
    )
  }
)

api.nodes.create = expressify(
  async (handle, params, req) => {
    const data = req.body.toString()
    return fs.appendFile(handle, data, { flag: 'wx' })
      .then(() => getNode(handle))
  }
)

api.nodes.update = expressify(
  async (handle, params, req) => {
    const data = req.body.toString()
    return fs.writeFile(handle, data)
      .then(() => getNode(handle))
  }
)

api.nodes.delete = expressify(
  async (handle) => {
    return fs.unlink(handle)
  }
)

export {
  lib,
  api
}
