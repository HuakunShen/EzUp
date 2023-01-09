<script lang="ts">
  import DropUpload from "$lib/components/DropUpload.svelte";
  import UploadURL from "$lib/components/UploadURL.svelte";
  import { Heading, Progressbar } from "flowbite-svelte";

  let uploading: boolean = true;
  let progress = 0;
  setInterval(() => {
    progress = (progress + 1) % 100;
  }, 1000);
</script>

<div class="flex justify-center">
  <div class="container flex flex-col justify-center items-center max-w-2xl">
    <div class="w-full">
      <Heading class="mb-2" tag="h4">Upload by Drag and Drop</Heading>
    </div>
    <DropUpload />
    <br />
    <h2 class="font-medium text-lg">OR</h2>
    <br />
    <div class="w-full">
      <Heading class="mb-2" tag="h4">File URL To Upload</Heading>
      <UploadURL uploading={uploading} />
    </div>
    <div class="w-full">
      <Progressbar
        progress={progress.toString()}
        size="h-3"
        labelInside
        color="blue"
        labelInsideClass="bg-blue-600 text-blue-100 text-xs font-medium text-center p-0 leading-none rounded-full"
        class="my-4"
        labelOutside="Upload Progress Bar"
      />
      
    </div>
  </div>
</div>
