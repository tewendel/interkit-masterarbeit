# Building native apps

## Table of contents

## Prepare

- download your project onto your local machine that you will use for building the native apps

## Update your interkit.config

This file will determine which server your app uses to load itself - make sure it points to the right place.


## Basic capacitor setup

Edit capacitor.config.json file with details for your project (name, identifier) or use init tool:
```bash
npx cap init
```

### Android

If you used the starter, you must also manually change `android/res/values/strings.xml` or `/android/app/src/main/res/values/strings.xml` to update 
- *app_name*
- *title_activity_main* to your App name
- *package_name*
- *custom_url_scheme* to your *app identifier* (e.g. interkit.app.starter. This is usually like a web domain written in inverse direction - com.companyname.projectname - You can make this up yourself)

In addition, change the *app identifier* in the following files 
- `/android/app/build.gradle`
- `/android/app/src/main/AndroidManifest.xml`
- `/android/app/src/main/java/interkit/app/starter/MainActivity.java` > and rename this path to fit your *app identifier* AND change the *app identifier* inside `MainActivity.java`

**Warning:** changing the *app identifier* will currently only work if you also replace the `google-services.json` with info from firebase (see [push setup dedicated guide](/guides/push_setup) )

Optionally, you can remove unneeded permissions from `/android/app/src/main/AndroidManifest.xml`,
e.g. `<uses-permission android:name="android.permission.CAMERA" />`.

### iOS

Change the *display name* and *bundle* in xcode (click App in the tree on the left)

### Re-creating capacitor directories/"platforms" (both Android and iOS)

Some places recommend to re-create your `android`/`ios` directories if you severely mess up your Capacitor setup;
or just to re-initialize it, e.g. after changing your bundleId.  
This is not as trivial. The directories cannot be recreated completely without manual tweaks.  
Generally, it works like this:

```shell
npm run build
rm -rf ios # or, swap ios with android
npx cap add ios
export LANG=en_US.UTF-8 # only needed for ios
npx cap sync ios
```

...but you might have to re-add permissions, like access to location, gps, camera etc.
If your project is version controlled,
check your `git diff` and restore all lines that relate to permissions,
usually in `ios/App/App/Info.plist` and `android/app/src/main/AndroidManifest.xml`, respectively.

## Updating the app 

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

<!-- Unavailable since update to Capacitor 5
Warning: while developing, make sure you've set the version in your interkit.config.json to lower than the one on the server, otherwise the app will load the newer bundle from the server.
-->


## Icons and Splashscreen

replace the icon and splash screen files in the `/resources` directory (assuming you used starter to build you project) - make sure you use the exact same sizes

note: for android you also manually need to replace the `android/icon-foreground.png` and `android/icon-background.png` for some fancy android icon effect. 

install *cordova-res*
```bash
npm install -g cordova-res
```

run these commands to copy them into the native projects

```bash
cordova-res ios --skip-config --copy
cordova-res android --skip-config --copy
```

they should be included in your next build with the native dev tools

see also: https://github.com/ionic-team/capacitor-assets/tree/cordova-res

<<<<<<< HEAD
<!-- Status: inactive since udpate to Capacitor 5
=======
<!-- TODO unavailable without InterkitLiveReload
>>>>>>> b01489a33cb0c9f818c632c6fdbbbaf9bfe015d1

## Using live reload

interkit comes with a system that allows a native app to download newer versions of a javascript bundle if it is available on the server.

- change the version in your `interkit.config` on the server 
- on startup, the app checks if the version on the server is newer and downloads this
<<<<<<< HEAD
-->
=======

-->

>>>>>>> b01489a33cb0c9f818c632c6fdbbbaf9bfe015d1

## Publish to the app stores

you'll need screenshots - these are easiest to make with iphone and ipad simulators.
- 5.5 inch -> use iphone 8plus simulator
- 6.5 inch -> use iphone 11 pro max simulator (1242x2688 2688x1242 1284x2778 2778x1284)
- 12.9 inch -> use ipad pro simulator

Important: make sure you set a clear description of what you want to use the location data for in `plist.info` *NSLocationWhenInUseUsageDescription* - see https://developer.apple.com/design/human-interface-guidelines/patterns/accessing-private-data 

Important: If you want to use push messages, please go through [Push Setup Guide](/guides/howto/push_setup)

### iOS

1. In Xcode, select Any iOS Device as the deployment target.
2. Choose Product from the top menu and click on Archive.
3. The Xcode Organizer will launch, displaying any archives you’ve created in the past.
4. Make sure the current build is selected and click on Distribute App and follow the prompts with the default options
5. after you upload and select the build in App Store Connect - you will get 2 scary looking questions about encryption. If you are just using https, we've been selecting Yes to both questions.

Additional info here: https://developer.apple.com/ios/submit/

### Android

<!-- 

Make sure you are using our fork of the cordova zip plugin - it prevents a "zip traversal vulnerability" that google detects during submission. Your package.json should contain
````json
"cordova-plugin-zip": "github:bikubi/cordova-plugin-zip#a3855dfcd3baa9ff619a12dd08d3bbce57475a3e",
````

-->

<!-- should be unnecessary as of Capacitor v5

In Android Studio, you will also need to add *android:exported="true"* to the application>activity node in `App/AndroidManifest.xml` and *android:exported="false"* to `capacitor-android/manifests/AndroidManifest.xml` to the service node with the intent-filter:
````java
<service android:name="com.getcapacitor.CapacitorFirebaseMessagingService" android:stopWithTask="false" android:exported="false">
            <intent-filter>
````
https://github.com/ionic-team/capacitor/pull/5350/files

-->

You might have to change the targetSdkVersion located in `android/variables.gradle` (currently 33 is minimum for google play submissions).

<!-- again, TODO InterkitLiveReload

If you have deleted and recreated the `android` folder `npx cap add android`, you need to add 2 lines to the MainActivity of your app in order for live reload to work. The MainActivity file is located at `android/app/src/main/java/interkit/app/starter/MainActivity.java` (or hoewver you changed the app name and path)
- add `import com.getcapacitor.plugin.http.Http;` as a new line below the other `import` statements
- add `add(Http.class);` like in this example:
  ```java
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      add(Http.class);
    }});
  ```

-->

Build > Generate Signed Bundle/APK. You'll need to create a new key store in that same dialogue.
Follow this guide for more information: 
<https://developer.android.com/studio/publish/app-signing#sign_release>

After the build, locate you app bundle, create a release in Google Play Console and upload it there.

When you need to update your app, change the versionCode and versionName in build.gradle (module android.app).
