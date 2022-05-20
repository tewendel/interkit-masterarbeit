/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ params }) {

  const items = [
    {
      title: "Basics",
      items: [
        {
          title: 'How to build an app',
          path: "/basics/build_app"
        },
      ]
    },
    {
      title: "Guides",
      items: [
        {
          title: 'How to setup your own interkit server',
          path: "/guides/server_setup"
        },
        {
          title: 'Setup push notifications',
          path: "/guides/push_setup"
        }
      ]
    },
    {
      title: "Components",
      items: [
        {
          title: "Button",
          path: "/components/Button"
        },
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
        },
        {
          title: "ElementProvider",
          path: "/components/ElementProvider"
        },
        {
          title: "Chat",
          path: "/components/Chat"
        },
        {
          title: "SubsectionsNav",
          path: "/components/SubsectionsNav"
        },
        {
          title: "Subsection",
          path: "/components/Subsection"
        },                                
      ]
    },
    {
      title: "Theory",
      items: [
        {
          title: "Collection Schemas",
          path: "/theory/collections"
        },
        {
          title: '"Project Server"',
          path: "/theory/project-server"
        },
        {
          title: 'Server Architecture',
          path: "/theory/server-architecture"
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
        {
          title: "Component CSS",
          path: "/contribute/component_css"
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