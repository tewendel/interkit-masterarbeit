import * as path from 'path'
import { promises as fs } from 'fs'
import { existsSync } from 'fs'

import { resolveProjectPath } from './utils.mjs'
import { processMarkdown } from './projectmeta.mjs'

const REPOSITORIES_PATH = process.env.REPOSITORIES_PATH

const names = ['README', 'readme', 'Readme', 'ReadMe']
const extensions = ['md', 'MD', 'markdown', 'Markdown']

export const get_readme = async (req, res) => {
  const projectId = req.params.projectId
  if (!projectId) {
    res.status(500)
    res.send('no projectId given')
    return
  }
  let filename = false
  names.forEach(name => {
    extensions.forEach(extension => {
      const tryPath = path.join(REPOSITORIES_PATH, 'projects', projectId, name + '.' + extension)
      console.log('get_readme, trying', name + '.' + extension,)
      if (existsSync(tryPath)) {
        filename = tryPath
        return
      }
    })
  })
  if (!filename) {
    res.status(404)
    res.send('readme not found')
    return
  }
  fs.readFile(filename)
    .then(file => file.toString())
    .then(async str => {
      const html = await processMarkdown(str)
      if (html) {
        res.status(200)
        res.contentType('text/html')
        res.send(html)
        return
      } else {
        res.status(500)
        res.send('error processing markdown')
      }
    })
    .catch(e => {
      console.error('get_readme error', e)
      res.status(500)
      res.send('error reading readme file')
      return
    })
}
