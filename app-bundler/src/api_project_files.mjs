import * as path from 'path'
import { existsSync, promises as fs } from 'fs'
import { getProjectPath } from './filesystem.mjs'

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

function method (main, dir="src") {
  return async (req, res) => {
    const resObj = {
      result: null,
      errors: []
    }
    const { projectId, filename } = req.params
    const handle = path.join(getProjectPath(projectId), dir, filename)
    try {
      console.log(handle, req.params)
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

let api = {}

api.read = method(
  (handle, params) => fs.readFile(handle).then(data => (
    {filename: params.filename, content: data.toString()}
  ))
)

// api.list = method(
//   await fs.promises.readdir(getRepoPath(projectId))
// )


// api.create = method(
//   async (handle, params) => {
//     return fs.writeFile(handle, "")
//   }
// )

api.update = method(
  async (handle, params, req) => {
    const data = req.body.toString()
    return fs.writeFile(handle, data)
  }
)

api.delete = method(
  async (handle) => {
    return fs.unlink(handle)
  }
)

export {
  api
}
