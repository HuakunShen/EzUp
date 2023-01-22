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
  } from 'flowbite-svelte';
  import HotkeySelection from '$lib/components/HotkeySelection.svelte';
  import { shortcutsMap, curService } from '$lib/store';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { toggleWindow } from '$lib/shortcut';
  import { uploadFromClipboard } from '$lib/upload';

  let activeKey = '';
  let toggleHotkeySelection: HotkeySelection;
  let toggleHotkeyValue: string;
  let uploadHotkeySelection: HotkeySelection;
  let uploadHotkeyValue: string;
  let toggleWarning: string = '';
  let uploadWarning: string = '';

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
          return uploadFromClipboard($curService);
        });
      }
    }
  })();
</script>

<div class="text-left w-full">
  <h1 class="text-3xl">Preference</h1>
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
</div>
