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

const projectBoardPath = (projectId, boardIdOrPath, nodeId, suffix) => {
  const p = [
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

function method (main) {
  return async (req, res) => {
    const resObj = {
      result: null,
      errors: []
    }
    const { projectId, boardId, nodeId } = req.params
    const handle = projectBoardPath(projectId, boardId, nodeId)
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

const api = {
  boards: {},
  nodes: {}
}

api.boards.list = method(
  handle => fs.readdir(handle)
    .then(allFiles => allFiles
      .map(_ => _.match(boardFileNameRE)?.[1])
      .filter(_ => _ !== undefined)
    )
)

api.boards.read = method(
  async (handle, params) => {
    const board = await fs.readFile(handle)
      .then(file => JSON.parse(file.toString()))
    const handlePrefix = projectBoardPath(params.projectId)
    board.nodes = board.nodes || []
    board.nodes.forEach(node => { node.contents = null })
    const allFiles = await fs.readdir(handlePrefix)
    let startIdByFilename
    let startIdByMetaComment
    await Promise.all(allFiles
      .filter(file => file.substr(0, params.boardId.length + 1) === params.boardId + '_')
      .map(async file => {
        const id = file.match(nodeFileNameRE)?.[2]
        const contents = await getNode(projectBoardPath(params.projectId, [file]))
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
)

api.boards.create = method(
  async (handle, params) => {
    const board = newEmptyBoard(params)
    const startNodeHandle = projectBoardPath(params.projectId, params.boardId, startNodeId)
    // wx: fail if path exists
    return Promise.all([
      fs.appendFile(handle, JSON.stringify(board), { flag: 'wx' }),
      fs.appendFile(startNodeHandle, newEmptyNode, { flag: 'wx' })
    ])
  }
)

// this just overwrites, doesnt merge
api.boards.update = method(
  async (handle, params, req) => {
    const data = JSON.parse(req.body.toString())
    data.nodes.forEach(node => { delete node.contents })
    return fs.writeFile(handle, JSON.stringify(data))
      .then(() => data)
  }
)

// deletes all files prefixed with boardId
api.boards.delete = method(
  async (handle, params) => {
    const handlePrefix = projectBoardPath(params.projectId)
    const files = await fs.readdir(handlePrefix)
      .then(allFiles => allFiles.filter(
        file => file.substr(0, params.boardId.length) === params.boardId)
      )
    return Promise.all(
      files.map(file => fs.unlink(projectBoardPath(params.projectId, [file])))
    )
  }
)

api.nodes.create = method(
  async (handle, params) => {
    const data = newEmptyNode
    return fs.appendFile(handle, data, { flag: 'wx' })
      .then(() => getNode(handle))
  }
)

api.nodes.update = method(
  async (handle, params, req) => {
    const data = req.body.toString()
    return fs.writeFile(handle, data)
      .then(() => getNode(handle))
  }
)

api.nodes.delete = method(
  async (handle) => {
    return fs.unlink(handle)
  }
)

export {
  api
}
