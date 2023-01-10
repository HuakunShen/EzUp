import { ServiceTypes } from './constants';
import type { ImgurSetting, S3Setting, ServiceType } from './types';

export const emptyS3Setting = (): S3Setting => ({
  region: '',
  bucket: '',
  accessKey: '',
  secretKey: '',
  domain: '',
  savePath: '',
});

export const emptyImgurSetting = (): ImgurSetting => ({
  clientId: '',
});

export const getEmptySetting = (serviceType: ServiceType) => {
  switch (serviceType) {
    case ServiceTypes.S3:
      return emptyS3Setting();
    case ServiceTypes.Imgur:
      return emptyImgurSetting();
    default:
        
      break;
  }
};
