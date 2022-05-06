import { generateInterkitConfig } from './filesystem.mjs'

const get_local_config =  async (req, res) => {
  const projectSlug = req.params.projectSlug;
  let config = generateInterkitConfig({slug: projectSlug})
  res.send({...config, bundle_version: "local"})
}

export { get_local_config }