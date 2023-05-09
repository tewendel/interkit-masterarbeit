import remark from 'remark'
import remarkHtml from 'remark-html'

const markdownProcessor = remark()
  .use(remarkHtml)

export const processMarkdown = async str => {
  const ret = await markdownProcessor.process(str)
    .then(resp => {
      let html = resp.contents
      html = html.replace(/src="\.?\/?public\//, 'src="')
      return html
    })
    .catch(e => {
      console.log('markdown process error', e)
      return false
    })
  return ret
}
