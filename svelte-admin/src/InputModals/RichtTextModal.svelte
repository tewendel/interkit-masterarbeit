
<script>

  import { InterkitClient } from 'interkit'
  import marked from "marked"

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

  import { onMount } from 'svelte'

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
        <TabContent style="height: 400px">
          <TextArea style="height: 350px" bind:value={value} />
          <p style="margin-top: 5px">You can use markdown to format your text. <a href="https://www.markdownguide.org/basic-syntax/" target="_blank">More information</a></p>
        </TabContent>
        <TabContent style="height: 400px">
          {@html marked(value)}
        </TabContent>
      </div>
    </Tabs>
  </ModalBody>
  <ModalFooter primaryButtonText="Save"/>
</ComposedModal>

