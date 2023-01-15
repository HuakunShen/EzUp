<script lang="ts">
  import DropUpload from '$lib/components/DropUpload.svelte';
  import UploadURL from '$lib/components/UploadURL.svelte';
  import { Heading, Progressbar, Button } from 'flowbite-svelte';
  import { invoke } from '@tauri-apps/api';
  import { writeText, readText } from '@tauri-apps/api/clipboard';
  import { addToast } from '$lib/util';
  import { ToastType, ServiceTypesEnum } from '$lib/types';
  import type { ImgurSetting, S3Setting } from '$lib/types';
  import { curService } from '$lib/store';
  import { BaseDirectory, createDir, removeFile } from '@tauri-apps/api/fs';
  import { cacheDir } from '@tauri-apps/api/path';
  import path from 'path-browserify';
  // var path = require('path')
  import { v4 as uuid } from 'uuid';

  let uploading: boolean = false;
  let progress = 0;

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
            return writeText(response.data.link as string);
          } else {
            // TODO: Error
            throw new Error('Unhandled Error');
          }
        })
        .then(() => {
          addToast(ToastType.Success, 'Image URL Written to Clipboard');
        })
        .catch((err) => {
          console.error(err);
          addToast(ToastType.Error, err);
          uploading = false;
        });
    } else if ($curService?.type === ServiceTypesEnum.Enum.s3) {
      console.log('upload s3');
      uploading = true;
      console.log(path.basename(url));
      const s3Setting = $curService?.setting as S3Setting;
      console.log(s3Setting);

      // invoke('greet', { name: 'huakun' }).then((x) => {
      //   console.log(x);
      // });
      return invoke('upload_s3', {
        region: s3Setting.region,
        bucket: s3Setting.bucket,
        filename: url,
        key: path.basename(url),
        accessKeyId: s3Setting.accessKey,
        secretAccessKey: s3Setting.secretKey,
      })
        .then((res) => {
          return writeText(res as string);
        })
        .then(() => {
          addToast(ToastType.Success, 'Image URL Written to Clipboard');
        })
        .catch((err) => {
          addToast(ToastType.Error, err);
          uploading = false;
        });
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
          uploading = false;
        });
    }
  }
</script>

<div class="flex justify-center">
  <div class="container flex flex-col justify-center items-center max-w-2xl">
    <div class="w-full">
      <Heading class="mb-2" tag="h4">Upload by Drag and Drop</Heading>
    </div>
    <!-- <DropUpload />
    <br />
    <h2 class="font-medium text-lg">OR</h2> -->
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
    <div class="w-full">
      <Progressbar
        progress={progress.toString()}
        size="h-3"
        labelInside
        color="blue"
        labelInsideClass="bg-blue-600 text-blue-100 text-xs font-medium text-center p-0 leading-none rounded-full"
        class="my-4"
        labelOutside="Upload Progress Bar"
      />
    </div>
  </div>
</div>
