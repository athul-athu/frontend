import Foundation
import UserNotifications

@objc(SMSHelper)
class SMSHelper: NSObject {
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  override init() {
    super.init()
    UNUserNotificationCenter.current().delegate = self
  }
  
  @objc func startListening() {
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
      if granted {
        print("Notification permission granted")
      } else if let error = error {
        print("Error requesting notification permission: \(error.localizedDescription)")
      }
    }
  }
}

extension SMSHelper: UNUserNotificationCenterDelegate {
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                            willPresent notification: UNNotification,
                            withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    let userInfo = notification.request.content.userInfo
    
    if let message = userInfo["message"] as? String {
      // Send event to React Native
      let body: [String: Any] = ["message": message]
      sendEvent(withName: "onSMSReceived", body: body)
    }
    
    completionHandler([.banner, .sound])
  }
} 