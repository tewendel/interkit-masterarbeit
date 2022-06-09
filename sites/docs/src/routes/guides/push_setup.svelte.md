# Set up push notifications with iOS

1. Go to your Apple Developer Account
2. Generate an APNs key (Apple Push Notification service) there
3. Plug it into Firebase Console

# Push notification icon on Android

(Not supported on iOS, it just uses the launcher icon)

* Create a white-on-transparent (with alpha) icon.
* The mipmap/intermediates will be 24/36/48/72/96 pixels, named mdpi/hdpi/xhdpi/xxhdpi/xxxhdpi.  
  Beware with pixel art!
* To create the intermediates and place the files in the correct folders, you can use Android Asset Studio:
    * open Android Studio, go to (the default) "Android view". You should see the project file tree on the left
    * find `app/res`, right click, Create New › Image Asset
    * Follow the wizard.  
      Don't use dash/minus in the filename, underscores are ok.  
      This tool will apparently scale *every* image, even if it is redundant/unnecessary. Do it manually to avoid aliasing artifacts.
* `android/app/src/main/res/drawable-[mhx]+dpi/our_icon_name.png` will be created. Overwrite them (or create them manually at the correct dimensions in the first place).
* There is also an online tool: [romannurik.github.io/AndroidAssetStudio/](https://romannurik.github.io/AndroidAssetStudio/icons-notification.html).
* Link the resource: edit `android/app/src/main/AndroidManifest.xml`, to the `<application>` node add this child node:  
  `<meta-data android:name="com.google.firebase.messaging.default_notification_icon" android:resource="@drawable/our_icon_name" />`  
* `npx cap sync android`
* Compile, run, debug... done.
* With more effort, full-color (over white-on-transparent) might be possible, or just re-coloring/hue-ing the white icon. Consider  
  [Firebase Docs](https://firebase.google.com/docs/cloud-messaging/android/client#manifest)  
  [this Stack Overflow Q](https://stackoverflow.com/q/37325051/629238)

