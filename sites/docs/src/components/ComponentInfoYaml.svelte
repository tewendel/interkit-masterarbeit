<script>

  import { onMount } from 'svelte'

  export let component; // example: "AppBase"
  let yaml;
  let extraProps;
  let allFields = [];
  
  onMount(async ()=>{
    import(`../../../../packages/interkit/components/${component}.yaml`).then((result)=>{
      yaml = result.default
      console.log(yaml)
      extraProps = yaml?.fields?.find(f => f.type == "extraProps")
      console.log(extraProps)
      allFields = [...yaml.fields, ...extraProps.props]
      console.log(allFields)

    })
  })

</script>

{#if yaml}
<h4>Settings</h4>
<table>
  <tr>
    <th>name</th>
    <th>type</th>
    <th>help</th>
    <th>defaultValue</th>
  </tr>
  {#each allFields as field}
    {#if field.type != "extraProps"}
      <tr>  
          <td>{field.name}</td>
          <td>{field.type}</td>
          <td>{field.help || ""}</td>
          <td>{field.defaultValue || ""}</td>
      </tr>
    {/if}
  {/each}
</table>

{/if}

