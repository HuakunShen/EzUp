<script lang="ts">
  import DropUpload from '$lib/components/DropUpload.svelte';
  import UploadURL from '$lib/components/UploadURL.svelte';
  import { Heading, Progressbar, Button } from 'flowbite-svelte';
  import { invoke } from '@tauri-apps/api';
  import { writeText, readText } from '@tauri-apps/api/clipboard';
  import { addToast, addImageUrlToDisplay } from '$lib/util';
  import { ToastType, ServiceTypesEnum } from '$lib/types';
  import type { ImgurSetting, S3Setting } from '$lib/types';
  import { curService, uploading, shortcutsMap } from '$lib/store';
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
  import { uploadS3, uploadImg, uploadFromClipboard } from '$lib/upload';
  import { onMount } from 'svelte';

  function uploadClicked(event: any) {
    uploading.set(true);
    return uploadImg(event.detail.url, $curService);
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
          return uploadImg(destPath, $curService);
        })
        .catch((err) => {
          addToast(ToastType.Error, err.toString());
          return notify('Error', err);
        });
    };
    reader.readAsArrayBuffer(file);
  }
</script>

<div class="flex justify-center">
  <div class="container flex flex-col justify-center items-center max-w-2xl">
    <p>
      <strong>Current Service:</strong>: {$curService?.name} ({$curService?.type})
    </p>
    <div class="w-full">
      <Heading class="mb-2" tag="h4">Upload by Drag and Drop</Heading>
    </div>
    <DropUpload class="max-w-md max-h-52" {uploadThroughFileInput} />
    <br />
    <h2 class="font-medium text-lg">OR</h2>
    <div class="w-full">
      <!-- <Heading class="mb-2" tag="h4">Upload from Clipboard</Heading> -->
      <div class="text-center mt-5">
        <Button on:click={() => uploadFromClipboard($curService)}
          >Upload from Clipboard</Button
        >
      </div>
    </div>
    <br />
    <h2 class="font-medium text-lg">OR</h2>
    <br />
    <div class="w-full">
      <Heading class="mb-2" tag="h4">File URL To Upload</Heading>
      <UploadURL uploading={$uploading} on:upload={uploadClicked} />
    </div>
  </div>
</div>
