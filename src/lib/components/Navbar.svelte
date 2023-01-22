<script>
  import {
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    NavHamburger,
  } from 'flowbite-svelte';
  import { page } from '$app/stores';
  import { isDev } from '$lib/util';
</script>
<Navbar let:hidden let:toggle>
  <NavBrand href="/">
    <img
      src="https://flowbite.com/docs/images/logo.svg"
      class="mr-3 h-6 sm:h-9"
      alt="Flowbite Logo"
    />
    <span
      class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
    >
      EzUp
    </span>
  </NavBrand>
  <div class="flex md:order-2">
    <!-- <Button size="sm">Get started</Button> -->
    <NavHamburger on:click={toggle} />
  </div>
  <NavUl {hidden} class="order-1">
    <NavLi href="/" active={$page.route.id === '/'}>Home</NavLi>
    <!-- <NavLi href="/preference" active={$page.route.id === '/preference'}
      >Preference</NavLi
    > -->
    <NavLi href="/service" active={$page.route.id === '/service'}>Service</NavLi
    >
    <NavLi href="/display" active={$page.route.id === '/display'}>Display</NavLi
    >
    <NavLi href="/about" active={$page.route.id === '/about'}>About</NavLi>
    {#if isDev()}
      <NavLi href="/debug" active={$page.route.id === '/debug'}>Debug</NavLi>
    {:else}{/if}
  </NavUl>
</Navbar>
