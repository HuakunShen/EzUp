import { ServiceTypes } from './constants';
import type {
  ImgurSetting,
  S3Setting,
  ServiceSetting,
  ServiceType,
} from './types';
import { services } from '$lib/store';

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
      throw new Error('Service Type Not Handled');
  }
};

export function updateServiceName(serviceId: string, name: string) {
  services.update((x) => {
    const servicesClone = [...x];
    for (const service of servicesClone) {
      if (service.id === serviceId) {
        service.name = name;
      }
    }
    return servicesClone;
  });
}

export function updateServiceSetting(
  serviceId: string,
  setting: ServiceSetting
) {
  services.update((x) => {
    const servicesClone = [...x];
    for (const service of servicesClone) {
      if (service.id === serviceId) {
        service.setting = setting;
      }
    }
    return servicesClone;
  });
}
