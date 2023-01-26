import * as path from 'path'
import { promises as fs } from 'fs'
import beautify from 'js-beautify'
import { idRE } from './project-regex.js'

// handle non-node/browser environment so we can import this as a module there
const REPOSITORIES_PATH = typeof process !== 'undefined' ? process.env.REPOSITORIES_PATH : ''

const newEmptyBoard = params => ({
  name: params.boardId,
  nodes: []
})

const newEmptyNode = `
export const onArrive = async (api) => {\n // do something\n}\n
export const onMessage = async (msg, api) => {\n  // do something\n}
`
const startNodeId = 'start'

const projectIdRE = /[\w\d]+/
const idParamRE = new RegExp(idRE, 'u')

const handleREnodeId = new RegExp(`${idRE}_(${idRE})\\.js$`, 'u')
const nodeFileNameRE = new RegExp(`^(${idRE})_(${idRE})\\.js$`, 'u')
const boardFileNameRE = new RegExp(`^(${idRE})\\.json$`, 'u')
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
    if (
      (projectId && !projectIdRE.test(projectId)) ||
      (boardId && !idParamRE.test(boardId)) ||
      (nodeId && !idParamRE.test(nodeId))
    ) {
      res.status(400)
      res.contentType('application/json')
      res.send({ errors: [ { message: 'invalid param' } ] })
      return
    }
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
lib.boards.list = (handle, params, req) => {
  if (req?.query?.nodes) {
    return fs.readdir(handle)
      .then(allFiles => ({
        boards: allFiles
          .map(_ => _.match(boardFileNameRE)?.[1])
          .filter(_ => _ !== undefined),
        nodes: allFiles
          .map(_ => {
            const m = _.match(nodeFileNameRE)
            if (!m) return
            return { boardId: m[1], nodeId: m[2] }
          })
          .filter(_ => _ !== undefined)
      }))
  } else {
    return fs.readdir(handle)
      .then(allFiles => allFiles
        .map(_ => _.match(boardFileNameRE)?.[1])
        .filter(_ => _ !== undefined)
      )
  }
}

api.boards.list = expressify(lib.boards.list)

/* this takes 
  - handle: path to board.json 
  - params: projectId, boardId, relative (set to true for use inside project server)
  return object with all nodes in the board and the starting
*/
lib.boards.read = async (handle, params) => {
  const board = await fs.readFile(handle)
    .then(async file => {
      const fileStr = await file.toString()
      try {
        return JSON.parse(fileStr)
      } catch (err) {
        console.warn('boards.read JSON parse error in file', handle, err)
        // console.log(fileStr)
        throw err
      }
    })
  const handlePrefix = projectBoardPath(params.relative, params.projectId)
  board.nodes = board.nodes || []
  board.nodes.forEach(node => { if (node) node.contents = null })
  const allFiles = await fs.readdir(handlePrefix)
  let startIdByFilename
  let startIdByMetaComment
  await Promise.all(allFiles
    .filter(file => file.substr(0, params.boardId.length + 1) === params.boardId + '_')
    .map(async file => {
      const id = file.match(nodeFileNameRE)?.[2]
      if (!id) {
        console.warn('boards.read, invalid handler file name, skipping', file)
        return false
      }
      const contents = await getNode(projectBoardPath(params.relative, params.projectId, [file]))
      const node = board.nodes.find(_ => _?.id === id)
      // console.log(id, contents, node)
      // TODO deleteme?
      if (!startIdByMetaComment && startNodeMetaCommentRE.test(contents)) {
        startIdByMetaComment = id
      }
      if (id === startNodeId && contents !== null) {
        startIdByFilename = id
      }
      if (node) {
        node.contents = contents
        // node.path = file
        node.modified = false
      } else {
        board.nodes.push({
          id,
          posX: 10,
          posY: 10,
          contents,
          // path: file,
          modified: false
        })
      }
    })
    .filter(file => !!file)
  )
  board.nodes = board.nodes.filter(node => node && (node.contents !== null))
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
lib.boards.update = (handle, params, req) => {
  const data = JSON.parse(req.body.toString())
  data.nodes.forEach(node => { if (node) delete node.contents })
  return fs.writeFile(handle, JSON.stringify(data, null, 2))
    .then(() => data)
}

api.boards.update = expressify(lib.boards.update)

lib.boards.patch = async (handle, params, req) => {
  const data = req?.body
    // passed via expressified
    ? JSON.parse(req.body.toString())
    // passed via lib
    : req
  const board = await lib.boards.read(handle, params)
  // manual merge
  for (const key in data) {
    if (key === 'nodes' || key === 'id') continue
    board[key] = data[key]
  }
  if ('nodes' in data) {
    data.nodes.forEach(srcNode => {
      const dstNode = board.nodes.find(_ => _.id === srcNode.id)
      if (!dstNode) {
        board.nodes.push(srcNode)
      } else {
        for (const key in srcNode) {
          dstNode[key] = srcNode[key]
        }
      }
    })
  }
  return fs.writeFile(handle, JSON.stringify(board, null, 2))
    .then(() => board)
}

api.boards.patch = expressify(lib.boards.patch)

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

api.boards.renameNode = expressify(
  async (handle, params) => {
    const { projectId, boardId, oldNodeId, newNodeId } = params
    const boardHandle = projectBoardPath(false, projectId, boardId)
    let board
    try {
      board = await fs.readFile(boardHandle)
        .then(file => JSON.parse(file.toString()))
      console.log('board before update', board)
      const node = board?.nodes
        ?.find(node => node.id === oldNodeId)
      if (!node) throw new Error(`node '${oldNodeId}' not found in board json`)
      node.id = newNodeId
      console.log('board after update', board)
      await fs.writeFile(boardHandle, JSON.stringify(board))
    } catch (err) {
      console.warn('error updating board json', err)
    }
    const oldHandle = projectBoardPath(false, projectId, boardId, oldNodeId)
    const newHandle = projectBoardPath(false, projectId, boardId, newNodeId)
    console.log('renaming', oldHandle, '->', newHandle)
    return fs.rename(oldHandle, newHandle)
  }
)

api.nodes.create = expressify(
  async (handle, params, req) => {
    const data = req.body.toString()
    return fs.appendFile(handle, data, { flag: 'wx' })
      .then(() => {
        if (req.query && 'posX' in req.query && 'posY' in req.query) {
          const boardHandle = projectBoardPath(params.relative, params.projectId, params.boardId)
          const fakeReq = {
            nodes: [ { id: params.nodeId, posX: +req.query.posX, posY: +req.query.posY } ]
          }
          lib.boards.patch(boardHandle, params, fakeReq)
        }
      })
      .then(() => getNode(handle))
  }
)

api.nodes.update = expressify(
  async (handle, params, req) => {
    const options = {indent_size: 2}
    const data = beautify(req.body.toString(), options)
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
  api,
}
