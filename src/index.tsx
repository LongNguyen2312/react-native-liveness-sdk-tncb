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

const isIOS = Platform.OS === 'ios';

interface IPropInit {
  webUrl: string;
  userKey: string;
  userNm: string;
}
interface IPropsConfig {
  webUrl?: string;
  rounds: number;
  userKey?: string;
  userNm?: string;
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

// ONLY ANDROID
export const initSDK = (config: IPropInit) => {
  LivenessSdkTncb?.initSdk(config);
};

// START LIVENESS ANDROID
const startLivenessAndroid = (
  configAndroid: IPropsConfig,
  des: IPropDescription
) => {
  return new Promise((resolve, reject) => {
    LivenessSdkTncb?.startLiveness(
      configAndroid,
      des,
      (res: any) => {
        resolve(onHandleResult(res));
      },
      (err: any) => {
        reject(err?.stateCode || 'Failed to Liveness');
      }
    );
  });
};

// START LIVENESS IOS
const startLivenessIos = (configIos: IPropsConfig, des: IPropDescription) => {
  return new Promise((resolve, reject) => {
    LivenessSdkTncb?.startLiveness(configIos, des)
      .then((res: any) => {
        resolve(onHandleResult(res));
      })
      .catch((error: any) => {
        reject(error?.stateCode || 'Failed to Liveness');
      });
  });
};

export const startLiveness = (config: IPropsConfig, des: IPropDescription) => {
  return isIOS
    ? startLivenessIos(config, des)
    : startLivenessAndroid(config, des);
};

const onHandleResult = (data: any) => {
  if (data?.stateCode !== 'VC_SUC') return data?.stateCode;
  if (data?.authImage) {
    const temp = data?.authImage?.split('/');
    const arrTemp = temp?.[temp?.length - 1]?.split('.');
    const extension = arrTemp[1] || '';
    const fileName = arrTemp[0] || '';
    const dataUpload = {
      uri: `${isIOS ? '' : 'file://'}${data?.authImage}`,
      type: (isIOS ? extension : `image/${extension}`) || '',
      name: `${fileName}.${extension}` || '',
    };
    return dataUpload;
  }
  return null;
};
