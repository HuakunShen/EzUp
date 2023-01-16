<script lang="ts">
  import { logImagesUrls } from '$lib/store';
  import ImageDisplayListItem from '$lib/components/ImageDisplayListItem.svelte';
</script>

<div class="flex justify-center mb-10">
  <div class="flex flex-col">
    <p>Upload Images Will Be Displayed Here</p>
    <p>Data Will Be Cleared After Quiting This App</p>
  </div>
</div>
{#each $logImagesUrls as imageUrl, i}
  <ImageDisplayListItem {imageUrl} />
{/each}
