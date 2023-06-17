<script>
  import InterkitComponentFrame from './InterkitComponentFrame.svelte'
  
  import { InlineLoading } from "carbon-components-svelte";

  export let currentStyleTokens = null

  const components = [
    {name: "DataCardSmall", showDummyData: true},
    {name: "DataCardLarge", showDummyData: true},
    {name: "Button", showDummyData: true, props: {size: "large", type: "primary", text: "Button primary"}},
    {name: "Button", showDummyData: true, props: {size: "large", type: "secondary", text: "Button secondary"}},
    {name: "Button", showDummyData: true, props: {size: "large", type: "link", text: "Button link"}},
    {name: "Button", showDummyData: true, props: {size: "medium", type: "primary", text: "Button primary"}},
    {name: "Button", showDummyData: true, props: {size: "medium", type: "secondary", text: "Button secondary"}},
    {name: "Button", showDummyData: true, props: {size: "medium", type: "link", text: "Button link"}},
    {name: "Button", showDummyData: true, props: {size: "small", type: "primary", text: "Button primary"}},
    {name: "Button", showDummyData: true, props: {size: "small", type: "secondary", text: "Button secondary"}},
    {name: "Button", showDummyData: true, props: {size: "small", type: "link", text: "Button link"}},
    {name: "StaticText"},
    //{name: "Icon", showDummyData: true},
    {name: "MapSimple", showDummyData: true, props: {
        tileLayer: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        height: "40vh"
      }
    },
  ]
</script>

{#each components as c}
  <div class="component">
    
      {#await import(`../../../packages/interkit/components/${c.name}.svelte`)}
        <p class="Loading">
          <InlineLoading description="Loading &lt;{c.name}&gt;" />
        </p>
      {:then component}
        <InterkitComponentFrame name={c.name} showDummyData={c.showDummyData} styleTokens={currentStyleTokens}>
          <svelte:component this={component.default} withDummyData {...c.props} />
        </InterkitComponentFrame>
      {:catch error}
        <p style="color: red">{error.message}</p>
      {/await}
    
  </div>
{/each}

<style lang="scss">
  @use '@carbon/type';

  .component {
    margin: .5rem 0 1rem 0;
  }

  .loading {
    @include type.type-style('label-01');
    padding-bottom: 1rem;
  }
  
</style>