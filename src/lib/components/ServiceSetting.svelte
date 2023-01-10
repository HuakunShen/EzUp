<script lang="ts">
  import ImgurSetting from '$lib/components/ServiceSettings/ImgurSetting.svelte';
  import S3Setting from '$lib/components/ServiceSettings/S3Setting.svelte';
  import { Input, Label, Alert, Button } from 'flowbite-svelte';
  import { services, curService, selectedServiceId } from '$lib/store';

  function onDelete() {
    services.update((x) => x.filter((y) => y.id !== $curService?.id));
    const nextService = $services.length === 0 ? undefined : $services[0];
    selectedServiceId.set(nextService?.id);
  }
  function onNameChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    services.update((_services) => {
      const servicesClone = [..._services];
      servicesClone.forEach((_service) => {
        if (_service.id === $curService?.id) {
          _service.name = target.value;
        }
      });
      return servicesClone;
    });
  }
  function onValidate() {}
</script>

{#if !$curService}
  <Alert color="yellow" accent>
    <span slot="icon"
      ><svg
        aria-hidden="true"
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clip-rule="evenodd"
        /></svg
      ></span
    >
    <span class="font-medium">Warning</span>
    No Service Selected, please select one or create one.
  </Alert>
{:else}
  <div class="mb-3">
    <strong>Service Name:</strong> <span>{$curService.name}</span>
    <br />
    <strong>Service Type:</strong> <span>{$curService.type}</span>
  </div>
  <div class="mb-2">
    <Label for="service-name" class="mb-2">Service Name</Label>
    <Input
      id="service-name"
      type="text"
      required
      value={$curService.name}
      on:input={onNameChange}
    />
  </div>
  {#if $curService.type === 'imgur'}
    <ImgurSetting />
  {:else if $curService.type === 's3'}
    <S3Setting />
  {:else}
    <Alert color="red">
      <span class="font-medium">Error</span> Service Type {$curService.type}
      Not Supported
    </Alert>
  {/if}
  <div class="relative h-24">
    <div class="absolute bottom-0 right-0">
      <Button color="alternative" on:click={onValidate}>Validate</Button>
      <Button color="red" on:click={onDelete}>Delete</Button>
    </div>
  </div>
{/if}
