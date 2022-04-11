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
          {item.filename}
        </a>
      </li>
    {/each}
  </ul>
</details>