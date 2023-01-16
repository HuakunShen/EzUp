<script lang="ts">
  import type { Service, ServiceType } from "$lib/types";
  import ServiceAvatar from "$lib/components/ServiceAvatar.svelte";
  import { Li, Radio } from "flowbite-svelte";
  export let service: Service;
  export let group: string | undefined;
  export let changeSelection = (
    id: string
  ) => {};
</script>

<Li class="py-3 w-full" icon>
  <Radio
    name="service"
    custom
    class="w-full"
    group={group}
    value={service.id}
    on:click={() => changeSelection(service.id)}
  >
    <div
      class="inline-flex justify-start items-center p-3 w-full text-gray-500 bg-white rounded-lg border border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <ServiceAvatar service={service.type} />
      <div class="inline-flex justify-between items-center w-full pl-2">
        <div class="pl-2">
          <div class="w-full text-lg font-semibold">{service.name}</div>
          <div class="w-full">{service.type}</div>
        </div>
        <svg
          aria-hidden="true"
          class="ml-3 w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            fill-rule="evenodd"
            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          /></svg
        >
      </div>
    </div>
  </Radio>
</Li>
