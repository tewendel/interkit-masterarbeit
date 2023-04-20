# This is an interkit app

Edit this app in interkit admin or standalone

### Standalone development

based on [Svelte](https://svelte.dev)

*Note that you will need to have [Node.js](https://nodejs.org) installed.*

Install the dependencies...

```bash
npm install
```

...then start vite:

```bash
npm run dev
```

Navigate to [localhost:8000](http://localhost:8000). You should see your app running. 

#### Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).


#### Building native app containers from this project

Prerequisites / Troubleshooting:

* make sure you have `npm install`ed all packages
* you have to have built the project successfully (`npm run build`, see above)
* this folder has to reside within interkit's `repositories/projects/` (we use npm workspaces)
    * make sure the root interkit repo is up to date!  
      `cd ../../.. && npm run install:all`

export LANG=en_US.UTF-8

Edit capacitor.config.json file with details for your project (name, identifier) or use init tool:
```bash
npx cap init
```
(When cloning an existing project repository,
if you change the bundle identifier,
make sure to change it in *all* places!)

Add native projects
```bash
npx cap add ios
npx cap add android
```

Update the native projects with the current bundle from /public
```bash
npx cap sync android
npx cap sync ios

# troubleshooting:

# ios: Package.resolved file is corrupted or malformed
find . -name Package.resolved -delete # then re-open project in Xcode

# ios: WARNING: CocoaPods requires your terminal to be using UTF-8 encoding.
# or: The sandbox is not in sync with the Podfile.lock (because npx cap sync didn't finish successfully)
export LANG=en_US.UTF-8
```

Open a native project with native dev tools (use these to build)
```bash
npx cap open ios
npx cap open android
```

ios: If CocoaPods failed earlier to retrieve some packages (like FCM),
in XCode, go to the Project navigator – XCode should install any missing packages.

