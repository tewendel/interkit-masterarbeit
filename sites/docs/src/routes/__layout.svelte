<script context="module">
  export async function load({ params, fetch, session, stuff }) {
    const url = `/sidebar.json`;
    const response = await fetch(url);

    return {
      status: response.status,
      props: {
        data: response.ok && (await response.json())
      }
    };
  }
</script>

<script>
  import Sidebar from "../components/Sidebar.svelte";
  
  export let data;

  //console.log("data", data);

  //const items = {guides:[], theory:[]} // props.items

  
</script>

<div class="container">
  <header class="header">
    <h1>
      Interkit docs
    </h1>
  </header>
  <nav class="sidebar">
    <Sidebar items={data.items} />
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
    grid-column-gap: 1rem;
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