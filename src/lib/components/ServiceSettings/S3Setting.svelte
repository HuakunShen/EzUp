<script lang="ts">
  import { Input, Label, Button } from 'flowbite-svelte';
  import type { S3Setting, ServiceSetting } from '$lib/types';
  import { emptyImgurSetting, updateServiceSetting } from '$lib/util';
  import { curService } from '$lib/store';
  import _ from 'lodash';
  import { onMount } from 'svelte';

  export let settingOnUpdate = (setting: S3Setting) => {};
  export let initSetting: ServiceSetting;
  let setting: S3Setting = initSetting as S3Setting;
  onMount(() => {
    if ($curService) {
      setting = $curService.setting as S3Setting;
    }
  });

  $: settingOnUpdate(setting);
</script>

<div class="w-full flex flex-col gap-2">
  <div>
    <Label for="region" class="mb-2">Region</Label>
    <Input
      id="region"
      type="text"
      placeholder="region: e.g. us-east-2"
      required
      bind:value={setting.region}
      
    />
  </div>
  <div>
    <Label for="bucket" class="mb-2">Bucket</Label>
    <Input
      id="bucket"
      type="text"
      placeholder="Bucket Name"
      required
      bind:value={setting.bucket}
    />
  </div>
  <div>
    <Label for="access-key-id" class="mb-2">Access Key Id</Label>
    <Input
      id="access-key-id"
      type="text"
      placeholder="access-key-id"
      required
      bind:value={setting.accessKey}
    />
  </div>
  <div>
    <Label for="secret-access-key" class="mb-2">Secret Access Key</Label>
    <Input
      id="secret-access-key"
      type="text"
      placeholder="secret-access-key"
      required
      bind:value={setting.secretKey}
    />
  </div>
  <!-- <div>
    <Label for="domain" class="mb-2">Domain</Label>
    <Input
      id="domain"
      type="text"
      placeholder="Domain"
      required
      bind:value={setting.domain}
    />
  </div>
  <div>
    <Label for="save-path" class="mb-2">Save Path</Label>
    <Input id="save-path" type="text" required bind:value={setting.savePath} />
  </div> -->
</div>
