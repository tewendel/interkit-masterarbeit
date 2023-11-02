<script>

  import { createEventDispatcher } from 'svelte'

  import { Accordion, AccordionItem, ButtonSet, Button } from "carbon-components-svelte"; 
  import Help from "carbon-icons-svelte/lib/Help.svelte";
  import { docsGo } from '../docs.js'
  import { projectId, currentProject, previewOverrideStyleTokens, currentProjectReadOnly } from '../admin.js'

  export let contentMain
  export let themeSlug
  export let themesStore

  const dispatch = createEventDispatcher()

  const referenceHelp = () => {
    docsGo(`/reference/components/BlocklySubtree`)
  }

  const navigate = (obj) => {
    contentMain = obj.view
    themeSlug = obj.themeSlug
  }
  

  /*
  let activeBlockPreview;

  let openCategory = null;
  const manageAccordeonOpen = (category) => {
    activeBlockPreview = null;
    // without timeout, AccordeonItem snaps back
    setTimeout(()=> {
      openCategory = category.text
    }, 10)
  }*/
  
</script>



  <div class="design-sidebar-container">
    
    <ButtonSet stacked>
      <Button
        kind="ghost"
        iconDescription="refresh"
        size="small"
        style="color: black; width: 100%; font-weight:500; {contentMain == "style" ? "background-color:lightgrey" : "" }"
        on:click={() => navigate({view: "style"})}
        >
        Styles
      </Button>

    </ButtonSet>

    <Accordion size="sm">
      <AccordionItem 
      >
      <svelte:fragment slot="title">
        <span style="font-weight:500">
          Predefined Skins
        </span>
      </svelte:fragment>
      <ButtonSet stacked>
        {#if $themesStore}
          {#each $themesStore as theme}
            <Button
              kind="ghost"
              size="small"
              style="color: black; width: 100%"
              on:click={() => navigate({view: "theme", themeSlug: theme.slug })}
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
            style="color: black; width: 100%; font-weight:500; {contentMain == "installedTheme" ? "background-color:lightgrey" : "" }"
            on:click={() => navigate({view: "installedTheme" })}
          >
            Skin
          </Button>
  
  </div>


  
<style>
  .blockly-picker-container {
    padding: 5px;
  }
</style>

