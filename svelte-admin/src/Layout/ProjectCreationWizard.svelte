<script>
  import { push } from 'svelte-spa-router';
  import { InterkitClient } from 'interkit'
  import { bundleServerURL$ } from '../BundleServer.js'
  import { 
    Grid,
    Row,
    Column,
    Button,
    ButtonSet,
    TextInput,
    Form,
    FormGroup,
    InlineLoading,
    RadioTile,
    TileGroup,
    ProgressIndicator,
    ProgressStep,
    ImageLoader
  } from "carbon-components-svelte";
  import WatsonHealthThumbnailPreview from 'carbon-icons-svelte/lib/WatsonHealthThumbnailPreview.svelte'

  export let createProjectStep
  export let templates
  export let createProjectEmptyTemplate
  export let previewProject

  const userIsRole = InterkitClient.userIsRole
  const bundleServerURL = bundleServerURL$
    
  let createProjectVariant
  
  let createProjectTemplateSlug

  $: console.log("createProjectTemplateSlug", createProjectTemplateSlug)
  $: createProjectTemplate = templates.find(t => t.slug == createProjectTemplateSlug)
  $: console.log("createProjectTemplate", createProjectTemplate)

  let createProjectGitRepo
  let createProjectName
  let createProjectInitializing = false
  
  const createProject = async () => {
    let newProjectId
    switch (createProjectVariant) {
      case 'Template':
        newProjectId = await InterkitClient.call("project.duplicate", {
          projectId: createProjectTemplate.id,
          newProjectName: createProjectName
        })
        break
      case 'Empty':
        if (createProjectEmptyTemplate) {
          newProjectId = await InterkitClient.call("project.duplicate", {
            projectId: createProjectEmptyTemplate.id,
            newProjectName: createProjectName
          })
        } else {
          newProjectId = await InterkitClient.call("project.create", {
            name: createProjectName
          })
        }
        break
      case 'Import':
        newProjectId = await InterkitClient.call("project.create", {
          name: createProjectName,
          gitRepository: createProjectGitRepo
        })
    }
    if (!newProjectId) {
      createProjectStep = false
      window.alert('Something might have gone wrong. Please check the project list.')
    } else {
      createProjectInitializing = true
      setTimeout(() => {
        createProjectInitializing = false
        push('/project/' + newProjectId)
        createProjectStep = false
      }, 6000)
    }
  }

</script>


