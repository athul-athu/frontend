import IdentityLookup

final class MessageFilterExtension: ILMessageFilterExtension {}

extension MessageFilterExtension: ILMessageFilterQueryHandling {
    func handle(_ queryRequest: ILMessageFilterQueryRequest, context: ILMessageFilterExtensionContext, completion: @escaping (ILMessageFilterQueryResponse) -> Void) {
        let messageBody = queryRequest.messageBody
        
        // Check if this is a UPI transaction message
        let upiPattern = "Dear UPI user A/C.*debited by.*on date.*trf to.*Refno.*"
        let upiRegex = try? NSRegularExpression(pattern: upiPattern, options: [.caseInsensitive])
        
        if let _ = upiRegex?.firstMatch(in: messageBody, options: [], range: NSRange(location: 0, length: messageBody.utf16.count)) {
            // This is a UPI transaction message
            // Post a local notification
            let content = UNMutableNotificationContent()
            content.title = "New Transaction"
            content.body = "A new UPI transaction has been detected"
            content.userInfo = ["message": messageBody]
            
            let request = UNNotificationRequest(identifier: UUID().uuidString,
                                             content: content,
                                             trigger: nil)
            
            UNUserNotificationCenter.current().add(request)
            
            // Allow the message through
            let response = ILMessageFilterQueryResponse()
            response.action = .allow
            completion(response)
        } else {
            // Not a UPI message, handle normally
            let response = ILMessageFilterQueryResponse()
            response.action = .none
            completion(response)
        }
    }
} 