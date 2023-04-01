import type { ImgurSetting, S3Setting } from '$lib/types';
import {
  addToast,
  addImageUrlToDisplay,
  ImageLinkFormatter,
  type FormatType,
} from '$lib/util';
import path from 'path-browserify';
import { invoke } from '@tauri-apps/api';
import { writeText, readText } from '@tauri-apps/api/clipboard';
import { ToastType, ServiceTypesEnum } from '$lib/types';
import { notify } from '$lib/notify';
import { uploading, formatter } from '$lib/store';
import { cacheDir } from '@tauri-apps/api/path';
import { BaseDirectory, createDir, removeFile } from '@tauri-apps/api/fs';
import type { Service } from './types';
import { v4 as uuid } from 'uuid';

export function uploadS3(
  s3Setting: S3Setting,
  url: string,
  format: FormatType
) {
  // console.log('uploadS3');
  const now = new Date();
  const year = now.getUTCFullYear(),
    month = now.getUTCMonth() + 1,
    date = now.getUTCDate();
  let key = `${s3Setting.prefix.replace(
    /^\/|\/$/g,
    ''
  )}/${year}/${month}/${date}/${path.basename(url)}`;
  if (key.length > 0 && key[0] === '/') {
    key = key.substring(1);
  }
  return invoke('upload_s3', {
    region: s3Setting.region,
    bucket: s3Setting.bucket,
    filename: url,
    key: key,
    accessKeyId: s3Setting.accessKey,
    secretAccessKey: s3Setting.secretKey,
  })
    .then((res) => {
      const url = res as string;
      addImageUrlToDisplay(url);
      return writeText(ImageLinkFormatter.format(format, url));
    })
    .then(() => {
      uploading.set(false);
      console.log('add toast');
      addToast(ToastType.Success, 'Image URL Written to Clipboard');
      return notify('Success', 'Image URL Written to Clipboard');
    })
    .catch((err) => {
      addToast(ToastType.Error, err);
      return notify('Error', err);
      // uploading = false;
    });
}

export function uploadImg(url: string, format: FormatType, service?: Service) {
  console.log(service?.type);
  
  if (service?.type === ServiceTypesEnum.Enum.imgur) {
    const imgurSetting = service?.setting as ImgurSetting;
    console.log(imgurSetting);
    return invoke('upload_imgur_from_url', {
      url: url,
      clientId: imgurSetting.clientId,
    })
      .then((response: any) => {
        uploading.set(false);
        if (response) {
          const url = response.data.link as string;
          addImageUrlToDisplay(url);
          return writeText(ImageLinkFormatter.format(format, url));
        } else {
          // TODO: Error
          throw new Error('Unhandled Error');
        }
      })
      .then(() => {
        addToast(ToastType.Success, 'Image URL Written to Clipboard');
        return notify('Success', 'Image URL Written to Clipboard');
      })
      .catch((err) => {
        console.error(err);
        addToast(ToastType.Error, err);
        return notify('Error', err);
      });
  } else if (service?.type === ServiceTypesEnum.Enum.s3) {
    uploading.set(true);
    console.log(path.basename(url));
    const s3Setting = service?.setting as S3Setting;
    console.log(s3Setting);
    if (url.match(/^https?:\/\/.+/)) {
      return cacheDir()
        .then((cacheDir) => {
          const destDir = path.join(cacheDir, 'ezup', 'download_url');
          return createDir(destDir, {
            dir: BaseDirectory.Cache,
            recursive: true,
          }).then(() => invoke('download_file', { url: url, destDir }));
        })
        .then((filePath) => {
          if (filePath instanceof String || typeof filePath === 'string') {
            return uploadS3(s3Setting, filePath as string, format).then(() => {
              // remove the downloaded file
              return removeFile(filePath as string, {
                dir: BaseDirectory.Cache,
              });
            });
          } else {
            throw new Error(
              'Unexpected File Path Type from invoke("download_file")'
            );
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
    return uploadS3(s3Setting, url, format);
  } else {
    return Promise.reject('Service Not Supported');
  }
}

export async function uploadFromClipboard(
  format: FormatType,
  service?: Service
) {
  const clipboardText = await readText();
  uploading.set(true);

  if (!!clipboardText) {
    return uploadImg(clipboardText, format, service);
  } else {
    const filename = `${uuid()}.png`;
    const cachePath = await cacheDir();
    // console.log(cachePath);
    const clipboardImgPath = path.join(
      cachePath,
      'ezup',
      'clipboard-images',
      filename
    );
    await createDir('ezup/clipboard-images', {
      dir: BaseDirectory.Cache,
      recursive: true,
    });
    return invoke('image_to_file', {
      filename: clipboardImgPath,
    })
      .then(() => {
        // addToast(ToastType.Success, 'Clipboard Image Saved To FS');
        // uploading = false;
        return uploadImg(clipboardImgPath, format, service);
      })
      .then(() => {
        // Remove Cached File
        return removeFile(clipboardImgPath, {
          dir: BaseDirectory.Cache,
        });
      })
      .catch((err) => {
        console.error(err);
        addToast(ToastType.Error, err);
        return notify('Error', err);
      });
  }
}
