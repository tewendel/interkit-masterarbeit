#### STATUS: INACTIVE

With the update of interkit native containers to Capacitor 5, the interkit-live-reload functionality has become unavailable. Updates and further developement of this app has been frozen for now.

#### Viewer app for interkit projects

This app provides a qr scanner to download and run interkit project bundles using the live-reload functionality.

#### Building native app containers from this project

Setup
```
npm install
gem install cocoapods
```

Generate the bundle
```bash
npm run build
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