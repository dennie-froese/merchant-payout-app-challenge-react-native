import ExpoModulesCore
import LocalAuthentication
import UIKit

public class ScreenSecurityModule: Module {
  private var screenshotObserver: NSObjectProtocol?

  public func definition() -> ModuleDefinition {
    Name("ScreenSecurity")

    Events("onScreenshotTaken")

    OnCreate {
      screenshotObserver = NotificationCenter.default.addObserver(
        forName: UIApplication.userDidTakeScreenshotNotification,
        object: nil,
        queue: .main
      ) { [weak self] _ in
        self?.sendEvent("onScreenshotTaken")
      }
    }

    OnDestroy {
      if let observer = screenshotObserver {
        NotificationCenter.default.removeObserver(observer)
        screenshotObserver = nil
      }
    }

    Function("getDeviceId") { () -> String in
      if let id = UIDevice.current.identifierForVendor?.uuidString {
        return id
      }
      let key = "ScreenSecurity.fallbackDeviceId"
      if let stored = UserDefaults.standard.string(forKey: key) {
        return stored
      }
      let generated = UUID().uuidString
      UserDefaults.standard.set(generated, forKey: key)
      return generated
    }

    AsyncFunction("isBiometricAuthenticated") { (promise: Promise) in
      let context = LAContext()
      var error: NSError?

      guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
        if let laError = error as? LAError, laError.code == .biometryNotEnrolled {
          promise.reject("E_BIOMETRICS_NOT_ENROLLED", "Biometrics not set up. Please enable Face ID or Touch ID in Settings.")
        } else {
          promise.reject("E_BIOMETRICS_NOT_AVAILABLE", "Biometrics not available on this device.")
        }
        return
      }

      context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: "Confirm payout") { success, _ in
        promise.resolve(success)
      }
    }
  }
}
