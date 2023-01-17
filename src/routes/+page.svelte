<script lang="ts">
  import DropUpload from '$lib/components/DropUpload.svelte';
  import UploadURL from '$lib/components/UploadURL.svelte';
  import { Heading, Progressbar, Button } from 'flowbite-svelte';
  import { invoke } from '@tauri-apps/api';
  import { writeText, readText } from '@tauri-apps/api/clipboard';
  import { addToast, addImageUrlToDisplay } from '$lib/util';
  import { ToastType, ServiceTypesEnum } from '$lib/types';
  import type { ImgurSetting, S3Setting } from '$lib/types';
  import { curService } from '$lib/store';
  import { notify } from '$lib/notify';
  import {
    BaseDirectory,
    createDir,
    removeFile,
    writeBinaryFile,
  } from '@tauri-apps/api/fs';
  import { cacheDir, configDir } from '@tauri-apps/api/path';
  import path from 'path-browserify';
  import { v4 as uuid } from 'uuid';
  import { register, isRegistered } from '@tauri-apps/api/globalShortcut';

  let uploading: boolean = false;
  let progress = 0;

  // setInterval(() => {
  //   console.log($curService);
  // }, 1000)

  function uploadS3(s3Setting: S3Setting, url: string) {
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
        addImageUrlToDisplay(res as string);
        return writeText(res as string);
      })
      .then(() => {
        uploading = false;
        addToast(ToastType.Success, 'Image URL Written to Clipboard');
        return notify('Success', 'Image URL Written to Clipboard');
      })
      .catch((err) => {
        addToast(ToastType.Error, err);
        return notify('Error', err);
        uploading = false;
      });
  }

  function uploadImg(url: string) {
    if ($curService?.type === ServiceTypesEnum.Enum.imgur) {
      const imgurSetting = $curService?.setting as ImgurSetting;
      console.log(imgurSetting);
      return invoke('upload_imgur_from_url', {
        url: url,
        clientId: imgurSetting.clientId,
      })
        .then((response: any) => {
          console.log(response);

          uploading = false;
          if (response) {
            const url = response.data.link as string;
            addImageUrlToDisplay(url);
            return writeText(url);
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
          uploading = false;
        });
    } else if ($curService?.type === ServiceTypesEnum.Enum.s3) {
      console.log('upload s3');
      console.log(url);

      uploading = true;
      console.log(path.basename(url));
      const s3Setting = $curService?.setting as S3Setting;
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
              return uploadS3(s3Setting, filePath as string).then(() => {
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
      return uploadS3(s3Setting, url);
    } else {
      return Promise.reject('Service Not Supported');
    }
  }

  function uploadClicked(event: any) {
    uploading = true;
    return uploadImg(event.detail.url);
  }

  async function uploadFromClipboard() {
    const clipboardText = await readText();
    uploading = true;
    // console.log('$curService', $curService);
    // console.log($curService?.type);

    if (!!clipboardText) {
      return uploadImg(clipboardText);
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
          return uploadImg(clipboardImgPath);
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
          uploading = false;
        });
    }
  }

  function uploadThroughFileInput(file: File) {
    var reader = new FileReader();
    let destPath: string = '';
    reader.onload = async function (e) {
      const arrBuf = reader.result as ArrayBuffer;
      const cachePath = await cacheDir();
      destPath = path.join(cachePath, 'ezup', file.name);
      writeBinaryFile(destPath, new Uint8Array(arrBuf), {
        dir: BaseDirectory.Cache,
      })
        .then(() => {
          return uploadImg(destPath);
        })
        .catch((err) => {
          addToast(ToastType.Error, err.toString());
          return notify('Error', err);
        });
    };
    reader.readAsArrayBuffer(file);
  }

  isRegistered('CommandOrControl+Alt+U')
    .then((registered) => {
      if (!registered) {
        return register('CommandOrControl+Alt+U', () => {
          return uploadFromClipboard();
        }).then(() => {
          console.log('Upload Shortcut Registered');
        });
      }
    })
    .catch((err) => {
      console.error('Failed to register shortcut keys');
      console.error(err);
    });
</script>

<div class="flex justify-center">
  <div class="container flex flex-col justify-center items-center max-w-2xl">
    <p>
      <strong>Current Service:</strong>: {$curService?.name} ({$curService?.type})
    </p>
    <!-- <Button on:click={() => {notify('Test Notification')}}>Send Notification</Button> -->

    <div class="w-full">
      <Heading class="mb-2" tag="h4">Upload by Drag and Drop</Heading>
    </div>
    <DropUpload class="max-w-md max-h-52" {uploadThroughFileInput} />
    <br />
    <h2 class="font-medium text-lg">OR</h2>
    <div class="w-full">
      <!-- <Heading class="mb-2" tag="h4">Upload from Clipboard</Heading> -->
      <div class="text-center mt-5">
        <Button on:click={uploadFromClipboard}>Upload from Clipboard</Button>
      </div>
    </div>
    <br />
    <h2 class="font-medium text-lg">OR</h2>
    <br />
    <div class="w-full">
      <Heading class="mb-2" tag="h4">File URL To Upload</Heading>
      <UploadURL {uploading} on:upload={uploadClicked} />
    </div>
    <!-- <div class="w-full">
      <Progressbar
        progress={progress.toString()}
        size="h-3"
        labelInside
        color="blue"
        labelInsideClass="bg-blue-600 text-blue-100 text-xs font-medium text-center p-0 leading-none rounded-full"
        class="my-4"
        labelOutside="Upload Progress Bar"
      />
    </div> -->
  </div>
</div>
