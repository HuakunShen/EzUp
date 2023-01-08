<script lang="ts">
  import ImgurSetting from "$lib/ServiceSettings/ImgurSetting.svelte";
  import S3Setting from "$lib/ServiceSettings/S3Setting.svelte";
  import { Alert, Button } from "flowbite-svelte";

  export let selectedServiceName: string;
  export let selectedServiceType: string;
</script>

<div class="mb-3">
  <strong>Service Name:</strong> <span>{selectedServiceName}</span>
</div>

{#if selectedServiceType === "imgur"}
  <ImgurSetting />
{:else if selectedServiceType === "s3"}
  <S3Setting />
{:else}
  <Alert color="red">
    <span class="font-medium">Service Type Not Handled.</span>
  </Alert>
{/if}

<div class="relative h-24">
  <Button class="absolute bottom-0 right-0" color="alternative">
    Validate
  </Button>
</div>
