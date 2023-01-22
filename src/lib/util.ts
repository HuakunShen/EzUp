import { ServiceTypes } from './constants';
import type {
  ImgurSetting,
  S3Setting,
  ServiceSetting,
  ServiceType,
  ToastType,
} from './types';
import {
  settingStore,
  dataStore,
  services,
  selectedServiceId,
  logImagesUrls,
} from '$lib/store';

import { toasts } from '$lib/store';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

export const emptyS3Setting = (): S3Setting => ({
  region: '',
  bucket: '',
  accessKey: '',
  secretKey: '',
  prefix: '',
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
    const servicesClone = _.cloneDeep(x);

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
    const servicesClone = _.cloneDeep(x);

    for (const service of servicesClone) {
      if (service.id === serviceId) {
        service.setting = setting;
      }
    }
    return servicesClone;
  });
}

export function addToast(
  toastType: ToastType,
  msg: string,
  duration: number = 3000
) {
  const toastId = uuidv4();
  toasts.update((t) => [...t, { type: toastType, msg, id: toastId }]);
  setTimeout(() => {
    toasts.update((t) => t.filter((x) => x.id != toastId));
  }, duration);
}

export function addImageUrlToDisplay(url: string) {
  logImagesUrls.update((urls) => [url, ...urls]);
}

export async function clearAllData() {
  await settingStore.clear();
  await dataStore.clear();
  await services.set([]);
  await selectedServiceId.set(undefined);
}

export function isDev(): boolean {
  return process.env.NODE_ENV == 'development';
}


export function isLetter(letter: string): boolean {
  if (letter.length != 1) return false;
  return letter.match(/[a-zA-Z]/) ? true : false;
}

export function isShortcut(letters: string[]): boolean {
  if (letters.length <= 1 || letters.length > 3) return false;
  return letters.filter((letter) => isLetter(letter)).length == 1;
}