/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */


export async function get({ params }) {
  console.log("query")
  const components = await getFiles(import.meta.glob('./components/**.(svx|svelte)'));
  const guides = await getFiles(import.meta.glob('./guides/**.(svx|svelte)'));
  const theory = await getFiles(import.meta.glob('./theory/**.(svx|svelte)'));

  const items = [
    {
      title: "Guides",
      items: guides
    },
    {
      title: "Components",
      items: components
    },
    {
      title: "Theory",
      items: theory
    }
  ]

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
    // remove file extension
    const uri = path.substring(1).replace(/\.[^/.]+$/, "");
    return { ...metadata, filename, path: uri };
  })
  
);
  return items.sort((a, b) => b.filename - a.filename);
}