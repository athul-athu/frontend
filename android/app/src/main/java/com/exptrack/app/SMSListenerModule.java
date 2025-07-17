package com.exptrack.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.provider.Telephony;
import android.telephony.SmsMessage;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class SMSListenerModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private BroadcastReceiver smsReceiver;
    private static final String TAG = "SMSListenerModule";

    public SMSListenerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        registerSMSReceiver();
    }

    @Override
    public String getName() {
        return "AndroidSMSListener";
    }

    private void registerSMSReceiver() {
        smsReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                Log.d(TAG, "SMS received in emulator");
                
                if (intent.getAction().equals(Telephony.Sms.Intents.SMS_RECEIVED_ACTION) ||
                    intent.getAction().equals("android.provider.Telephony.SMS_RECEIVED")) {
                    
                    Object[] pdus = (Object[]) intent.getExtras().get("pdus");
                    String format = intent.getExtras().getString("format");
                    
                    if (pdus != null) {
                        for (Object pdu : pdus) {
                            SmsMessage smsMessage;
                            if (format != null) {
                                smsMessage = SmsMessage.createFromPdu((byte[]) pdu, format);
                            } else {
                                smsMessage = SmsMessage.createFromPdu((byte[]) pdu);
                            }
                            
                            String messageBody = smsMessage.getMessageBody();
                            Log.d(TAG, "Message received: " + messageBody);
                            
                            // Check if it's a UPI message - making it more lenient for testing
                            if (messageBody.contains("UPI") || messageBody.contains("debited") || 
                                messageBody.contains("credited") || messageBody.contains("A/C")) {
                                WritableMap params = Arguments.createMap();
                                params.putString("message", messageBody);
                                params.putString("sender", smsMessage.getOriginatingAddress());
                                sendEvent("onSMSReceived", params);
                                Log.d(TAG, "UPI message detected and sent to JS");
                            }
                        }
                    }
                }
            }
        };

        IntentFilter filter = new IntentFilter();
        filter.addAction(Telephony.Sms.Intents.SMS_RECEIVED_ACTION);
        filter.addAction("android.provider.Telephony.SMS_RECEIVED");
        filter.setPriority(999); // High priority to receive before other apps
        
        try {
            reactContext.registerReceiver(smsReceiver, filter);
            Log.d(TAG, "SMS receiver registered successfully");
        } catch (Exception e) {
            Log.e(TAG, "Error registering SMS receiver: " + e.getMessage());
        }
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Required for React Native event emitter
        Log.d(TAG, "Added listener for: " + eventName);
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Required for React Native event emitter
        Log.d(TAG, "Removed listeners");
    }

    private void sendEvent(String eventName, WritableMap params) {
        try {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
            Log.d(TAG, "Event sent to JS: " + eventName);
        } catch (Exception e) {
            Log.e(TAG, "Error sending event to JS: " + e.getMessage());
        }
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        if (smsReceiver != null) {
            try {
                reactContext.unregisterReceiver(smsReceiver);
                Log.d(TAG, "SMS receiver unregistered successfully");
            } catch (Exception e) {
                Log.e(TAG, "Error unregistering SMS receiver: " + e.getMessage());
            }
            smsReceiver = null;
        }
    }
} 