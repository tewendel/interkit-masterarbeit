/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */


export async function get({ params }) {
  console.log("query")
  const components = await getFiles(import.meta.glob('./components/**.(svx|svelte)'));
  const guides = await getFiles(import.meta.glob('./guides/**.(svx|svelte)'));
  const theory = await getFiles(import.meta.glob('./theory/**.(svx|svelte)'));

  const items = {
    guides,
    components,
    theory
  }

  if (items) {
    

    return {
      body: {
        items
      }
    };
  }
  return {
    status: 503,
    body: undefined
  };
}


const getFiles = async function(files)  {
  const items = await Promise.all(
  Object.entries(files).map(async ([path, page]) => {
    const { metadata } = {}//await page();
    const filename = path.split('/').pop();
    return { ...metadata, filename, path };
  })
  
);
  return items.sort((a, b) => b.filename - a.filename);
}