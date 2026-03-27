package expo.modules.screensecurity

import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ScreenSecurityModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ScreenSecurity")

    Function("getDeviceId") {
      Settings.Secure.getString(
        appContext.reactContext?.contentResolver,
        Settings.Secure.ANDROID_ID
      ) ?: ""
    }
  }
}
