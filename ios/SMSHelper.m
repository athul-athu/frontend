#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(SMSHelper, RCTEventEmitter)
RCT_EXTERN_METHOD(startListening)

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onSMSReceived"];
}

@end 