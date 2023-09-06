<script>

  import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Select,
    SelectItem,
    TextInput,
    Row, Column
  } from "carbon-components-svelte"

  export let value = {
    objectFit: 'auto',
    backgroundColor: 'transparent'
  }

  export let submit
  export let close

  let options = ['auto', 'cover', 'contain', 'passepartout']

  // if value was just instantiated set it to first option
  // if(typeof value == "object" && options.length) value.objectFit = options[0]

</script>

<ComposedModal open
  on:submit={submit}
  on:close={close}
>
  <ModalHeader title="Object Fit" />
  <ModalBody hasForm>
    <dl>
      <dt>auto</dt>
      <dd>Leave it up to the component. Recommended, unless you know what you're doing.</dd>
      <dt>cover</dt>
      <dd>Will cover the frame, usually cropping the image.</dd>
      <dt>contain</dt>
      <dd>Will make sure the image is visible, but will leave visible gaps/bars (letter box) left and right, or top and bottom, respectively. You can style the color of those bars or leave them transparent. The image might still be slightly cropped by rounded corners.</dd>
      <dt>passepartout</dt>
      <dd>Like <i>contain</i>, but will leave bars *all around* the image. For style reasons or to avoid it being cropped by rounded corners.</dd>
    </dl>
    <FormGroup>
      <Select bind:selected={value.objectFit}>
        {#each options as option}
          <SelectItem
            value={option}
            text={option}
            />
        {/each}
      </Select>
    </FormGroup>
    <FormGroup>
      <Row style="margin-top: 1em">
        <Column>
          <TextInput
            labelText="Background color"
            bind:value={value.backgroundColor}
            helperText="Visible with passepartout, usually visible with contain. Use the color picker, or enter a CSS value, like 'var(--foo))', 'red', or 'transparent'."
            />
        </Column>
        <Column>
          <input type="color" bind:value={value.backgroundColor} />
        </Column>
      </Row>
    </FormGroup>
  </ModalBody>
  <ModalFooter primaryButtonText="Save" secondaryButtonText="Cancel" />
</ComposedModal>

<style>

dl {
  margin: 1em 0;
}

dt {
  font-weight: bold;
}

dd {
  padding-left: 1em;
}

dd:not(:last-child) {
  margin-bottom: 1em;
}

</style>
