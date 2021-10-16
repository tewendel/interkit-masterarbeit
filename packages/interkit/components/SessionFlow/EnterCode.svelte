<script>
  import { InterkitClient } from '../../index'
  import {executeTrigger} from '../../actions'
  import DynamicContent from '../DynamicContent.svelte'
  import Button from '../Button.svelte'
  import Input from '../Input.svelte'
  import Modal from '../Modal.svelte'

  export let setStep = function(){}
  export let restoredTrigger
  export let keyColumn
  export let contentColumn

  let code = ""

  let modalText
  let modalDismissText = "Verstanden"
  let dismissModalFunction

  const send = async event => {
    const result = await InterkitClient.loginTokenUser({userToken: code})
    if (result.id) {
      modalText = "session.entercode.modal.success"
      dismissModalFunction = event => {
        modalText = null
      }
    } else {
      modalText = "session.entercode.modal.tryagain"
      dismissModalFunction = event => {
        modalText = null
        executeTrigger(restoredTrigger)
      }
    }
  }

</script>

<div class="container">
  <DynamicContent
    {keyColumn}
    {contentColumn}
    contentKey="session.entercode.intro"
    defaultContent="## Session-ID eingeben"
    type="richText"
  />
  <div class="buttons">
    <Input type="text" placeholder="Session-ID" bind:value={code} />
    <Button on:click={send}>
      <div class="container">
      <DynamicContent
        {keyColumn}
        {contentColumn}
        contentKey="session.entercode.enter.button"
        defaultContent="Bestätigen"
        inline
      />
    </Button>
  </div>
  <DynamicContent
    {keyColumn}
    {contentColumn}
    contentKey="session.entercode.enter.info"
    defaultContent="Die Session-ID kannst du in den Browser, dessen Spielstand du übertragen willst, im Menü sehen"
    inline
  />
  <Button type="tertiary" on:click={()=>setStep("start")}>
    <DynamicContent
      {keyColumn}
      {contentColumn}
      contentKey="session.entercode.cancel.button"
      defaultContent="Abbrechen"
      inline
    />
  </Button>
  <DynamicContent
    {keyColumn}
    {contentColumn}
    contentKey="session.entercode.cancel.info"
    defaultContent="Ich finde meine Session-ID nicht"
    inline
  />
</div>

{#if modalText}
  <DynamicContent
    {keyColumn}
    {contentColumn}
    contentKey="session.entercode.modal.confirm"
    defaultContent="Verstanden"
    let:content={modalDismissText}
  >
    <Modal dismissText={modalDismissText} dismissFunction={dismissModalFunction}>
      <DynamicContent
        {keyColumn}
        {contentColumn}
        contentKey={modalText}
        defaultContent={modalText}
        type="richText"
      />
    </Modal>
  </DynamicContent>
{/if}

<style>
  .container, .buttons {
    display: flex;
    flex-direction: column;
  }
</style>