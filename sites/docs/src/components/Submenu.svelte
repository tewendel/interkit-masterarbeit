<script>
  export let items
  export let title
</script>

<details open>
  <summary>
    {title}
  </summary>
  <ul>
    {#each items as item}
      <li>
        <a href="{item.path}">
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

  summary {
    font-weight: bold;
    font-size: 110%;
    cursor: pointer;
  }

</style>