import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-liveness-sdk-tncb' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const LivenessSdkTncb = NativeModules?.LivenessSdkTncbModule
  ? NativeModules?.LivenessSdkTncbModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

interface IPropInit {
  webUrl: string;
  userKey: string;
  userNm: string;
}

// ONLY ANDROID
export const initSDK = (config: IPropInit) => {
  LivenessSdkTncb?.initSdk(config)
}

interface IPropConfigAndroid {
  rounds: number;
  userReqNum: string;
  siteRequestId: number;
}

interface IPropDescription {
  frontal: string;
  raise: string;
  bending: string;
  turn_right: string;
  turn_left: string;
  tilt_right: string;
  tilt_left: string;
  open_mouth: string;
  smile: string;
}

// START LIVENESS ANDROID 
export const startLiveness = (configAndroid: IPropConfigAndroid, des: IPropDescription) => {
  return new Promise((resolve, reject) => {
    LivenessSdkTncb?.startLiveness(
      configAndroid,
      des,
      (res: any) => {
        resolve(res)
      },
      (err: any) => {
        reject(err?.stateCode || 'Failed to Liveness')
      },
    )
  });
  
}