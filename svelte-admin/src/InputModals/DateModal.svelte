<script>

  import { InterkitClient } from 'interkit'
  import dayjs from 'dayjs'

  import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Select, SelectItem, FormGroup
  } from "carbon-components-svelte";

  import { onMount } from 'svelte'

  export let value = {};
  export let submit;
  export let close;
  export let projectId;
  export let params;

  const format = 'YYYY-MM-DDTHH:mm'
  let internal

  const input = (x) => (internal = dayjs(x).format(format))
  const output = (x) => (value = dayjs(x, format).toDate())

  $: input(value)
  $: output(internal)

</script>

<ComposedModal open
  on:submit={submit}
  on:close={close}
>
  <ModalHeader label="{value.key}" title="Update Column" />
  <ModalBody>
    Local time: <input type="datetime-local" bind:value={internal} />
    <br />
    Absolute time: { value }
  </ModalBody>
  <ModalFooter primaryButtonText="Save" secondaryButtonText="Cancel" />
</ComposedModal>

<style>
  
</style>