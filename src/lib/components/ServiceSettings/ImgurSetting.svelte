<script lang="ts">
  import { Input, Label, Button } from "flowbite-svelte";
</script>

<div class="w-full flex flex-col gap-4">
  <div>
    <Label for="clientId" class="mb-2">Client ID</Label>
    <Input id="clientId" type="text" required />
  </div>
</div>
