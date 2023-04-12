import {
  ServiceTypesEnum,
  type ImgurSetting,
  type S3Setting,
  type Service,
  ToastType,
} from './types';
import { invoke } from '@tauri-apps/api';
import { uploading, formatter } from '$lib/store';
import { writeText, readText } from '@tauri-apps/api/clipboard';
import {
  addToast,
  addImageUrlToDisplay,
  ImageLinkFormatter,
  type FormatType,
} from '$lib/util';
import path from 'path-browserify';
import { cacheDir } from '@tauri-apps/api/path';
import { BaseDirectory, createDir, removeFile } from '@tauri-apps/api/fs';
import { v4 as uuid } from 'uuid';
import { notify } from '$lib/notify';

export interface Uploader {
  uploadUrl: (url: string) => Promise<string>;
  uploadFile: (filepath: string) => Promise<string>;
}

export class S3Uploader implements Uploader {
  setting: S3Setting;

  constructor(setting: S3Setting) {
    this.setting = setting;
  }
  uploadUrl(url: string) {
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
          return this.uploadFile(filePath.toString()).then((_url) => {
            return removeFile(filePath as string, {
              dir: BaseDirectory.Cache,
            }).then(() => {
              return _url;
            });
          });
        } else {
          throw new Error(
            'Unexpected File Path Type from invoke("download_file")'
          );
        }
      });
  }
  uploadFile(filepath: string) {
    const now = new Date();
    const year = now.getUTCFullYear(),
      month = now.getUTCMonth() + 1,
      date = now.getUTCDate();
    let key = `${this.setting.prefix.replace(
      /^\/|\/$/g,
      ''
    )}/${year}/${month}/${date}/${path.basename(filepath)}`;
    if (key.length > 0 && key[0] === '/') {
      key = key.substring(1);
    }
    return invoke('upload_s3', {
      region: this.setting.region,
      bucket: this.setting.bucket,
      filename: filepath,
      key: key,
      accessKeyId: this.setting.accessKey,
      secretAccessKey: this.setting.secretKey,
    }).then((url) => {
      return url as string;
    });
  }
}

export class ImgurUploader implements Uploader {
  setting: ImgurSetting;

  constructor(setting: ImgurSetting) {
    this.setting = setting;
  }

  uploadUrl(url: string) {
    return this.uploadFile(url);
  }

  uploadFile(filepath: string) {
    return invoke('upload_imgur_from_url', {
      url: filepath,
      clientId: this.setting.clientId,
    }).then((response: any) => {
      if (response) {
        const url = response.data.link as string;
        return url;
      } else {
        throw new Error('Unhandled Error');
      }
    });
  }
}

export class UploadManager {
  uploader: Uploader;
  service: Service | undefined;
  format: FormatType;

  constructor(service: Service | undefined, format: FormatType) {
    this.service = service;
    this.format = format;
    if (service?.type === ServiceTypesEnum.Enum.imgur) {
      this.uploader = new ImgurUploader(service.setting as ImgurSetting);
    } else if (service?.type === ServiceTypesEnum.Enum.s3) {
      this.uploader = new S3Uploader(service.setting as S3Setting);
    } else {
      throw new Error('Unsupported Service Type');
    }
  }
  _upload(url_or_path: string) {
    if (this.service === undefined) {
      throw new Error('No Service Selected');
    }
    if (url_or_path.match(/^https?:\/\/.+/)) {
      return this.uploader.uploadUrl(url_or_path);
    } else {
      return this.uploader.uploadFile(url_or_path);
    }
  }
  upload(url_or_path: string): Promise<void> {
    if (this.service === undefined) {
      throw new Error('No Service Selected');
    }
    uploading.set(true);
    return this._upload(url_or_path)
      .then((url: string) => {
        addImageUrlToDisplay(url);
        uploading.set(false);
        return writeText(ImageLinkFormatter.format(this.format, url));
      })
      .then(() => {
        return addToast(ToastType.Success, 'Image URL Written to Clipboard');
      })
      .catch((err) => {
        return addToast(ToastType.Error, err);
      });
  }
}

export async function uploadFromClipboard(uploadManager: UploadManager) {
  const clipboardText = await readText();
  uploading.set(true);

  if (!!clipboardText) {
    // if clipboard text is non empty, it must be a link or file path
    return uploadManager.upload(clipboardText);
    // return uploadImg(clipboardText, format, service);
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
    // read image from clipboard and save to temp dir
    return invoke('image_to_file', {
      filename: clipboardImgPath,
    })
      .then(() => {
        // addToast(ToastType.Success, 'Clipboard Image Saved To FS');
        // uploading = false;
        return uploadManager.upload(clipboardImgPath);
        // return uploadImg(clipboardImgPath, format, service);
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
