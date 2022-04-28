# This is an interkit app

Edit this app in interkit admin or standalone

### Standalone development

based on [Svelte](https://svelte.dev)

*Note that you will need to have [Node.js](https://nodejs.org) installed.*

Install the dependencies...

```bash
cd svelte-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. 

#### Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).


#### Building native app containers from this project

Edit capacitor.config.json file with details for your project (name, identifier) or use init tool:
```bash
npx cap init
```

Add native projects
```bash
npx cap add ios
npx cap add android
```

Update the native projects with the current bundle from /public
```bash
npx cap sync
```

Open a native project with native dev tools (use these to build)
```bash
npx cap open ios
npx cap open android
```