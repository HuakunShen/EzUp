<script lang="ts">
  import {
    register,
    isRegistered,
    unregister,
  } from '@tauri-apps/api/globalShortcut';
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Button,
    Kbd,
    Radio,
  } from 'flowbite-svelte';
  import HotkeySelection from '$lib/components/HotkeySelection.svelte';
  import { shortcutsMap, curService, formatter } from '$lib/store';
  import type { FormatType } from '$lib/util';
  import { FormatEnum } from '$lib/util';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { toggleWindow } from '$lib/shortcut';
  import { uploadFromClipboard, UploadManager } from '$lib/uploader';

  let activeKey = '';
  let toggleHotkeySelection: HotkeySelection;
  let toggleHotkeyValue: string;
  let uploadHotkeySelection: HotkeySelection;
  let uploadHotkeyValue: string;
  let toggleWarning: string = '';
  let uploadWarning: string = '';
  let format: FormatType = $formatter;

  let uploadManager: UploadManager;
  $: if ($curService) {
    uploadManager = new UploadManager($curService, $formatter);
  }

  onMount(() => {
    if (!$shortcutsMap) return goto('/');
    toggleHotkeyValue = $shortcutsMap.toggleWindow;
    uploadHotkeyValue = $shortcutsMap.upload;
  });

  $: (async () => {
    if ($shortcutsMap && toggleHotkeyValue !== $shortcutsMap.toggleWindow) {
      await unregister($shortcutsMap.toggleWindow);
      if (await isRegistered(toggleHotkeyValue)) {
        toggleWarning = 'Shortcut Already Registered';
      } else {
        toggleWarning = '';
        shortcutsMap.update((m) => ({ ...m, toggleWindow: toggleHotkeyValue }));
        await register(toggleHotkeyValue, toggleWindow);
      }
    }

    if ($shortcutsMap && uploadHotkeyValue !== $shortcutsMap.upload) {
      await unregister($shortcutsMap.upload);
      if (await isRegistered(uploadHotkeyValue)) {
        uploadWarning = 'Shortcut Already Registered';
      } else {
        uploadWarning = '';
        shortcutsMap.update((m) => ({ ...m, upload: uploadHotkeyValue }));
        await register(uploadHotkeyValue, () => {
          return uploadFromClipboard(uploadManager).then(() => {
            console.log('uploaded from clipboard');
          });
        });
      }
    }
  })();

  // Update format in store on update
  $: formatter.set(format);
</script>

<div class="text-left w-full">
  <h1 class="text-3xl mb-3">Preference</h1>
  <Table>
    <TableHead>
      <TableHeadCell>Command</TableHeadCell>
      <TableHeadCell>Shortcut</TableHeadCell>
    </TableHead>
    <TableBody>
      <TableBodyRow>
        <TableBodyCell>Toggle Window</TableBodyCell>
        <TableBodyCell>
          <HotkeySelection
            key="toggle"
            bind:activeKey
            bind:this={toggleHotkeySelection}
            bind:keyCombination={toggleHotkeyValue}
          />
          <Kbd class="px-2 py-1.5 mr-1">{toggleHotkeyValue}</Kbd>
          <Button
            size="xs"
            on:click={() =>
              (activeKey = activeKey === 'toggle' ? '' : 'toggle')}
          >
            {activeKey === 'toggle' ? 'End' : 'Start'}
          </Button>
          <small class="text-red-400">{toggleWarning}</small>
        </TableBodyCell>
      </TableBodyRow>
      <TableBodyRow>
        <TableBodyCell>Upload</TableBodyCell>
        <TableBodyCell>
          <HotkeySelection
            key="upload"
            bind:activeKey
            bind:this={uploadHotkeySelection}
            bind:keyCombination={uploadHotkeyValue}
          />
          <Kbd class="px-2 py-1.5 mr-1">{uploadHotkeyValue}</Kbd>
          <Button
            size="xs"
            on:click={() =>
              (activeKey = activeKey === 'upload' ? '' : 'upload')}
          >
            {activeKey === 'upload' ? 'End' : 'Start'}
          </Button>
          <small class="text-red-400">{uploadWarning}</small>
        </TableBodyCell>
      </TableBodyRow>
    </TableBody>
  </Table>
  <h1 class="text-3xl mb-3">Formatter</h1>
  <ul
    class="w-48 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-600 divide-y divide-gray-200 dark:divide-gray-600"
  >
    <li>
      <Radio class="p-3" bind:group={format} value={FormatEnum.enum.plainlink}
        >Plain Link</Radio
      >
    </li>
    <li>
      <Radio class="p-3" bind:group={format} value={FormatEnum.enum.markdown}
        >Markdown</Radio
      >
    </li>
    <li>
      <Radio class="p-3" bind:group={format} value={FormatEnum.enum.html}
        >HTML</Radio
      >
    </li>
  </ul>
</div>
