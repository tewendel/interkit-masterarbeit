<script>
  import { createEventDispatcher } from "svelte";

  import {
    Accordion,
    AccordionItem,
    ButtonSet,
    Button,
    TreeView,
  } from "carbon-components-svelte";
  import {
    PaintBrush
  } from "carbon-icons-svelte";
  import Help from "carbon-icons-svelte/lib/Help.svelte";
  import { docsGo } from "../docs.js";
  import {
    projectId,
    currentProject,
    previewOverrideStyleTokens,
    currentProjectReadOnly,
  } from "../admin.js";

  export let contentMain;
  export let themeSlug;
  export let themesStore;

  const dispatch = createEventDispatcher();

  const referenceHelp = () => {
    docsGo(`/reference/components/BlocklySubtree`);
  };

  const navigate = (obj) => {
    contentMain = obj.view;
    themeSlug = obj.themeSlug;
  };

  $: sortedThemes = $themesStore ? $themesStore.sort((a,b)=> ((a?.meta?.name > b?.meta?.name ? 1 : -1))) : []
  $: starterThemes = sortedThemes.filter((theme) => theme.meta.starter)
  $: predefinedThemes = sortedThemes.filter((theme) => !theme.meta.starter)

</script>

<div class="design-sidebar-container">
  
  <ButtonSet stacked>
    <Button
      kind="ghost"
      iconDescription="refresh"
      size="small"
      style="color: black; width: 100%; font-weight:500; {contentMain == 'style'
        ? 'background-color:lightgrey'
        : ''}"
      on:click={() => navigate({ view: "style" })}
    >
      Base Design
    </Button>
  </ButtonSet>

  <Accordion size="sm">
    <AccordionItem>
      <svelte:fragment slot="title">
        <span style="font-weight:500"> Predefined Themes </span>
      </svelte:fragment>
      <ButtonSet stacked>
        {#if predefinedThemes.length > 0}
          {#each predefinedThemes as theme}
            <Button
              kind="ghost"
              size="small"
              style="color: black; width: 100%"
              on:click={() =>
                navigate({ view: "theme", themeSlug: theme.slug })}
            >
              {theme.meta.name}
            </Button>
          {/each}
        {/if}
      </ButtonSet>
      <h6>
        Starters
      </h6>
      <ButtonSet stacked>
        {#if starterThemes.length > 0}
          {#each starterThemes as theme}
            <Button
              kind="ghost"
              size="small"
              style="color: black; width: 100%"
              on:click={() =>
                navigate({ view: "theme", themeSlug: theme.slug })}
            >
              {theme.meta.name}
            </Button>
          {/each}
        {/if}
      </ButtonSet>
    </AccordionItem>
  </Accordion>

  <Button
    kind="ghost"
    size="small"
    style="color: black; width: 100%; font-weight:500; {contentMain ==
    'installedTheme'
      ? 'background-color:lightgrey'
      : ''}"
    on:click={() => navigate({ view: "installedTheme" })}
  >
    Installed Theme 
    {#if $currentProject?.uiState?.installedTheme}
      <PaintBrush />
    {/if}
  </Button>
  
</div>

<style lang="scss">
  h6 {
    padding: 16px 16px 8px 16px;
  }
</style>
