<script lang="ts">
  import ServicesDropdown from '$lib/components/ServicesDropdown.svelte';
  import ServiceListItem from '$lib/components/ServiceListItem.svelte';
  import ServiceSetting from '$lib/components/ServiceSetting.svelte';
  import { List, Radio, Button } from 'flowbite-svelte';
  import { addToast } from '$lib/util';
  import { services, selectedServiceId, serviceMap } from '$lib/store';
  import { ToastType } from '$lib/types';
  let group: string | undefined =
    $services.length === 0 ? undefined : $services[0].id;
  selectedServiceId.subscribe((x) => {
    // update radio button selection when a new service is added
    group = x;
  });
  function changeSelection(id: string) {
    const _selected = $services.find((x) => x.id === id);
    if (!_selected) {
      console.error(`Unexpected Error, Cannot Find Service with id=${id}`);
      return;
    }
    selectedServiceId.set(_selected.id);
  }
  function clearServices() {
    selectedServiceId.set(undefined);
    services.set([]);
    addToast(ToastType.Success, "Done");
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
