<script lang="ts">
  import { Button } from 'flowbite-svelte';
  import { writeText, readText } from '@tauri-apps/api/clipboard';
  import { addToast } from '$lib/util';
  import { ToastType } from '$lib/types';

  export let imageUrl: string;
  function copyToClipboard() {
    return writeText(imageUrl)
      .then(() => {
        addToast(ToastType.Success, 'Image URL Written to Clipboard');
      })
      .catch((err) => {
        addToast(ToastType.Error, err);
      });
  }
</script>

<div>
  <div class="grid grid-cols-2">
    <div class="flex justify-center">
      <img class="max-h-32" src={imageUrl} alt="" />
    </div>
    <div class="flex justify-end gap-3 content-center items-center">
      <Button class="!p-2" on:click={copyToClipboard}>Copy Link</Button>
      <Button class="!p-2" href={imageUrl} target="_blank">Open</Button>
    </div>
  </div>
</div>

<style>
</style>
