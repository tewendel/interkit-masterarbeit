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

Warning: while developing, make sure you've set the version in your interkit.config.json to lower than the one on the server, otherwise the app will load the newer bundle from the server.


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

interkit comes with a system that allows a native app to download newer versions of a javascript bundle if it is available on the server.

- change the version in your interkit.config on the server 
- on startup, the app checks if the version on the server is newer and downloads this



### Publish to the app stores

you'll need screenshots - these are easiest to make with iphone and ipad simulators.
- 5.5 inch -> use iphone 8plus simulator
- 6.5 inch -> use iphone 11 simulator (you might need to double the resolution of the screenshots here manually)
- 12.9 ich -> use ipad pro simulator

Important: make sure you set a clear description of what you want to use the location data for in plist.info NSLocationWhenInUseUsageDescription - see https://developer.apple.com/design/human-interface-guidelines/patterns/accessing-private-data 

#### iOS

- In Xcode, select Any iOS Device as the deployment target.
- Choose Product from the top menu and click on Archive.
- The Xcode Organizer will launch, displaying any archives you’ve created in the past.
- Make sure the current build is selected and click on Distribute App and follow the prompts with the default options
- after you upload and select the build in App Store Connect - you will get 2 scary looking questions about encryption. If you are just using https, we've been selecting Yes to both questions.

#### Android

Build > Generate Signed Bundle/APK. You'll need to create a new key store in that same dialogue.
Follow this guide for more information: 
https://developer.android.com/studio/publish/app-signing#sign_release

You might have to change the targetSdkVersion located in android/variables.gradle (currently 31 is minimum for google play submissions).

In Android Studio, you will also need to add android:exported="false" to the Application node in App/AndroidManifest.xml and to capacitor-android/manifests/AndroidManifest.xml to the service node with the intent-filter:
````java
<service android:name="com.getcapacitor.CapacitorFirebaseMessagingService" android:stopWithTask="false" android:exported="false">
            <intent-filter>
````
https://github.com/ionic-team/capacitor/pull/5350/files