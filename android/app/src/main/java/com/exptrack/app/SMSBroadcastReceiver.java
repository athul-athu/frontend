package com.exptrack.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.provider.Telephony;
import android.telephony.SmsMessage;
import android.util.Log;
import android.widget.Toast;

public class SMSBroadcastReceiver extends BroadcastReceiver {
    private static final String TAG = "ExpTrack_SMS";

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.i(TAG, "onReceive called with action: " + (intent.getAction() != null ? intent.getAction() : "null"));
        
        try {
            if (Telephony.Sms.Intents.SMS_RECEIVED_ACTION.equals(intent.getAction())) {
                Log.d(TAG, "SMS_RECEIVED_ACTION matched");
                
                Bundle bundle = intent.getExtras();
                if (bundle != null) {
                    Object[] pdus = (Object[]) bundle.get("pdus");
                    String format = bundle.getString("format");
                    
                    if (pdus != null) {
                        Log.d(TAG, "Number of PDUs: " + pdus.length);
                        
                        for (Object pdu : pdus) {
                            SmsMessage message;
                            if (format != null && android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                                message = SmsMessage.createFromPdu((byte[]) pdu, format);
                            } else {
                                message = SmsMessage.createFromPdu((byte[]) pdu);
                            }
                            
                            String messageBody = message.getMessageBody();
                            String sender = message.getOriginatingAddress();
                            
                            Log.i(TAG, "SMS Details:");
                            Log.i(TAG, "From: " + (sender != null ? sender : "unknown"));
                            Log.i(TAG, "Message: " + (messageBody != null ? messageBody : "empty"));
                            
                            // Show a toast for debugging
                            String toastMessage = "SMS From: " + sender + "\nMessage: " + messageBody;
                            Toast.makeText(context, toastMessage, Toast.LENGTH_LONG).show();
                            
                            // Check if it's a UPI message with more detailed logging
                            if (messageBody != null) {
                                boolean isUPI = messageBody.contains("UPI");
                                boolean isDebited = messageBody.contains("debited");
                                boolean isCredited = messageBody.contains("credited");
                                boolean isAccount = messageBody.contains("A/C");
                                
                                Log.d(TAG, "Message checks - UPI: " + isUPI + 
                                          ", Debited: " + isDebited + 
                                          ", Credited: " + isCredited + 
                                          ", A/C: " + isAccount);
                                
                                if (isUPI || isDebited || isCredited || isAccount) {
                                    Log.d(TAG, "UPI transaction SMS detected, sending to React Native");
                                    SMSListenerModule.emitMessageReceived(context, messageBody);
                                } else {
                                    Log.d(TAG, "Not a UPI message - ignoring");
                                }
                            } else {
                                Log.w(TAG, "Received null message body");
                            }
                        }
                    } else {
                        Log.w(TAG, "No PDUs found in intent");
                    }
                } else {
                    Log.w(TAG, "Null bundle received with SMS intent");
                }
            } else {
                Log.d(TAG, "Not an SMS_RECEIVED action");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error processing SMS: " + e.getMessage());
            e.printStackTrace();
        }
    }
} 