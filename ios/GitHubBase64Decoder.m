#import "React/RCTBridgeModule.h"
@interface RCT_EXTERN_MODULE(GitHubBase64Decoder, NSObject)

RCT_EXTERN_METHOD(decode: (NSString *) rawString
    resolver:(RCTPromiseResolveBlock)resolve
    rejecter:(RCTPromiseRejectBlock)reject
)

@end
