<script lang="ts">
  import { Input, Label, Button } from "flowbite-svelte";
</script>

<div class="w-full flex flex-col gap-2">
  <div>
    <Label for="clientId" class="mb-2">Region</Label>
    <Input id="clientId" type="text" placeholder="us-east-2" required />
  </div>
  <div>
    <Label for="clientId" class="mb-2">Bucket</Label>
    <Input id="clientId" type="text" required />
  </div>
  <div>
    <Label for="clientId" class="mb-2">Access Key</Label>
    <Input id="clientId" type="text" required />
  </div>
  <div>
    <Label for="clientId" class="mb-2">Secret Key</Label>
    <Input id="clientId" type="text" required />
  </div>
  <div>
    <Label for="clientId" class="mb-2">Domain</Label>
    <Input id="clientId" type="text" required />
  </div>
  <div>
    <Label for="clientId" class="mb-2">Save Path</Label>
    <Input id="clientId" type="text" required />
  </div>
</div>
