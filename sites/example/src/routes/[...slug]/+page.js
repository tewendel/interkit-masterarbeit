import { error } from '@sveltejs/kit'

export async function load({ params }) {
	const pathParts = params.slug
    .replace(/(^\/|\/$)/g, '') // trim leading and trailing slashes
    .split('/')
    .filter(_ => _.substr(0, 1) !== '.') // browsers normalize paths but let's be extra careful

  if (pathParts?.[pathParts.length - 1]?.indexOf?.('.') > -1) {
    console.log('ignoring request for "regular file"', params.slug)
    return
  }

  let path = pathParts.join('/')

  if (path === '') path = 'index'

  let post
  let logFound
  let logTried = ''
  let logError

  /* The dynamic imports have to be *exactly this explicit* for static analysis.
   * They have to start with a "static" dot and end with a "static" extension,
   * e.g. this won't work:
   *   await import(`${path}${extension}`)
   * and this won't either, if path contains a slash?!
   *   await import(`./${path}.ext`)
   * This forces us to repeat ourselves with all these try blocks.
   */

  // try .svelte
	if (!post) {
		try {
			post = await import('../../content/' + path + '.svelte')
      logFound = '.svelte'
		} catch (error) {
      console.error(error)
      logTried += ' .svelte'
      logError = error
		}
	}

	// try .svelte.md
	if (!post) {
		try {
			post = await import('../../content/' + path + '.svelte.md')
      logFound = '.svelte.md'
		} catch (error) {
      logTried += ' .svelte.md'
      logError = error
		}
	}

	// try .md
	if (!post) {
		try {
			post = await import('../../content/' + path + '.md');
      logFound = '.md'
		} catch (error) {
      logTried += ' .md'
      logError = error
		}
	}

	// try .svx
	if (!post) {
		try {
			post = await import('../../content/' + path + '.svx');
      logFound = '.svx'
		} catch (error) {
      logTried += ' .svx'
      logError = error
		}
	}

  if (post) {
    console.log('found ../../content/', path, logFound)
  } else {
    console.error('error importing, tried ../../content/', path, logTried, 'last error', logError.message)
    throw error(404, 'test')
  }

  let content
  content = post?.default || null

  // const { title, date } = post.metadata;

	return {
		//post
		content
		//title,
		//date
	}
}
