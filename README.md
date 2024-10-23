# react-native-liveness-sdk-tncb

eKYC solution provided by TNCB

## Installation

```sh
npm install react-native-liveness-sdk-tncb
```

## Linking

### Autolink

The library has autolink support

## Configuration

### IOS

in Xcode, add `NFCReaderUsageDescription` into your `info.plist`, for example:

```
<key>NSCameraUsageDescription</key>
<string>This app requires access to the camera to take photos and videos.</string>
```

### Android

in Xcode, add `NFCReaderUsageDescription` into your `info.plist`, for example:

```
<uses-permission android:name="android.permission.CAMERA" />
```

## Usage

### IOS

```js
import { startLiveness } from 'react-native-liveness-sdk-tncb';

const config = {
    webUrl: string,
    rounds: number, // only 2, 3, 4
    userKey: string,
    userNm: string,
    userReqNum: string,
    siteRequestId: number,
};

const customDescription = {
    frontal: string,
    raise: string,
    bending: string,
    turn_right: string,
    turn_left: string,
    tilt_right: string,
    tilt_left: string,
    open_mouth: string,
    smile: string,
};

try {
    const res = await startLiveness(config, customDescription);
    console.log('result', res);
} catch (error) {
    console.log('error', error);
}
```

### ANDROID

Android must initialize first and then call liveness

```js
import { initSDK, startLiveness } from 'react-native-liveness-sdk-tncb';

initSDK({
    webUrl: string,
    userKey: string,
    userNm: string,
});
```

Liveness function

```js
import { startLiveness } from 'react-native-liveness-sdk-tncb';

const config = {
    rounds: number, // only 2, 3, 4
    userReqNum: string,
    siteRequestId: number,
};
const customDescription = {
    frontal: string,
    raise: string,
    bending: string,
    turn_right: string,
    turn_left: string,
    tilt_right: string,
    tilt_left: string,
    open_mouth: string,
    smile: string,
};

try {
    const res = await startLiveness(config, customDescription);
    console.log('result', res);
} catch (error) {
    console.log('error', error);
}
```

## Sample app
There is a sample app included in the repo which demonstrates the functionality.

## License

MIT

---