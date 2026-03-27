import ExpoModulesCore
import UIKit

public class ScreenSecurityModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ScreenSecurity")

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
  }
}
