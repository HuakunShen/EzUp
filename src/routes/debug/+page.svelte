<script lang="ts">
  import { Button } from 'flowbite-svelte';
  import { cacheDir, configDir } from '@tauri-apps/api/path';
  import { Store } from 'tauri-plugin-store-api';
  import { checkUpdate } from '@tauri-apps/api/updater';

  const store = new Store('settings-debug.json');

  async function debug() {
    console.log(await configDir());
    console.log(process.env.NODE_ENV);
    // const update = await checkUpdate();
    // console.log(update);

    checkUpdate()
      .then((update) => {
        console.log(update);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function setStore() {
    const res = await store.set('some-key', { value: 5 });
    console.log(res);
  }

  async function getStore() {
    const val = await store.get('some-key');
    console.log(val);
    alert(val);
  }
</script>

<Button on:click={debug}>Debug</Button>
<Button on:click={setStore}>Set</Button>
<Button on:click={getStore}>Get</Button>
