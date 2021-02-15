import Foundation


@objc(GitHubBase64Decoder)
class GitHubBase64Decoder: NSObject {
  let NEW_LINE_CHAR = "\n"
  
  @objc(decode:resolver:rejecter:)
  func decode(_ rawString: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
    let formatedStr = rawString.replacingOccurrences(of: "\n", with: "")
    let decodedData = Data(base64Encoded: formatedStr)!
    let decodedString = String(data: decodedData, encoding: .utf8)!
    resolve(decodedString)
  }
  
  @objc static func requiresMainQueueSetup() -> Bool { return true }
}
