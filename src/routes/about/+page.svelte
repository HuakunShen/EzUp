<script lang="ts">
  import { getVersion } from '@tauri-apps/api/app';
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Checkbox,
    TableSearch,
    A,
    P,
    Li,
    Heading,
    List,
  } from 'flowbite-svelte';

  let appVersion = '';
  getVersion().then((v) => {
    appVersion = v;
  });
</script>

<div class="p-4">
  <Table>
    <TableHead>
      <TableHeadCell>Key</TableHeadCell>
      <TableHeadCell>Value</TableHeadCell>
    </TableHead>
    <TableBody>
      <TableBodyRow>
        <TableBodyCell>Source Code</TableBodyCell>
        <TableBodyCell>
          <A
            class="font-medium hover:underline"
            href="https://github.com/HuakunShen/ezup"
            target="_blank">https://github.com/HuakunShen/ezup</A
          >
        </TableBodyCell>
      </TableBodyRow>
      <TableBodyRow>
        <TableBodyCell>EzUp Version</TableBodyCell>
        <TableBodyCell>{appVersion}</TableBodyCell>
      </TableBodyRow>
      <TableBodyRow>
        <TableBodyCell>Author</TableBodyCell>
        <TableBodyCell>
          <A
            class="font-medium hover:underline"
            href="https://huakun.tech"
            target="_blank">Huakun</A
          >
        </TableBodyCell>
      </TableBodyRow>
    </TableBody>
  </Table>
  <br />
  <div class="insturcitons px-5">
    <h1 class="text-3xl">Instructions</h1>
    <h2 class="text-2xl mt-5">Imgur Service</h2>
    <P>
      See <A src="https://apidocs.imgur.com/">API Docs</A> for how to create an application.
      Put the client id in this application.
    </P>
    <h2 class="text-2xl mt-5">AWS S3 Service</h2>
    <p>
      Make a AWS S3 bucket and put the bucket name and region in this
      application.
    </p>
    <p>Get Access Key and Secret Access Key with access to your S3 bucket.</p>
  </div>
</div>
