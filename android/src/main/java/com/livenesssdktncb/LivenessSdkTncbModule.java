package com.livenesssdktncb;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.Uri;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.NonNull;

import com.cubox.libseeuid.builder.SeeUID;
import com.cubox.libseeuid.common.ActionOrder;
import com.cubox.libseeuid.common.LivenessSteps;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class LivenessSdkTncbModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    public LivenessSdkTncbModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "LivenessSdkTncbModule";
    }

    private String convertBitmapToBase64(Bitmap bitmap) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
        byte[] byteArray = byteArrayOutputStream.toByteArray();
        return Base64.encodeToString(byteArray, Base64.NO_WRAP);
    }

    private static String saveBitmapToUri(Bitmap bitmap) {
        // Tạo tên file dựa trên thời gian hiện tại
        String fileName = "image_" + System.currentTimeMillis() + ".png";
        File file = new File(reactContext.getExternalCacheDir(), fileName);

        try (FileOutputStream out = new FileOutputStream(file)) {
            // Lưu Bitmap vào file
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, out);

            // Đảm bảo file đã được lưu
            out.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Trả về URI của file
        Uri uri = Uri.fromFile(file);
        return uri.toString();
    }

    @ReactMethod
    public void initSdk(ReadableMap dataUser) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            activity.runOnUiThread(() -> {
                try {
                    String webUrl = dataUser.hasKey("webUrl") ? dataUser.getString("webUrl") : "";
                    String userKey = dataUser.hasKey("userKey") ? dataUser.getString("userKey") : "";
                    String userNm = dataUser.hasKey("userNm") ? dataUser.getString("userNm") : "";
                    String userReqNum = "userReqNum";
                    int siteRequestId = 0;
                    SeeUID.with(reactContext).init(reactContext, webUrl, userKey, userNm, userReqNum, siteRequestId);
                } catch (Exception e) {
                    Log.d("initSdk error", "" + e);
                }
            });
        }
    }

    @ReactMethod
    public void startLiveness(ReadableMap dataUser, ReadableMap customGuide, Callback successCallback, Callback errorCallback) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            activity.runOnUiThread(() -> {
                try {
                    int rounds = dataUser.hasKey("rounds") ? dataUser.getInt("rounds") : 3;
                    int siteRequestId = dataUser.hasKey("siteRequestId") ? dataUser.getInt("siteRequestId") : 0;
                    String userReqNum = dataUser.hasKey("userReqNum") ? dataUser.getString("userReqNum") : "userReqNum";

                    SeeUID.with(reactContext).setMessage(ActionOrder.frontal, customGuide.hasKey("frontal") && customGuide.getString("frontal") != null ? customGuide.getString("frontal") : "frontal");
                    SeeUID.with(reactContext).setMessage(ActionOrder.raise, customGuide.hasKey("raise") && customGuide.getString("raise") != null ? customGuide.getString("raise") : "raise");
                    SeeUID.with(reactContext).setMessage(ActionOrder.bending, customGuide.hasKey("bending") && customGuide.getString("bending") != null ? customGuide.getString("bending") : "bending");
                    SeeUID.with(reactContext).setMessage(ActionOrder.turn_right, customGuide.hasKey("turn_right") && customGuide.getString("turn_right") != null ? customGuide.getString("turn_right") : "turn_right");
                    SeeUID.with(reactContext).setMessage(ActionOrder.turn_left, customGuide.hasKey("turn_left") && customGuide.getString("turn_left") != null ? customGuide.getString("turn_left") : "turn_left");
                    SeeUID.with(reactContext).setMessage(ActionOrder.tilt_right, customGuide.hasKey("tilt_right") && customGuide.getString("tilt_right") != null ? customGuide.getString("tilt_right") : "tilt_right");
                    SeeUID.with(reactContext).setMessage(ActionOrder.tilt_left, customGuide.hasKey("tilt_left") && customGuide.getString("tilt_left") != null ? customGuide.getString("tilt_left") : "tilt_left");
                    SeeUID.with(reactContext).setMessage(ActionOrder.open_mouth, customGuide.hasKey("open_mouth") && customGuide.getString("open_mouth") != null ? customGuide.getString("open_mouth") : "open_mouth");
                    SeeUID.with(reactContext).setMessage(ActionOrder.smile, customGuide.hasKey("smile") && customGuide.getString("smile") != null ? customGuide.getString("smile") : "smile");
                    Bitmap transparentBitmap = Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888);
                    transparentBitmap.eraseColor(Color.TRANSPARENT);
                    SeeUID.with(reactContext).setCIImage(transparentBitmap);

                    switch (rounds) {
                        case 2:
                            SeeUID.with(reactContext).setLivenessPassCount(LivenessSteps.TWO);
                            break;
                        case 4:
                            SeeUID.with(reactContext).setLivenessPassCount(LivenessSteps.FOUR);
                            break;
                        default:
                            SeeUID.with(reactContext).setLivenessPassCount(LivenessSteps.THREE); // Default is 3
                    }

                    SeeUID.with(reactContext).setSiteRequestId(siteRequestId);
                    SeeUID.with(reactContext).setUserReqNum(userReqNum);

                    SeeUID.with(reactContext).errorListener(throwable -> {
                        String message = throwable.getMessage();
                        errorCallback.invoke(message);
                    }).startLiveness(activity, (_state, _code, _msg, _face) -> {
                        WritableMap result = Arguments.createMap();
                        result.putBoolean("status", _state);
                        result.putString("stateCode", _code);
                        result.putString("description", _msg != null ? _msg : "");
                        // Face Image (Bitmap)
                        if (_face != null) {
                            result.putString("authImage", saveBitmapToUri(_face));
                        } else {
                            result.putString("authImage", "");
                        }
                        if (_state) {
                            successCallback.invoke(result);
                        } else {
                            errorCallback.invoke(result);
                        }
                    });
                } catch (Exception error) {
                    errorCallback.invoke("startLiveness error", error.getMessage());
                }
            });
        }
    }
}