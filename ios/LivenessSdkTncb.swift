import Foundation
import React
import Combine
import  ActiveLivenessSdk
import SwiftUI

@objc(LivenessSdkTncbModule)
class LivenessSdkTncbModule: NSObject, RCTBridgeModule {
  
  static func moduleName() -> String! {
    return "LivenessSdkTncbModule";
  }
  
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  func saveCGImageToFileAndGetURI(cgImage: CGImage) -> String? {
    // Chuyển đổi CGImage sang UIImage
    let uiImage = UIImage(cgImage: cgImage)
    
    // Lấy đường dẫn đến thư mục tạm thời
    let tempDirectory = FileManager.default.temporaryDirectory
    
    // Tạo đường dẫn tệp với tên tệp duy nhất
    let fileName = UUID().uuidString + ".png"
    let fileURL = tempDirectory.appendingPathComponent(fileName)
    
    // Chuyển đổi UIImage sang dữ liệu PNG
    guard let imageData = uiImage.pngData() else {
      return "can't save PNG from UIImage"
    }
    
    // Lưu dữ liệu hình ảnh vào tệp
    do {
      try imageData.write(to: fileURL)
      return fileURL.absoluteString // Trả về URL của tệp
    } catch {
      return "can't save"
    }
  }
  
  // Start Liveness
  @objc
  func startLiveness(_ dataUser: NSDictionary, customGuide: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      ActionOrder.setCustomDescription(customGuide["frontal"] as? String ?? "Phát hiện các mặt trước tùy chỉnh", for: .frontal)
      ActionOrder.setCustomDescription(customGuide["raise"] as? String ?? "Hãy ngẩng đầu lên.", for: .raise)
      ActionOrder.setCustomDescription(customGuide["bending"] as? String ?? "Vui lòng xem bên dưới.", for: .bending)
      ActionOrder.setCustomDescription(customGuide["turn_right"] as? String ?? "Hãy quay đầu sang bên phải.", for: .turn_right)
      ActionOrder.setCustomDescription(customGuide["turn_left"] as? String ?? "Hãy quay đầu sang trái.", for: .turn_left)
      ActionOrder.setCustomDescription(customGuide["tilt_right"] as? String ?? "Hãy nghiêng đầu sang bên phải.", for: .tilt_right)
      ActionOrder.setCustomDescription(customGuide["tilt_left"] as? String ?? "Hãy nghiêng đầu sang trái.", for: .tilt_left)
      ActionOrder.setCustomDescription(customGuide["open_mouth"] as? String ?? "Hãy mở miệng ra.", for: .open_mouth)
      ActionOrder.setCustomDescription(customGuide["smile"] as? String ?? "Hãy mỉm cười.", for: .smile)
      
      let emptyImage = Image(decorative: "")
      ActiveLivenessSdk.setLogoImage(emptyImage)
      
      let rounds = dataUser["rounds"] as? Int ?? 0
      switch rounds {
      case 2:
        ActiveLivenessSdk.setLivenessPassCount(.TWO)
      case 3:
        ActiveLivenessSdk.setLivenessPassCount(.THREE)
      case 4:
        ActiveLivenessSdk.setLivenessPassCount(.FOUR)
      default:
        ActiveLivenessSdk.setLivenessPassCount(.THREE)
      }
      
      ActiveLivenessSdk.callSDK(webUrl: dataUser["webUrl"] as? String ?? ""
                                ,userKey: dataUser["userKey"] as? String ?? ""
                                ,userNm: dataUser["userNm"] as? String ?? ""
                                ,userReqNum: dataUser["userReqNum"] as? String ?? ""
                                ,siteRequestId: dataUser["siteRequestId"] as? Int32 ?? 0) { data in
        var result = [String: Any]()
        result["stateCode"] = "\(data.stateCode)"
        result["description"] =  data.stateCode.localizedDescription
        if data.stateCode == .VC_SUC {
          if let authImage = data.cropImage {
            // Gọi hàm để lưu CGImage dưới dạng PNG và lấy URI
            if let imageUri = self.saveCGImageToFileAndGetURI(cgImage: authImage) {
              result["authImage"] = imageUri
            }
          }
        }
        
        resolve(result)
      }
    }
  }
}
