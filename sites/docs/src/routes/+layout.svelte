<script>

  import { onMount } from 'svelte'

  import Sidebar from "../components/Sidebar.svelte"
  import Breadcrumbs from "../components/Breadcrumbs.svelte"
  import Topbar from "../components/Topbar.svelte"
  import Links from "../components/Links.svelte"
  import { items } from "../content/structure.json.js"

  import {
    setupHistory,
    isIframed,
    routerHistoryBack,
    routerHistoryForward,
    routerCanForward,
    routerCanBack
  } from "$lib/iframed.js"

  import 'prismjs/themes/prism.css'

  //export const prerender = true;

  let sidebarEl

  setupHistory()

  let showMenu = false

  let bodyEl
  // no global document in svelteKit
  onMount(() => { bodyEl = document.body })
  $: bodyEl?.classList.toggle('body--menu-open', showMenu)

</script>

<div class="container" class:container__iframed={isIframed}>
  <header class="header">
    <h1 class="header-icon">
      <a
        href="/"
        style="text-decoration: none;"
        on:click={() => { showMenu = false }}
        >
        <!-- FIXME: embedded svg had weird padding, should be redone.
          temporary hack: viewBox adjusted, original: 0 0 44 66 -->
        <svg class="logo" viewBox="3 3 41 43" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!--  preserveAspectRatio="xMidYMax meet"-->
          <rect x="3.04731" y="3.04731" width="39.4629" height="41.9053" rx="12.1474" fill="#32332E"></rect><rect x="10.4387" y="19.9509" width="4.24194" height="19.0244" fill="#9F8CBD"></rect><circle cx="12.5596" cy="12.5596" r="3.53495" fill="#F1BB41"></circle><path d="M18.7937 23.9998L36.5327 9.02445L36.5327 38.9751L18.7937 23.9998Z" fill="#D9A7B1"></path><rect x="3.04731" y="3.04731" width="39.4629" height="41.9053" rx="12.1474" stroke="#32332E" stroke-width="0.385631"></rect></svg>
        <span class="sr-only">Interkit</span>
      </a>
    </h1>
    <ul class="header-links header-links--maintabs">
      <Topbar {items} />
    </ul>
    <div class="header-search">
      <input class="search-input" type="search" placeholder="Search" />
    </div>
    <ul class="header-links">
      <Links classes="header-links" />
    </ul>
    <div class="header-toggle">
      <button
        class="header-toggle-button"
        class:header-toggle-button--open={showMenu}
        on:click={() => { showMenu = !showMenu }}
        >
        { showMenu ? 'Close' : 'Menu' }
      </button>
    </div>
  </header>
  <main class="main">
    <div class="breadcrumbs">
      <Breadcrumbs {items} />
    </div>
    <div class="main-content">
      <slot></slot>
    </div>
  </main>
  <nav
    class="sidebar"
    bind:this={sidebarEl}
    style={showMenu ? 'display: block' : ''}
    >
    <div class="sidebar-search">
      <input class="search-input" type="search" placeholder="Search" />
    </div>
    <Sidebar
      {items}
      on:clicked={() => { showMenu = false }}
      >
      <ul class="sidebar-links">
        <Links />
      </ul>
    </Sidebar>
  </nav>
</div>

