<script lang="ts">
  import { getVersion } from '@tauri-apps/api/app';
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, TableSearch, A } from 'flowbite-svelte';

  let appVersion=  "";
  getVersion().then(v => {
    appVersion = v
  })
</script>

<Table>
  <TableHead>
    <TableHeadCell>Key</TableHeadCell>
    <TableHeadCell>Value</TableHeadCell>
  </TableHead>
  <TableBody class="divide-y">
    <TableBodyRow>
      <TableBodyCell>Source Code</TableBodyCell>
      <TableBodyCell>
        <A class="font-medium hover:underline" href="https://github.com/HuakunShen/ezup" target="_blank">https://github.com/HuakunShen/ezup</A>
      </TableBodyCell>
    </TableBodyRow>
    <TableBodyRow>
      <TableBodyCell>EzUp Version</TableBodyCell>
      <TableBodyCell>{appVersion}</TableBodyCell>
    </TableBodyRow>
    <TableBodyRow>
      <TableBodyCell>Author</TableBodyCell>
      <TableBodyCell>
        <A class="font-medium hover:underline" href="https://huakun.tech" target="_blank">Huakun</A>
      </TableBodyCell>
    </TableBodyRow>
  </TableBody>
</Table>
