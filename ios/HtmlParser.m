#import "React/RCTBridgeModule.h"
@interface RCT_EXTERN_MODULE(HtmlParser, NSObject)

RCT_EXTERN_METHOD(parse: (NSString *) url
                  schemas: (NSArray<NSDictionary> *) schemas
                  base: (NSString *) base
    resolver:(RCTPromiseResolveBlock)resolve
    rejecter:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(parse: (NSString *) url
                  schemas: (NSArray<NSDictionary> *) schemas
    resolver:(RCTPromiseResolveBlock)resolve
    rejecter:(RCTPromiseRejectBlock)reject
)


@end
