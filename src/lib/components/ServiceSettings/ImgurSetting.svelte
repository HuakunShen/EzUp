<script lang="ts">
  import { Input, Label, Button } from 'flowbite-svelte';
  import type { ImgurSetting, ServiceSetting } from '$lib/types';
  import { emptyImgurSetting, updateServiceSetting } from '$lib/util';
  import { curService } from '$lib/store';
  import _ from 'lodash';
  import { onMount } from 'svelte';

  export let settingOnUpdate = (setting: ImgurSetting) => {};
  export let initSetting: ServiceSetting;
  let setting: ImgurSetting = initSetting as ImgurSetting;
  onMount(() => {
    if ($curService) {
      setting = $curService.setting as ImgurSetting;
    }
  });

  $: settingOnUpdate(setting);
  $: setting = $curService ? $curService.setting as ImgurSetting : setting;
</script>

<div class="w-full flex flex-col gap-4">
  <div>
    ImgurSetting
    <Label for="clientId" class="mb-2">Client ID</Label>
    <Input
      id="clientId"
      type="text"
      placeholder="Client ID"
      required
      bind:value={setting.clientId}
    />
  </div>
</div>
