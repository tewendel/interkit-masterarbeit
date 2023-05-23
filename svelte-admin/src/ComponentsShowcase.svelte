<script>
  import InterkitComponentFrame from './InterkitComponentFrame.svelte'
  import Styling from '../../packages/interkit/components/Styling.svelte'

  const components = [
    {name: "DataElementSmall", showDummyData: true},
    {name: "DataElementSmall", showDummyData: false},
    {name: "DataElementLarge"},
    {name: "StaticText"},
    //{name: "MapSimple"},
  ]
</script>

<Styling>
  {#each components as component}
    <div class="component">
      <InterkitComponentFrame name={component.name} showDummyData={component.showDummyData} >
        {#await import(`../../packages/interkit/components/${component.name}.svelte`)}
          <p>loading...</p>
        {:then component}
          <svelte:component this={component.default} withDummyData />
        {/await}
      </InterkitComponentFrame>
    </div>
  {/each}
</Styling>

<style>
  .component {
    margin: 10px;
  }
</style>