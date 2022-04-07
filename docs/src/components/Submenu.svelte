<script>
  export let items
</script>

<details open>
  <summary>
    Guides
  </summary>
  <ul>
    {#each items as item}
    <li>
      <a href="{item.path}">{item.title}</a>
    </li>
    {/each}
  </ul>
</details>