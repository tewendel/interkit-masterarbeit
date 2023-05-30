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
      allFields = [
        ...(yaml?.fields ? yaml.fields : []),
        ...(extraProps?.props ? extraProps.props : [])
      ]
      console.log(allFields)

    }).catch(e=>{
      console.error(e)
    })
  })

</script>

{#if yaml}
<h4>Settings</h4>
<table>
  <tr>
    <th>name</th>
    <th>type</th>
    <!--<th>help</th>-->
    <th>defaultValue</th>
  </tr>
  {#each allFields as field}
    {#if field.type != "extraProps"}
      <tr data-type={field.type} data-name={field.name}>
          <td class="name">{field.name}</td>
          <td class="type">{field.type}</td>
          <td class="default">{field.defaultValue || ""}</td>
      </tr>
      {#if field.help}
        <tr class="help">
          <td colspan="3">
            {field.help}
          </td>
        </tr>
      {/if}
    {/if}
  {/each}
</table>

{/if}

<style>
  .help {
    font-size: 80%;
  }
  .help td:first-child {
    padding-left: 1em;
  }
  [data-type="slot"][data-name="default"] .name {
    color: #ddd;
  }
</style>
