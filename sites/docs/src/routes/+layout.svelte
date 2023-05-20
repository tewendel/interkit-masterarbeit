<script>
  import Sidebar from "../components/Sidebar.svelte"
  import Breadcrumbs from "../components/Breadcrumbs.svelte"
  import {items} from "../content/sidebar.json.js"

  import { isIframed } from "$lib/iframed.js"

  import 'prismjs/themes/prism.css'

  //export const prerender = true;

  import { page } from '$app/stores'

  let sidebarEl

</script>

<div class="container" class:container__iframed={isIframed}>
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
  <div class="fixedheader">
    <button
      class="burger"
      on:click={() => { sidebarEl.scrollIntoView({ behavior: 'smooth', block: 'end' }) }}
      >
      ≡
    </button>
    <div class="breadcrumbs">
      <Breadcrumbs {items} />
    </div>
  </div>
  <main class="main">
    <slot></slot>
  </main>
  <nav class="sidebar" bind:this={sidebarEl}>
    <Sidebar {items} />
  </nav>
</div>

<style>

  :global(html) {
    scroll-behavior: smooth;
  }

  :global(html.iframed) {
    scroll-padding-top: 3rem;
  }

  :global(html.iframed body) {
    background-color: var(--color-bggrey);
  }

  .container {
    display: grid;
    grid-template-columns: 15rem 1fr;
    grid-template-rows: auto 1fr;
    grid-column-gap: 2rem;
    height: 100vh;
  }

  .container__iframed {
    display: block;
  }

  .header {
    grid-column: 1 / span 2;
    background-color: var(--color-beige);
    padding: 1rem;
  }

  .container__iframed .header {
    display: none;
  }

  /* only hide header 
  .container__iframed {
       grid-template-rows: 0 1fr;
  }
  .container__iframed .header {
    padding: 0;
    overflow: hidden;
  }
  */

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

  .container__iframed .sidebar {
    background-color: transparent;
  }

  .main {
    grid-column: 2;
    overflow-y: auto;
  }

  .container__iframed .main {
    padding: 2em 1rem 0 1rem;
    background-color: white;
  }

  @media screen and (max-width: 600px) {
    .container {
      display: block;
    }
  }

  .fixedheader {
    display: none;
    padding: 0rem 1rem;
  }

  .container__iframed .fixedheader {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: white;
    display: flex;
  }

  .fixedheader .breadcrumbs {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0.25rem 0;
  }

  .fixedheader .burger {
    border: 0;
    background: none;
    font-weight: bold;
    cursor: pointer;
    padding: 0.5em;
    width: 2em;
    text-align: center;
    position: relative;
    vertical-align: bottom;
    margin-right: 0.33em;
  }

  .fixedheader .burger:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  :global(h2[id]:not([id="table-of-contents"]) a),
  :global(h3[id] a),
  :global(h4[id] a),
  :global(h5[id] a),
  :global(h6[id] a) {
    text-decoration: none;
  }

  :global(h2[id]:not([id="table-of-contents"]) a::after),
  :global(h3[id] a::after),
  :global(h4[id] a::after),
  :global(h5[id] a::after),
  :global(h6[id] a::after) {
    content: "§";
    margin-right: 0.2em;
  }

  :global([id="table-of-contents"] + ul li p) {
    margin: 0;
  }

</style>
