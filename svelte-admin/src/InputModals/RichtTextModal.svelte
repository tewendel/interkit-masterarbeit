
<script>

  import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    TextArea,
    Tabs, 
    Tab, 
    TabContent
  } from "carbon-components-svelte";

  import { currentProjectReadOnly } from "../admin";
  import Markdown from "../Atoms/Markdown.svelte";

  export let value = "";
  export let submit;
  export let close;
  export let params;
  export let projectId;

</script>

<ComposedModal open
  on:submit={submit}
  on:close={close}
>
  <ModalHeader label="{value.key}" title="Update Column {params?.currentColumn?.name}" />
  <ModalBody hasForm>
    <Tabs>
      <Tab label="edit" />
      <Tab label="view" />
      <div slot="content">
        <TabContent style="height: 50dvh;">
          <div class="edit">
            <TextArea disabled={$currentProjectReadOnly} style="height: 40dvh" bind:value={value} />
            <p style="margin-top: 5px">You can use markdown to format your text. <a href="https://www.markdownguide.org/basic-syntax/" target="_blank">More information</a></p>
          </div>
        </TabContent>
        <TabContent style="height: 50dvh">
          <div class="preview">
            <Markdown source={value} />
          </div>
        </TabContent>
      </div>
    </Tabs>
  </ModalBody>
  <ModalFooter primaryButtonText="Save" secondaryButtonText="Cancel" primaryButtonDisabled={$currentProjectReadOnly}/>
</ComposedModal>

<style>
  .edit, .preview {
    display:flex; 
    flex-direction: column;
    height: 100%;
  }
  .preview {
    padding: 1em;
    background-color: white;
    overflow: auto;
    height: 100%;
  }
</style>