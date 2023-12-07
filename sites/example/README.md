# Interkit example website

Demonstrates the core that builds [Interkit website](https://interkit.app) and [Interkit docs](https://docs.interkit.app/), using `interkit-websitetools` and SvelteKit.

Interkit website tools and this example website are merely a minimal viable set of features,
not a complete solution that will work for other use cases, out of the box.

## How to create a new website

* clone this directory (or just use this one), e.g.:  
  `rsync ./ ../my-website/ -av` or  
  `cp -rav ./ ../my-website`
* `cd ../my-website`
* `npm install`
* optionally, edit `package.json`:
    * change the `vite dev --port` under `.scripts.dev`
    * change the project's/package's `.name` and `.version`
* at some point, run the dev server:  
  `npm run dev`
* edit `src/app.html`
    * edit the `<title>` and `<meta name="description">`
* start editing `src/content/structure.json.js`, and `links.js`,
  and, of course, the page contents, like `src/content/my-section/my-page.svelte.md`

## Interkit Website Tools

* The layout and visual appearance comes from the dependency 'interkit-websitetools'.
* There you can also find generic components (`Container`, `Btn`).
* Implementation overview
    * `src/routes/+layout.svelte` sets up website tools' `Layout.svelte` and loads the contents/structure
    * `src/routes/[...slug]/+page.js` handles the dynamic loading of content pages and error fallbacks (like 404)

## Instances

* The [Interkit website](https://interkit.app) implements a simple one-pager with anchor links
* The [Interkit docs](https://docs.interkit.app/) implements a rich structure

## TODOs

* [ ] `Breadcrumbs` currently expects exactly 3 levels of content hierarchy, and will look broken for `/` (index).
