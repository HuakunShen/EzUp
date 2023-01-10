<script lang="ts">
  import { Input, Label, Button } from 'flowbite-svelte';
</script>

<div class="w-full flex flex-col gap-2">
  <div>
    <Label for="clientId" class="mb-2">Region</Label>
    <Input id="clientId" type="text" placeholder="us-east-2" required />
  </div>
  <div>
    <Label for="bucket" class="mb-2">Bucket</Label>
    <Input id="bucket" type="text" placeholder="Bucket Name" required />
  </div>
  <div>
    <Label for="access-key-id" class="mb-2">Access Key Id</Label>
    <Input
      id="access-key-id"
      type="text"
      placeholder="access-key-id"
      required
    />
  </div>
  <div>
    <Label for="secret-access-key" class="mb-2">Secret Access Key</Label>
    <Input
      id="secret-access-key"
      type="text"
      placeholder="secret-access-key"
      required
    />
  </div>
  <div>
    <Label for="domain" class="mb-2">Domain</Label>
    <Input id="domain" type="text" placeholder="Domain" required />
  </div>
  <div>
    <Label for="save-path" class="mb-2">Save Path</Label>
    <Input id="save-path" type="text" required />
  </div>
</div>
