<script lang="ts">
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import { toasts } from '$lib/store';
  import { addToast } from '$lib/util';
  import { ToastType } from '$lib/types';
  import { Toast } from 'flowbite-svelte';
  import { slide } from 'svelte/transition';
  import { curService, init as initStore } from '$lib/store';
  
  // addToast(ToastType.Success, 'success success success success success');
  // setInterval(() => {
  //   addToast(ToastType.Success, 'success');
  // }, 3000);
  
  initStore().then(() => {
    console.log('Store Initialized');
  });
  $: console.log($curService?.type);
</script>

<main class="px-5">
  <Navbar />
  <div class="flex justify-center">
    <div class="max-w-full min-w-[5em]">
      {#each $toasts as toast, i}
        {#if toast.type === ToastType.Success}
          <Toast transition={slide} color="green" class="mb-2">
            <svelte:fragment slot="icon">
              <svg
                aria-hidden="true"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                ><path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                /></svg
              >
              <span class="sr-only">Check icon</span>
            </svelte:fragment>
            {toast.msg}
          </Toast>
        {:else if toast.type === ToastType.Warning}
          <Toast transition={slide} color="pink">
            <svelte:fragment slot="icon">
              <svg
                aria-hidden="true"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                ><path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                /></svg
              >
              <span class="sr-only">Warning icon</span>
            </svelte:fragment>
            {toast.msg}
          </Toast>
        {:else if toast.type === ToastType.Error}
          <Toast transition={slide} color="red" class="mb-2">
            <svelte:fragment slot="icon">
              <svg
                aria-hidden="true"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                ><path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                /></svg
              >
              <span class="sr-only">Error icon</span>
            </svelte:fragment>
            {toast.msg}
          </Toast>
        {:else}{/if}
      {/each}
    </div>
  </div>

  <slot />
</main>
