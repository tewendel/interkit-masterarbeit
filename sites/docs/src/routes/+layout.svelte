<script>
  import Sidebar from "../components/Sidebar.svelte";
  import {items} from "../content/sidebar.json.js"

  import 'prismjs/themes/prism.css'

  //export const prerender = true;

</script>

<div class="container">
  <header class="header">
    <h1>
      <a href="/">
        Interkit docs
      </a>
    </h1>
  </header>
  <nav class="sidebar">
    <Sidebar {items} />
  </nav>
  <main class="main">
    <slot></slot>
  </main>
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: 15rem 1fr;
    grid-template-rows: auto 1fr;
    grid-column-gap: 2rem;
    height: 100vh;
  }

  .header {
    grid-column: 1 / span 2;
    background-color: var(--color-beige);
    padding: 1rem;
  }

  .header h1 {
    margin: 0;
  }

  .sidebar {
    grid-column: 1;
    background-color: var(--color-rose);
    padding: 1rem;
    overflow-y: auto;
  }

  .main {
    grid-column: 2;
    overflow-y: auto;
  }

</style>