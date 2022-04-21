/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ params }) {

  const items = [
    {
      title: "Components",
      items: [
        {
          title: "MapSimple",
          path: "/components/MapSimple"
        },
        {
          title: "ElementList",
          path: "/components/ElementList"
        },
        {
          title: "ContentElement",
          path: "/components/ContentElement"
        },
        {
          title: "ElementsContextProvider",
          path: "/components/ElementsContextProvider"
        }        
      ]
    },
    {
      title: "Guides",
      items: [

      ]
    },
    {
      title: "Theory",
      items: [
        {
          title: '"Project Server"',
          path: "/theory/project-server"
        }
      ]
    },
    {
      title: "Contribute",
      items: [
        {
          title: "Docs",
          path: "/contribute/docs"
        },
      ]
    }
  ]

  return {
    body: {
      items
    }
  };
}

/*
const getFiles = async function(path, ext)  {
  const files = await import.meta.glob('./components/*\.(' + ext.join + ')$');
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
}*/