<script>
  export let currentProject

  const createMessage = (entry) => {
    let output = ""
    if (entry.event === "create_project") {
      output += "Project created"
      if (entry.props.gitRepository) {
        output += " from git repository " + entry.props.gitRepository
      } else if (entry.props.template) {
        output += " from template " + entry.props.template
      } else if (entry.props.sourceProjectId) {
        output += " from project " + entry.props.sourceProjectId
      }
    }
    return output
  }

</script>

{#if $currentProject.history}
  <ul>
    {#each $currentProject.history as history}
      <li>
        {history.date}: 
        <br>
        <strong>
          {createMessage(history)}
        </strong>
      </li>
    {/each}
  </ul>
{/if}

<style>
  li + li {
    border-top: 1px solid #ccc;
  }
</style>