<style>

  :root {
    --header-height: 4rem;
  }

  :global(body.body--menu-open) {
    overflow-y: hidden;
  }

  @media (min-width: 1000px) {
    .container {
      display: grid;
      height: 100vh;
      grid-template-columns: 15rem 1fr;
      grid-template-rows: auto 1fr;
      grid-template-areas:
        "head head"
        "nav  main";
    }
  }

  .header {
    grid-area: head;
    display: flex;
    gap: 1rem;
    height: var(--header-height);
    border-bottom: var(--border-light);
    padding-left: 1rem;
    padding-right: 1rem;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: white;
  }

  @media (min-width: 1000px) {
    .header {
      position: static;
    }
  }

  .header,
  .sidebar,
  .header :global(*),
  .sidebar :global(*) {
    box-sizing: border-box;
  }

  .header :global(ul) {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .header :global(li) {
    margin: 0;
    padding: 0;
  }

  .header h1,
  .header-icon a,
  .header-icon svg {
    margin: 0;
    padding: 0;
    display: block; /* prevent inline whitespace overhangs */
  }

  .header-icon a {
    height: 100%;
  }

  .header-icon svg {
    width: 38px;
    height: 100%; /* svg will nicely vertica-align to middle */
  }

  .header-links {
    display: none;
  }

  @media (min-width: 1000px) {
    .header-links {
      display: flex;
    }
  }

  .header-links :global(li a) {
    display: block;
    height: 100%;
    line-height: var(--header-height);
    padding-left: 1em;
    padding-right: 1em;
    text-decoration: none;
    color: var(--color-text-light);
  }

  .header-links :global(li a:hover) {
    background-color: var(--color-linkbutton-hover);
  }

  .header-links :global(li.active a) {
    color: var(--color-accent);
    font-weight: var(--font-weight-bold);
    border-bottom: 4px solid var(--color-accent);
  }

  .header button,
  .header input[type="search"],
  .sidebar input[type="search"] {
    font-family: inherit;
    font-size: inherit;
    border: var(--border-light);
    padding: 0.5em 0.5em 0.5em 2em;
    color: var(--color-text-light);
  }

  .sidebar input[type="search"]:focus,
  .header input[type="search"]:focus {
    outline: 0;
    border: var(--border-accent);
  }

  .sidebar input[type="search"],
  .header input[type="search"] {
    border-radius: 10em; /* very high value just makes them "pill-circular" */
  }

  .header button {
    border-radius: var(--radius-button);
    cursor: pointer;
  }

  .header button:focus-visible,
  .header button:hover {
    background-color: var(--color-linkbutton-hover);
  }

  .header-search {
    display: flex;
    align-items: center;
    flex-grow: 1;
  }

  .search-input {
    width: 100%;
    max-width: 16em;
    font-weight: var(--font-weight-bold);
    background-color: var(--color-background-verylight);
    background-repeat: no-repeat;
    background-size: 1em 1em;
    background-position: 0.55em center;
    background-image: url('/images/Search.svg');
  }

  .header-toggle {
    align-items: center;
    display: flex;
  }

  @media (min-width: 1000px) {
    .header-toggle {
      display: none;
    }
  }

  .header-toggle-button {
    background-color: var(--color-background-verylight);
    background-repeat: no-repeat;
    background-size: 1em 1em;
    background-position: 0.55em center;
    background-image: url('/images/Menu.svg');
    width: 5.5em;
  }

  .header button.header-toggle-button--open {
    font-weight: var(--font-weight-bold);
    background-image: url('/images/Close.svg');
    color: var(--color-accent);
    border-color: var(--color-accent);
  }

  .header :global(a[href*="gitlab"]) {
    padding-left: 2.5em;
    background-repeat: no-repeat;
    background-size: 1em 1em;
    background-position: 1em center;
    background-image: url('/images/logo-gitlab.svg');
  }

  .sidebar {
    grid-area: main;
    position: fixed;
    top: var(--header-height);
    bottom: 0;
    left: 0;
    width: 100%;
    background: white;
    z-index: 2;
    display: none;
    border-right: var(--border-light);
  }

  @media (min-width: 1000px) {
    .sidebar {
      grid-area: nav;
      position: static;
      display: flex;
      flex-direction: column;
    }
  }

  .sidebar-search {
    height: var(--header-height);
    display: none;
    align-items: center;
    padding: 0 1rem;
    flex-grow: 0;
    flex-shrink: 0;
  }

  @media (min-width: 1000px) {
    .sidebar-search {
      display: flex;
    }
  }

  .main {
    grid-area: main;
    overflow-y: auto;
    padding-top: var(--header-height);
  }

  @media (min-width: 1000px) {
    .main {
      padding-top: 0;
    }
  }

  .breadcrumbs {
    color: var(--color-text-light);
    background-color: var(--color-background-verylight);
    height: var(--header-height);
    line-height: var(--header-height);
    border-bottom: var(--border-light);
    padding: 0 2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .main-content {
    padding: 0 2rem 2rem 2rem;
  }

  @media screen and (max-width: 600px) {
    .container {
      display: block;
    }
  }

  .history {
    display: flex;
  }

  :global(h2[id]:not([id="table-of-contents"]) a),
  :global(h3[id] a),
  :global(h4[id] a),
  :global(h5[id] a),
  :global(h6[id] a) {
    text-decoration: none;
  }

  :global(h2[id]:not([id="table-of-contents"]) a),
  :global(h3[id] a),
  :global(h4[id] a),
  :global(h5[id] a),
  :global(h6[id] a) {
    height: 10px;
    width: 40px;
    display:inline-block;
    background-image: url('/images/link.svg');
    background-position: center;
    vertical-align: middle;
  }

  :global([id="table-of-contents"] + ul li p) {
    margin: 0;
  }

  :global(td, th) {
    padding: 5px;
  }

</style>
