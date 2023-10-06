<script>
  import { page } from '$app/stores';

  export let items
  export let title
  export let path
  export let open = false
  
  $: currentPath = $page.url.pathname

  $: {
    if(title == "Components") {
      items.sort(function(a, b) {
        var textA = a.title.toUpperCase();
        var textB = b.title.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
    }
  }
  

</script>

<details open={open || currentPath?.includes(path)}>
  <summary>
    {title}
  </summary>
  <ul>
    {#each items as item}
      <li>
        <a href="{item.path}" class:active={currentPath == item.path}>
          {item.title}
        </a>
      </li>
    {/each}
  </ul>
</details>

<style>
  ul {
    padding-left: 0;
  }

  li {
    list-style-type: none;
    line-height: 1.1;
  }


  a, a:visited {
    display: block;
    padding: .2em .2em;
    margin-left: -.2em;
    border-radius: .2em;
    text-decoration: none;
    color: #00a;
  }

  a:hover {
    background-color: #fff9;
  }
  a.active {
    font-weight: bold;
  }
  summary {
    font-weight: bold;
    font-size: 110%;
    cursor: pointer;
  }

</style>