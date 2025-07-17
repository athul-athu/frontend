package com.exptrack.app

import android.content.Context
import android.util.Log
import java.util.concurrent.ConcurrentLinkedQueue
import android.os.Handler
import android.os.Looper

import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.ReactInstanceManager
import com.facebook.react.bridge.LifecycleEventListener

class SMSListenerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), LifecycleEventListener {
    private val TAG = "ExpTrack_SMSModule"
    private val mReactContext: ReactApplicationContext = reactContext
    private val mainHandler = Handler(Looper.getMainLooper())
    private val retryDelay = 1000L // 1 second delay between retries

    // Queue to store messages when React context isn't ready
    companion object {
        private val messageQueue = ConcurrentLinkedQueue<String>()
        private var instance: SMSListenerModule? = null

        @JvmStatic
        fun emitMessageReceived(context: Context, message: String) {
            try {
                val staticContext = MainApplication.getReactContext() as? ReactApplicationContext
                if (staticContext != null && instance?.isContextReady() == true) {
                    instance?.emitMessageReceived(message)
                } else {
                    Log.d("ExpTrack_SMSModule", "📥 Queueing message - React context not ready")
                    messageQueue.offer(message)
                    Log.d("ExpTrack_SMSModule", "📋 Queue size: ${messageQueue.size}")
                    
                    // Start processing queue with retry
                    instance?.startProcessingQueueWithRetry()
                }
            } catch (e: Exception) {
                Log.e("ExpTrack_SMSModule", "❌ Error handling message: ${e.message}")
                e.printStackTrace()
                messageQueue.offer(message)
            }
        }
    }

    init {
        instance = this
        reactContext.addLifecycleEventListener(this)
    }

    override fun getName(): String = "AndroidSMSListener"

    private fun isContextReady(): Boolean {
        return try {
            mReactContext.hasActiveReactInstance() && 
            mReactContext.catalystInstance?.isDestroyed == false &&
            MainApplication.getReactContext() != null
        } catch (e: Exception) {
            Log.e(TAG, "❌ Error checking context: ${e.message}")
            false
        }
    }

    private fun startProcessingQueueWithRetry() {
        mainHandler.post(object : Runnable {
            override fun run() {
                if (!processQueuedMessages() && messageQueue.isNotEmpty()) {
                    Log.d(TAG, "🔄 Scheduling retry for message processing")
                    mainHandler.postDelayed(this, retryDelay)
                }
            }
        })
    }

    fun processQueuedMessages(): Boolean {
        if (!isContextReady()) {
            Log.d(TAG, "⏳ Context not ready yet, will retry...")
            return false
        }

        var success = true
        val iterator = messageQueue.iterator()
        
        while (iterator.hasNext()) {
            val message = iterator.next()
            try {
                Log.d(TAG, "📤 Processing queued message")
                emitMessageReceived(message)
                iterator.remove()
            } catch (e: Exception) {
                Log.e(TAG, "❌ Error processing queued message: ${e.message}")
                success = false
                break
            }
        }
        
        return success
    }

    @ReactMethod
    fun addListener(eventName: String) {
        Log.d(TAG, "➕ Added listener for: $eventName")
        startProcessingQueueWithRetry()
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        Log.d(TAG, "➖ Removed listeners")
    }

    fun emitMessageReceived(message: String) {
        if (!isContextReady()) {
            Log.d(TAG, "📥 Context not ready, queueing message")
            messageQueue.offer(message)
            startProcessingQueueWithRetry()
            return
        }

        try {
            val params = Arguments.createMap().apply {
                putString("message", message)
            }
            
            Log.d(TAG, "📬 Message to parse: $message")

            mReactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("onSMSReceived", params)
            
            Log.i(TAG, "✅ Message sent to React Native successfully")
        } catch (e: Exception) {
            Log.e(TAG, "❌ Error sending message: ${e.message}")
            e.printStackTrace()
            messageQueue.offer(message)
            startProcessingQueueWithRetry()
        }
    }

    // Lifecycle methods
    override fun onHostResume() {
        startProcessingQueueWithRetry()
    }

    override fun onHostPause() {
        // No action needed
    }

    override fun onHostDestroy() {
        instance = null
    }
} 