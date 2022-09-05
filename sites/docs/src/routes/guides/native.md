## Building native apps

### Prepare

- download your project onto your local machine that you will use for building the native apps

### Update your interkit.config

This file will determine which server your app uses to load itself - make sure it points to the right place.


### Basic capacitor setup

Edit capacitor.config.json file with details for your project (name, identifier) or use init tool:
```bash
npx cap init
```

#### Android

If you used the starter, you must also manually change android/res/values/strings.xml to update app_name, title_activity_main to your App name and package_name and custom_url_scheme to your app identifier (interkit.app.starter)

In addition, change the app identifier in the following files 
/android/app/build.gradle
/android/app/src/main/AndroidManifest.xml
/android/app/src/main/java/interkit/app/starter/MainActivity.java 
> and rename this path to fit your identifier

Warning: changing the app identifier will currently only work if you also replace the google-services.json with info from firebase (see [push setup dedicated guide](/guides/push_setup) )

#### iOS

Change the display name and bundle in xcode (click App in the tree on the left)

### Updating the app 

Build the app bundle in /public
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


### Icons and Splashscreen

replace the icon and splash screen files in the /resources directory (assuming you used starter to build you project) - make sure you use the exact same sizes

note: for android you also manually need to replace the android/icon-foreground.png and android/icon-background.png for some fancy android icon effect. 

run these commands to copy them into the native projects

```bash
cordova-res ios --skip-config --copy
cordova-res android --skip-config --copy
```

they should be included in your next build with the native dev tools

see also: https://github.com/ionic-team/capacitor-assets#capacitor


### Using live reload

- change the version in your interkit.config on the server 
- on startup, the app checks if the version on the server is newer and downloads this



### Publish to the app stores

you'll need screenshots - these are easiest to make with iphone and ipad simulators.
- 5.5 inch -> use iphone 8plus simulator
- 6.5 inch -> use iphone 11 simulator (you might need to double the resolution of the screenshots here manually)
- 12.9 ich -> use ipad pro simulator

