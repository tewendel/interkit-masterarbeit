Note: You need to follow all of these steps for each individual project, see also the general [guide for building for native devices](/guides/native)

# Obtain APNs for iOS setup

1. Go to your Apple Developer Account
2. Generate an APNs key (Apple Push Notification service) there
3. Plug it into Firebase Console

# Google Services setup

These are non-secret keys to link our app to the Firebase Cloud Messaging app instance.

1. Create a project with apps (iOS + Android) in Firebase Console
2. Upon creation, you are prompted to download the credential file
    * Android: `google-services.json` – place it in `fooproject/android/app/`  
      (A default file for the starter project is already there, overwrite it. It has to sit there, otherwise the empty app won't run, even when push notifications aren't used.)
    * iOS: `GoogleService-Info.plist` – place it in `fooproject/ios/App/App/`  
      (might have to add it via XCode)

# Android setup

Push and Firebase are enabled by default.

# iOS setup

`fooproject/ios/App/App/AppDelegate.swift`,
following [the Capacitor docs for v2](https://capacitorjs.com/docs/v2/guides/push-notifications-firebase#add-initialization-code),
add

important: do not follow the sdk guide that is on the firebase cosole!

````java
// ...
import FirebaseCore
import FirebaseInstanceID
import FirebaseMessaging

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
  // ...
  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    // Override point for customization after application launch.
    FirebaseApp.configure()
    return true
  }
  // ...
  func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
      Messaging.messaging().apnsToken = deviceToken
      InstanceID.instanceID().instanceID { (result, error) in
          if let error = error {
              NotificationCenter.default.post(name: Notification.Name(CAPNotifications.DidFailToRegisterForRemoteNotificationsWithError.name()), object: error)
          } else if let result = result {
              NotificationCenter.default.post(name: Notification.Name(CAPNotifications.DidRegisterForRemoteNotificationsWithDeviceToken.name()), object: result.token)
          }
      }
  }
}
````

# Provide credentials

These are private keys to be kept secret, get them from Firebase Console (Project settings › Service accounts › Firebase Admin SDK › Generate new private key -> it's ~2k of cert looking JSON). Provide them to the app:

 1. via Database Sheet: in a sheet named `config`, with columns "key" and "value" (you just need to name the columns, the key can stay a uuid),
    create a row with a special key `firebaseAdminCredentials`, paste the JSON in value.
 2. if this sheet does not exist, we check if a JSON file is present
     1. in a path provided by `.env` var `FCM_CREDENTIALS_PATH`,
        file name `PROJECTID_firebase-admin.json`,
        if not there, then we try
     2. in the project folder (found via `.env` `REPOSITORIES_PATH`),
        file name `firebase-admin.json`.

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

