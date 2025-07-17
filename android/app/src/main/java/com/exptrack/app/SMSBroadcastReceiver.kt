package com.exptrack.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import android.util.Log
import android.content.pm.PackageManager
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.Arguments

class SMSBroadcastReceiver : BroadcastReceiver() {
    private val TAG = "ExpTrack_SMS"

    override fun onReceive(context: Context?, intent: Intent?) {
        Log.i(TAG, "⭐ SMS RECEIVED - onReceive called ⭐")

        if (context == null || intent == null) {
            Log.e(TAG, "❌ Context or Intent is null")
            return
        }

        // Check if we have the necessary permissions
        if (context.checkSelfPermission(android.Manifest.permission.RECEIVE_SMS) != PackageManager.PERMISSION_GRANTED ||
            context.checkSelfPermission(android.Manifest.permission.READ_SMS) != PackageManager.PERMISSION_GRANTED) {
            Log.e(TAG, "❌ SMS permissions not granted")
            return
        }

        if (intent.action == Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
            Log.d(TAG, "📱 SMS_RECEIVED_ACTION matched")

            try {
                val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
                Log.d(TAG, "📨 Processing ${messages.size} message parts")

                if (messages.isNotEmpty()) {
                    val smsMessage = messages[0]
                    val sender = smsMessage.originatingAddress ?: "Unknown"
                    val messageBody = smsMessage.messageBody ?: ""

                    Log.i(TAG, "📬 SMS Details Received:")
                    Log.i(TAG, "From: $sender")
                    Log.i(TAG, "Message: $messageBody")

                    // Check if it's a UPI transaction message
                    if (messageBody.contains("UPI", ignoreCase = true) || 
                        messageBody.contains("debited", ignoreCase = true) || 
                        messageBody.contains("credited", ignoreCase = true)) {
                        Log.d(TAG, "💰 UPI Transaction detected!")
                        
                        try {
                            // First try to emit to foreground app
                            emitToForeground(context, messageBody, sender)
                            
                            // Also start headless task for background processing
                            SMSHeadlessTask.startTask(context, messageBody, sender)
                            
                            Log.d(TAG, "✅ Message processing initiated")
                        } catch (e: Exception) {
                            Log.e(TAG, "❌ Error processing message: ${e.message}")
                            e.printStackTrace()
                        }
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "❌ Error reading SMS: ${e.message}")
                e.printStackTrace()
            }
        }
    }

    private fun emitToForeground(context: Context, message: String, from: String) {
        try {
            val reactApp = context.applicationContext as ReactApplication
            val reactContext = reactApp.reactNativeHost.reactInstanceManager.currentReactContext

            if (reactContext != null && reactContext.hasActiveCatalystInstance()) {
                val params = Arguments.createMap().apply {
                    putString("message", message)
                    putString("from", from)
                    putLong("timestamp", System.currentTimeMillis())
                }

                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("onSMSReceived", params)

                Log.d(TAG, "✅ Message emitted to foreground app")
            } else {
                Log.d(TAG, "ℹ️ App not in foreground, using headless task only")
            }
        } catch (e: Exception) {
            Log.e(TAG, "❌ Error emitting to foreground: ${e.message}")
            e.printStackTrace()
        }
    }
} 