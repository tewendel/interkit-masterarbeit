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

<Sidebar items={data.items} />

<slot></slot>