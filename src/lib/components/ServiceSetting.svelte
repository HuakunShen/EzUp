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
{/if}

<div class="relative h-24">
  <Button class="absolute bottom-0 right-0" color="alternative">
    Validate
  </Button>
</div>
