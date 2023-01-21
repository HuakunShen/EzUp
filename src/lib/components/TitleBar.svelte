<script lang="ts">
  import { appWindow } from '@tauri-apps/api/window';
</script>

<div data-tauri-drag-region class="titlebar h-8">
  <button
    on:click={() => appWindow.minimize()}
    class="titlebar-button hover:bg-red-500"
    id="titlebar-minimize"
  >
    <img
      class="invert"
      src="https://api.iconify.design/mdi:window-minimize.svg"
      alt="minimize"
    />
  </button>
  <button
    class="titlebar-button hover:bg-red-500"
    id="titlebar-maximize"
    on:click={() => appWindow.maximize()}
  >
    <img
      class="invert"
      src="https://api.iconify.design/mdi:window-maximize.svg"
      alt="maximize"
    />
  </button>
  <button
    class="titlebar-button hover:bg-red-500"
    id="titlebar-close"
    on:click={() => appWindow.hide()}
  >
    <img
      class="invert"
      src="https://api.iconify.design/mdi:close.svg"
      alt="close"
    />
  </button>
</div>

<style>
  .titlebar {
    /* height: 30px; */
    /* background: #329ea3; */
    user-select: none;
    display: flex;
    justify-content: flex-end;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
  .titlebar-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 2rem;
    height: 2rem;
  }
</style>
