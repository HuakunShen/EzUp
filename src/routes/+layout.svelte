<script>
  import "../app.css";
  import Navbar from '$lib/Navbar.svelte'
</script>

<main class="px-5">
  <Navbar />
  <slot />
</main>
