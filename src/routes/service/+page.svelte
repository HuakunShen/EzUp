<script lang="ts">
  import ServicesDropdown from "$lib/ServicesDropdown.svelte";
  import ServiceListItem from "$lib/ServiceListItem.svelte";
  import ServiceSetting from "$lib/ServiceSetting.svelte";

  import { List, Li } from "flowbite-svelte";

  import type { Service, ServiceTypes } from "$lib/types";

  let selectedServiceName: string;
  let selectedServiceType: ServiceTypes;
  function changeSelection(serviceName: string, serviceType: ServiceTypes) {
    selectedServiceName = serviceName;
    selectedServiceType = serviceType;
  }
  const services: Service[] = [
    {
      type: "imgur",
      name: "imgur",
    },
    {
      type: "s3",
      name: "s3",
    },
  ];
</script>

<div class="grid grid-cols-6 gap-x-6 w-full mt-5 place-content-between">
  <div class="col-span-2">
    <List tag="ul" class="divide-y divide-gray-200 dark:divide-gray-700">
      {#each services as service, i}
        <ServiceListItem {service} {changeSelection} />
      {/each}
      <ServicesDropdown />
    </List>
  </div>
  <div class="col-span-4 mt-3">
    <ServiceSetting {selectedServiceName} {selectedServiceType} />
  </div>
</div>
