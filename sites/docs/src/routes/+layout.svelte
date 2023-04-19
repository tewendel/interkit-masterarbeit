<script>
  import Sidebar from "../components/Sidebar.svelte";
  import {items} from "../content/sidebar.json.js"

  import iframed from "$lib/iframed.js"

  import 'prismjs/themes/prism.css'

  //export const prerender = true;

</script>

<div class="container">
  <header class="header">
    <h1>
      <a href="/" style="text-decoration: none;">
        <svg class="logo" width="48" height="48" viewBox="0 0 44 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3.04731" y="3.04731" width="39.4629" height="41.9053" rx="12.1474" fill="#32332E"></rect><rect x="10.4387" y="19.9509" width="4.24194" height="19.0244" fill="#9F8CBD"></rect><circle cx="12.5596" cy="12.5596" r="3.53495" fill="#F1BB41"></circle><path d="M18.7937 23.9998L36.5327 9.02445L36.5327 38.9751L18.7937 23.9998Z" fill="#D9A7B1"></path><rect x="3.04731" y="3.04731" width="39.4629" height="41.9053" rx="12.1474" stroke="#32332E" stroke-width="0.385631"></rect></svg>
        <span style="position:relative; bottom:8px;">Interkit docs
        </span>
      </a>
    </h1>
  </header>
  <main class="main">
    <slot></slot>
  </main>
  <nav class="sidebar">
    <Sidebar {items} />
  </nav>
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
    grid-row: 2;
    background-color: var(--color-rose);
    padding: 1rem;
    overflow-y: auto;
  }

  .main {
    grid-column: 2;
    overflow-y: auto;
  }

  @media screen and (max-width: 600px) {
    .container {
      display: block;
    }
  }


</style>
