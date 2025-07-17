package com.exptrack.app

import android.app.Application
import android.content.res.Configuration
import android.util.Log

import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.ReactHost
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader
import com.facebook.react.ReactInstanceManager
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler
import com.facebook.react.bridge.ReactApplicationContext

import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ReactNativeHostWrapper

class MainApplication : Application(), ReactApplication {
    private val TAG = "ExpTrack_MainApplication"
    
    // Keep a static reference to the ReactContext
    companion object {
        @JvmStatic
        private var reactContext: ReactContext? = null
        
        @JvmStatic
        fun getReactContext(): ReactContext? {
            return reactContext
        }
    }

    override val reactNativeHost: ReactNativeHost = ReactNativeHostWrapper(
        this,
        object : DefaultReactNativeHost(this) {
            override fun getPackages(): List<ReactPackage> {
                val packages = PackageList(this).packages.toMutableList()
                // Add our custom package
                packages.add(SMSListenerPackage())
                return packages
            }

            override fun getJSMainModuleName(): String = ".expo/.virtual-metro-entry"

            override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

            override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
            override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
        }
    )

    override val reactHost: ReactHost
        get() = ReactNativeHostWrapper.createReactHost(applicationContext, reactNativeHost)

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, OpenSourceMergedSoMapping)
        
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            load()
        }
        
        // Initialize React Native and store the context
        initializeReactNative()
        
        ApplicationLifecycleDispatcher.onApplicationCreate(this)
    }

    private fun initializeReactNative() {
        Log.d(TAG, "⚡ Initializing React Native")
        
        // Add listener for context initialization
        reactNativeHost.reactInstanceManager.addReactInstanceEventListener(object : ReactInstanceManager.ReactInstanceEventListener {
            override fun onReactContextInitialized(context: ReactContext) {
                Log.d(TAG, "✅ React context initialized")
                reactContext = context
                
                // Process any queued messages
                val smsModule = (context as? ReactApplicationContext)?.getNativeModule(SMSListenerModule::class.java)
                smsModule?.processQueuedMessages()
            }
        })

        // Create the React Native context if not already created
        if (!reactNativeHost.hasInstance()) {
            try {
                Log.d(TAG, "⚡ Creating React Native instance")
                reactNativeHost.reactInstanceManager.createReactContextInBackground()
            } catch (e: Exception) {
                Log.e(TAG, "❌ Error creating React context: ${e.message}")
                e.printStackTrace()
            }
        } else {
            // If instance exists, get current context
            reactContext = reactNativeHost.reactInstanceManager.currentReactContext
            Log.d(TAG, if (reactContext != null) "✅ Got existing React context" else "⚠️ No existing React context found")
        }
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
    }
}
