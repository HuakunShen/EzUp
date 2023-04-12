<script lang="ts">
  import { Button } from 'flowbite-svelte';
  import { Store } from 'tauri-plugin-store-api';
  import { notify } from '$lib/notify';
  import { readImage } from 'tauri-plugin-clipboard-api';
  const store = new Store('settings-debug.json');
  
  async function debug() {
    await notify('Hello');
    readImage().then((data) => {
      console.log(data);
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
