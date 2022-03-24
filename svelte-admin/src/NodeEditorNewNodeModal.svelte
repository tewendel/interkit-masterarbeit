<script>

  import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    TextInput,
    Select, SelectItem, FormGroup
  } from "carbon-components-svelte";

  export let submit
  export let close
  export let templateText
  export let nodeId

  const templates = [
    {
      label: 'basic',
      value: `
export const onArrive = async (api) => {
  // do something when the user arrives
  api.sendText("hello!")
}

export const onMessage = async (msg, api) => {
  // do something when the user sends a message
  api.sendText("thank you for your message")
}
      `
    },
    {
      label: 'respond to text input',
      value: `
export const onArrive = async (api) => {
  // do something when the user arrives
  api.sendText("hello, what's your name?")
}

export const onMessage = async (msg, api) => {
  // respond to message content
  api.sendText("aha, your name is " + msg.payload.text + "!")
}
`
    },
    {
      label: 'branch depending on text input',
      value: `
export const onArrive = async (api) => {
  api.sendText("where do you want to go?")
}

export const onMessage = async (msg, api) => {
  switch(msg.payload.text) {
    case "berlin":
      api.sendText("moving to berlin...")
      api.moveTo("space")
      break;

    case "home":
      api.sendText("going home...")
      api.moveTo("home")
      break;

    default:
      api.sendText("i don't understand. sending you to space...")
      api.moveTo("space")
  }
}
`
    },
    {
      label: 'respond to button',
      value: `
export const onArrive = async (api) => {
  // do something when the user arrives
  api.sendText("hello!")
  api.sendChoice({a: "continue"})
}

export const onMessage = async (msg, api) => {
  // do something when the user clicks continue
  if(msg.payload.key == "a") {
    // change this to determine where the user should move next
    api.moveTo("targetNode")
  }
}
`
},
{
      label: 'branch depending on button input',
      value: `
export const onArrive = async (api) => {
  api.sendText("where do you want to go?")
  api.sendChoice({a: "berlin", b: "home"})
}

export const onMessage = async (msg, api) => {
  switch(msg.payload.key) {
    case "a":
      api.sendText("moving to berlin...")
      api.moveTo("space")
      break;

    case "b":
      api.sendText("going home...")
      api.moveTo("home")
      break;

    default:
      api.sendText("i don't understand. sending you to space...")
      api.moveTo("space")
  }
}
`
    },
 ]

  let selected = templates[0].value

  $: {
    templateText = selected
  }

</script>

<ComposedModal open
  on:submit={submit}
  on:close={close}
>
  <ModalHeader title="Create new node" />
  <ModalBody hasForm>
    <TextInput bind:value={nodeId} inline light labelText="Node name" />
    <FormGroup>
      <Select labelText="Option" bind:selected={selected}>
        {#each templates as template}
          <SelectItem value={template.value} text={template.label} />
        {/each}
      </Select>
    </FormGroup>
  </ModalBody>
  <ModalFooter primaryButtonText="Create" secondaryButtonText="Cancel" />
</ComposedModal>
