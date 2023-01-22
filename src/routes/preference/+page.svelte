<script lang="ts">
  import { register, isRegistered } from '@tauri-apps/api/globalShortcut';
  import { createDir, BaseDirectory, writeTextFile } from '@tauri-apps/api/fs';
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Checkbox,
    TableSearch,
    A,
    P,
    Li,
    Heading,
    List,
    Button,
    Kbd,
  } from 'flowbite-svelte';
  import HotkeySelection from '$lib/components/HotkeySelection.svelte';
  import { onMount } from 'svelte';

  let activeKey = '';
  let toggleHotkeySelection: HotkeySelection;
  let toggleHotkeyValue: string;
  let uploadHotkeySelection: HotkeySelection;
  let uploadHotkeyValue: string;

  onMount(() => {
    toggleHotkeyValue = 'Control+Command+U';
    uploadHotkeyValue = 'Command+Alt+U';
  });
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
          <!-- Control+Command+U -->
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
        </TableBodyCell>
      </TableBodyRow>
      <TableBodyRow>
        <TableBodyCell>Upload</TableBodyCell>
        <TableBodyCell>
          <!-- Command+Alt+U -->
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
        </TableBodyCell>
      </TableBodyRow>
    </TableBody>
  </Table>
  {activeKey}
  <!-- <HotkeySelection bind:this={toggleHotkeySelection}/>
  <button on:click={() => toggleHotkeySelection.start()}>Start</button> -->
</div>
