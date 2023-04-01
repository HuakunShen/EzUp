import { ServiceTypes } from './constants';
import {z} from 'zod';
import type {
  ImgurSetting,
  S3Setting,
  ServiceSetting,
  ServiceType,
  ToastType,
  ShortcutsMap,
} from '$lib/types';
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

export const defaultShortcutsMap = (): ShortcutsMap => ({
  toggleWindow: 'Control+Command+U',
  upload: 'Command+Alt+U',
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

export const FormatTypeArr = ['markdown', 'html', 'plainlink'] as const;
export const FormatEnum = z.enum(FormatTypeArr);
export type FormatType = z.infer<typeof FormatEnum>;
// export enum FormatTypeEnum {
//   Markdown = 'markdown',
//   HTML = 'html',
//   PlainLink = 'plainLink',
// }

// export type FormatType = FormatTypeEnum.Markdown | FormatTypeEnum.HTML | FormatTypeEnum.PlainLink;

export class ImageLinkFormatter {
  static md_format(url: string): string {
    return `![image](${url})`;
  }

  static html_format(url: string): string {
    return `<img src="${url}" width="100%" />`;
  }

  static format(format: FormatType, url: string): string {
    switch (format) {
      case FormatEnum.enum.markdown:
        return this.md_format(url);
      case FormatEnum.enum.html:
        return this.html_format(url);
      case FormatEnum.enum.plainlink:
        return url;
      default:
        throw new Error('Unknown Format Type');
    }
  }
}
