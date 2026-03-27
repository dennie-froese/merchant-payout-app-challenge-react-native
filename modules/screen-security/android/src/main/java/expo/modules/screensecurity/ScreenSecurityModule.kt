package expo.modules.screensecurity

import android.provider.Settings
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricManager.Authenticators.BIOMETRIC_STRONG
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import expo.modules.kotlin.Promise
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

    AsyncFunction("isBiometricAuthenticated") { promise: Promise ->
      val activity = appContext.currentActivity as? FragmentActivity
      if (activity == null) {
        promise.reject("E_BIOMETRICS_NOT_AVAILABLE", "No activity available.", null)
        return@AsyncFunction
      }

      val biometricManager = BiometricManager.from(activity)
      when (biometricManager.canAuthenticate(BIOMETRIC_STRONG)) {
        BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED -> {
          promise.reject("E_BIOMETRICS_NOT_ENROLLED", "Biometrics not set up. Please enable biometrics in Settings.", null)
          return@AsyncFunction
        }
        BiometricManager.BIOMETRIC_SUCCESS -> Unit
        else -> {
          promise.reject("E_BIOMETRICS_NOT_AVAILABLE", "Biometrics not available on this device.", null)
          return@AsyncFunction
        }
      }

      activity.runOnUiThread {
        val executor = ContextCompat.getMainExecutor(activity)
        val callback = object : BiometricPrompt.AuthenticationCallback() {
          override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
            promise.resolve(true)
          }
          override fun onAuthenticationFailed() {
            promise.resolve(false)
          }
          override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
            promise.resolve(false)
          }
        }
        val prompt = BiometricPrompt(activity, executor, callback)
        val promptInfo = BiometricPrompt.PromptInfo.Builder()
          .setTitle("Confirm payout")
          .setNegativeButtonText("Cancel")
          .setAllowedAuthenticators(BIOMETRIC_STRONG)
          .build()
        prompt.authenticate(promptInfo)
      }
    }
  }
}
