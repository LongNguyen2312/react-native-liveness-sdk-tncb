#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(LivenessSdkTncbModule, NSObject)

RCT_EXTERN_METHOD(startLiveness:(NSDictionary *)dataUser
                  customGuide: (NSDictionary *)customGuide
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end
