<script>
  import definitions from "../../../../packages/interkit/components/styleTokensConfig.json";
</script>

<table>
  <tr>
    <th>key</th>
    <th>type</th>
    <th>info</th>
  </tr>
  {#each definitions as { key, type, help } }
    <tr>
      <td>{key}</td>
      <td>{type}</td>
      <td>{help}</td>
    </tr>
  {/each}
</table>