<script lang="ts">
  import ServicesDropdown from '$lib/components/ServicesDropdown.svelte';
  import ServiceListItem from '$lib/components/ServiceListItem.svelte';
  import ServiceSetting from '$lib/components/ServiceSetting.svelte';
  import { List, Button } from 'flowbite-svelte';
  import { addToast, clearAllData } from '$lib/util';
  import { notify } from '$lib/notify';
  import {
    services,
    selectedServiceId,
    shortcutsMap,
    curService,
    formatter,
  } from '$lib/store';
  import { ToastType } from '$lib/types';
  import { register, unregister } from '@tauri-apps/api/globalShortcut';
  import { uploadFromClipboard, UploadManager } from '$lib/uploader';

  let uploadManager: UploadManager;
  $: if ($curService) {
    uploadManager = new UploadManager($curService, $formatter);
  }

  let group: string | undefined =
    $services.length === 0 ? undefined : $services[0].id;
  selectedServiceId.subscribe((x) => {
    // update radio button selection when a new service is added
    group = x;
  });
  async function changeSelection(id: string) {
    const _selected = $services.find((x) => x.id === id);
    if (!_selected) {
      console.error(`Unexpected Error, Cannot Find Service with id=${id}`);
      return;
    }
    selectedServiceId.set(_selected.id);
    await unregister($shortcutsMap.upload);
    await register($shortcutsMap.upload, () => {
      return uploadFromClipboard(uploadManager);
    });
  }
  async function clearServices() {
    // selectedServiceId.set(undefined);
    // services.set([]);
    await clearAllData();
    await notify('Data All Cleared');
    addToast(ToastType.Success, 'Done');
  }
</script>

<div class="grid grid-cols-6 gap-x-6 w-full mt-5 place-content-between">
  <div class="col-span-2">
    <List tag="ul" class="divide-y divide-gray-200 dark:divide-gray-700">
      {#each $services as service, i}
        <ServiceListItem {group} {service} {changeSelection} />
      {/each}
      <ServicesDropdown />
    </List>
    <Button
      class="mt-5"
      outline
      gradient
      color="pinkToOrange"
      on:click={clearServices}>Clear All Services</Button
    >
  </div>
  <div class="col-span-4 mt-3">
    <ServiceSetting />
  </div>
</div>