<Grid>
  <Row padding style="max-height: var(--createwizard-header-height); overflow: hidden">
    <Column>
      <h2 class="createwizard-heading">Create new project</h2>
    </Column>
  </Row>
  <Row padding>
    <!-- FIXME this won't scroll if there is too many templates -->
    <Column sm={3} md={5} style="max-height: calc(100vh - var(--header-height) - var(--createwizard-header-height)); overflow-y: auto">
      {#if createProjectStep === 0}
        <TileGroup
          legend="Pick a variant to continue."
          bind:selected={createProjectVariant}
          >
          <RadioTile value="Template" disabled={!templates || !templates.length}>
            <h3>Template</h3>
            {#if !templates || !templates.length}
              <p>Error: No templates found!</p>
              {#if $userIsRole?.admin}
                <p>
                  As an admin, you can turn projects into templates.<br/>
                  Go back (cancel), and use a project's &#8942; menu.
                </p>
              {:else}
                <p>Please ask your admin!</p>
              {/if}
            {:else}
              <p>
                Start by using a template.<br/>
              </p>
            {/if}
          </RadioTile>
          <RadioTile value="Empty">
            <h3>Empty</h3>
            <p>Start with an empty project.</p>
          </RadioTile>
          <RadioTile value="Import">
            <h3>Import</h3>
            <p>Upload a project file or use a repository from Github/Gitlab.</p>
          </RadioTile>
        </TileGroup>
      {:else if createProjectStep === 1 && createProjectVariant === 'Template'}
        {#if !templates || !templates.length}
          <p>No templates found!</p>
        {/if}
        <TileGroup
          bind:selected={createProjectTemplateSlug}
          legend="Click on a template title to select it."
          >
          {#each templates as template}
            <RadioTile value={template.slug}>
              <h3 style="margin-bottom: 1rem">{template.name}</h3>
              {#if template.uiState?.metafile?.description?.html}
                <div style="margin: 1rem 0">
                  {@html template.uiState.metafile.description.html}
                </div>
              {/if}
              <!--
              {#if template.createdAt}
                <p style="margin-bottom: 1rem">{template.createdAt
                  .toLocaleDateString('de-DE', { year: 'numeric', month: 'short', day: 'numeric' })
                }</p>
              {/if}
              -->
              <ImageLoader
                src={`${$bundleServerURL}/app/${template.id}/screenshot.png`}
                alt="Screenshot"
                fadeIn
                style="width: 100%; height: auto"
                >
                <svelte:fragment slot="error">
                  <!--
                  (This template does not provide a <code>screenshot.png</code>
                  in its <code>/public</code> directory.)
                  -->
                </svelte:fragment>
              </ImageLoader>
              <div style="text-align: right; margin-top: 1em;">
                <ButtonSet style="justify-content: end">
                  <!--{#if template.uiState?.metafile?.project?.html}
                    <Button
                      kind="tertiary"
                      icon={Help}
                      on:click={() => infoProject(template, 'project')}
                      disabled={!template.uiState?.metafile?.project?.html}
                      >Info</Button>
                  {/if}-->
                  <Button
                    kind="tertiary"
                    icon={WatsonHealthThumbnailPreview}
                    on:click={() => previewProject(template.id)}
                    >Preview</Button>
                  <!--
                  <Button
                    kind="secondary"
                    on:click={() => { createProjectTemplate = template }}
                    >Select</Button>
                  -->
                </ButtonSet>
              </div>
            </RadioTile>
          {/each}
        </TileGroup>
      {:else if createProjectStep === 1 && createProjectVariant === 'Empty'}
        <!-- we need this weird empty step because otherwise the ProgressIndicator
          got irrationally confused, also skipping the step -->
        <p style="margin-bottom: 1em">
          We don't need a template for an empty project.<br/>
          You can skip this step.
        </p>
        <p>
          Technical note for advanced users:<br />
          {#if createProjectEmptyTemplate}
            The new project will be a clone of the empty template with
            id={createProjectEmptyTemplate.id}
          {:else}
            The new project will be based on a starter template.
          {/if}
        </p>
      {:else if createProjectStep === 1 && createProjectVariant === 'Import'}
        <p>
          Make sure to use the URL that ends in <code>.git</code>!
        </p>
        <Form>
          <FormGroup>
            <TextInput 
              bind:value={createProjectGitRepo} 
              label="Public Git Repository"
              placeholder="https://gitlab.interkit.app/interkit-project-templates/hello-world.git"
            />
          </FormGroup>
        </Form>
      {:else if createProjectStep === 2}
        <p>Pick a name for the new project</p>
        <TextInput
          labelText="Project name"
          placeholder="Enter text"
          bind:value={createProjectName}
          />
      {/if}
    </Column>
    <Column sm={1} md={3}>
      <ProgressIndicator
        style="margin-bottom: auto"
        bind:currentIndex={createProjectStep}
        vertical
        preventChangeOnClick
        >
        {#each ['Variant', 'Template', 'Name'] as stepLabel, stepIndex}
          <ProgressStep
            complete={createProjectStep > stepIndex}
            current={createProjectStep === stepIndex}
            label={stepLabel}
            />
        {/each}
      </ProgressIndicator>
      <ButtonSet style="margin-top: 6em">
      {#if createProjectStep === 0}
        <Button
          kind="secondary"
          on:click={() => { createProjectStep = false}}
          >Cancel</Button>
        <Button
          disabled={!createProjectVariant}
          on:click={() => {
            createProjectStep = 1
            // this messes up the indicator, unfortunately
            // if (createProjectVariant === 'Empty') createProjectStep++
          }}
          >Continue</Button>
      {:else if createProjectStep === 1}
        <Button
          kind="secondary"
          on:click={() => { createProjectStep = 0}}
          >Back</Button>
        <Button
          disabled={
            (createProjectVariant === 'Template' && !createProjectTemplate) ||
            (createProjectVariant === 'Import' && !createProjectGitRepo)
          }
          on:click={() => { createProjectStep = 2 }}
          >Continue</Button>
      {:else if createProjectStep === 2}
        <Button
          kind="secondary"
          on:click={() => { createProjectStep = 1}}
          >Back</Button>
        <Button
          disabled={!createProjectName || createProjectInitializing}
          on:click={() => createProject() }
          >
          {#if createProjectInitializing}
            <InlineLoading
              status="active"
              size="sm"
              /> Initializing
          {:else}
            Finish
          {/if}
        </Button>
      {/if}
      </ButtonSet>
    </Column>
  </Row>
</Grid>