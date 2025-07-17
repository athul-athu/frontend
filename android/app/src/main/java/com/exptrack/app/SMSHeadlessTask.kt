package com.exptrack.app

import android.content.Context
import android.util.Log
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig
import android.content.Intent
import android.os.Bundle

class SMSHeadlessTask : HeadlessJsTaskService() {
    companion object {
        private const val TASK_NAME = "SmsProcessingTask"
        private const val TAG = "ExpTrack_HeadlessTask"

        @JvmStatic
        fun startTask(context: Context, message: String, from: String) {
            val intent = Intent(context, SMSHeadlessTask::class.java).apply {
                putExtra("message", message)
                putExtra("from", from)
            }
            context.startService(intent)
            Log.d(TAG, "🚀 Starting headless task for SMS processing")
        }
    }

    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
        if (intent == null) {
            Log.e(TAG, "❌ No intent provided for headless task")
            return null
        }

        val extras = intent.extras ?: Bundle()
        val data = Arguments.createMap().apply {
            putString("message", extras.getString("message"))
            putString("from", extras.getString("from"))
            putLong("timestamp", System.currentTimeMillis())
        }

        Log.d(TAG, "📦 Creating headless task config")
        return HeadlessJsTaskConfig(
            TASK_NAME,           // Task name that matches JS code
            data,               // Data passed to JS
            30000L,            // Timeout in ms
            true              // Allow keeping device awake
        )
    }
} 