declare module 'react-native-nfc-passport-info' {
  // ONLY ANDROID
  export function initSDK(config: {
    webUrl: string;
    userKey: string;
    userNm: string;
  }): void;

  // START LIVENESS
  export function startLiveness(
    config: {
      webUrl?: string;
      rounds: number;
      userKey?: string;
      userNm?: string;
      userReqNum: string;
      siteRequestId: number;
    },
    des: {
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
  ): Promise<any>;
}
