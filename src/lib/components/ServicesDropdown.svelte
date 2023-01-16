<script lang="ts">
  import {
    Button,
    Dropdown,
    DropdownItem,
    Chevron,
    Avatar,
  } from 'flowbite-svelte';
  import ServiceAvatar from '$lib/components/ServiceAvatar.svelte';
  import { ServiceTypes } from '$lib/constants';
  import { services, selectedServiceId, curService } from '$lib/store';
  import { getEmptySetting } from '$lib/util';
  import { KeyServices, KeyCurSerivce } from '$lib/constants';
  import { v4 as uuidv4 } from 'uuid';

  let dropdownOpen = false;
  function addService(serviceType: ServiceTypes) {
    const newId = uuidv4();
    services.update((x) => [
      ...x,
      {
        type: serviceType,
        name: 'Placeholder',
        id: newId,
        setting: getEmptySetting(serviceType),
      },
    ]);
    selectedServiceId.set(newId);
    dropdownOpen = false;
  }
</script>

<Button><Chevron>Add Service</Chevron></Button>
<Dropdown bind:open={dropdownOpen}>
  <DropdownItem on:click={() => addService(ServiceTypes.S3)}>
    <ServiceAvatar service={ServiceTypes.S3} />
    <span class="ml-2 font-semibold">S3</span>
  </DropdownItem>
  <DropdownItem on:click={() => addService(ServiceTypes.Imgur)}>
    <ServiceAvatar service={ServiceTypes.Imgur} />
    <span class="ml-2 font-semibold">Imgur</span>
  </DropdownItem>
</Dropdown>
