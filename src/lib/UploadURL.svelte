<script lang="ts">
  import { Input, Button, Spinner } from "flowbite-svelte";
  export let uploading: boolean = false;
  let fileUrl: string = "";
</script>

<form>
  {fileUrl}
  <Input
    id="upload-input"
    placeholder="https://.../image.png"
    size="lg"
    bind:value={fileUrl}
  >
    <svg
      slot="left"
      aria-hidden="true"
      class="w-6 h-6 text-gray-500 dark:text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      /></svg
    >
    <Button slot="right" size="sm" type="submit">
      {#if uploading}
        <Spinner size="5" /> <span class="ml-2">Uploading</span>
      {:else}
        "Upload"
      {/if}
    </Button>
  </Input>
</form>
