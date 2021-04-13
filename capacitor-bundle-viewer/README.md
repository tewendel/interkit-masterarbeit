#### Building native app containers from this project

Setup
```
npm install
gem install cocoapods
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