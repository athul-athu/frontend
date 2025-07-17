package com.exptrack.app;

import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class SMSListenerModule extends ReactContextBaseJavaModule {
    private static final String TAG = "ExpTrack_SMSModule";
    private static ReactApplicationContext reactContext;

    public SMSListenerModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        Log.d(TAG, "SMSListenerModule initialized");
    }

    @Override
    public String getName() {
        return "AndroidSMSListener";
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

    // Static method to be called from BroadcastReceiver
    public static void emitMessageReceived(Context context, String message) {
        Log.d(TAG, "Attempting to emit message to React Native");
        Log.d(TAG, "Message content: " + message);
        
        if (reactContext != null) {
            try {
                WritableMap params = Arguments.createMap();
                params.putString("message", message);
                
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onSMSReceived", params);
                
                Log.i(TAG, "Successfully emitted message to React Native");
            } catch (Exception e) {
                Log.e(TAG, "Error emitting message to React Native: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            Log.e(TAG, "React context is null, cannot emit message. Context might not be initialized.");
        }
    }
} 