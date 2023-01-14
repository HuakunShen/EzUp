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

  let uploading: boolean = false;
  let progress = 0;

  function uploadImg(url: string) {
    if ($curService?.type === ServiceTypesEnum.Enum.imgur) {
      const imgurSetting = $curService?.setting as ImgurSetting;
      console.log(imgurSetting);
      invoke('upload_imgur_from_url', {
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
    }
  }

  function uploadClicked(event: any) {
    uploading = true;
    return uploadImg(event.detail.url);
  }

  async function uploadFromClipboard() {
    const clipboardText = await readText();
    if (!!clipboardText) {
      return uploadImg(clipboardText);
    } else {
      addToast(ToastType.Warning, 'TODO: Upload Image');
    }
  }
</script>

<div class="flex justify-center">
  <div class="container flex flex-col justify-center items-center max-w-2xl">
    <div class="w-full">
      <Heading class="mb-2" tag="h4">Upload by Drag and Drop</Heading>
    </div>
    <DropUpload />
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
