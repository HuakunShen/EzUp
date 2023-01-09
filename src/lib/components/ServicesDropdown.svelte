<script>
  import {
    Button,
    Dropdown,
    DropdownItem,
    Chevron,
    Avatar,
  } from "flowbite-svelte";
  import ServiceAvatar from '$lib/ServiceAvatar.svelte'
</script>

<Button><Chevron>Add Service</Chevron></Button>
<Dropdown>
  <DropdownItem>
    <ServiceAvatar service="s3"/>
    <span class="ml-2 font-semibold">S3</span>
  </DropdownItem>
  <DropdownItem>
    <ServiceAvatar service="imgur"/>
    <span class="ml-2 font-semibold">Imgur</span>
  </DropdownItem>
</Dropdown>
