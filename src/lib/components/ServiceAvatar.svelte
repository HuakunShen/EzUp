<script lang="ts">
  import { Avatar } from "flowbite-svelte";
  export let service: string;
</script>

{#if service === "s3"}
  <Avatar class="inline" src="/aws-logo.jpg" size="sm" />
{:else if service === "imgur"}
  <Avatar class="inline" src="/imgur-logo.webp" size="sm" />
{/if}
