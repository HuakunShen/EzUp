<script lang="ts">
  import { Dropzone } from 'flowbite-svelte';
  import FileDrop from 'svelte-tauri-filedrop';
  import { addToast } from '$lib/util';
  import { ToastType } from '$lib/types';
  import type { UploadManager } from '$lib/uploader';

  export let uploadManager: UploadManager;

  let clazz: string = 'w-full';
  export { clazz as class };
  export let uploadThroughFileInput = (file: File) => {};

  let files: any = [];
  function onFileChange(event: any) {
    console.log(event);
    console.log(event.target.files[0]);
    const file: File = event.target.files[0];
    uploadThroughFileInput(file);
  }

  function open(paths: string[]) {
    if (paths.length > 1) {
      addToast(
        ToastType.Error,
        'Currently does not support multiple files. Will be supported later.'
      );
    } else if (paths.length == 0) {
      addToast(ToastType.Error, 'No file selected');
    } else {
      return uploadManager.upload(paths[0]);
      // return uploadImg(paths[0], $formatter, $curService);
    }
  }
</script>

<FileDrop
  extensions={['png', 'jpg', 'JPEG', 'jpeg', 'svg', 'gif']}
  handleFiles={open}
  let:files
>
  <Dropzone id="dropzone" class={clazz} on:change={onFileChange}>
    <svg
      aria-hidden="true"
      class="mb-3 w-10 h-10 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      /></svg
    >
    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
      <span class="font-semibold">Click to upload</span> or drag and drop
    </p>
    <p class="text-xs text-gray-500 dark:text-gray-400">
      SVG, PNG, JPG or GIF (MAX. 800x400px)
    </p>
  </Dropzone>
</FileDrop>

<style>
  .dropzone {
    margin: 20px;
    padding: 20px;
    background: #eee;
  }
  .droppable {
    background: #d6dff0;
  }
</style>
