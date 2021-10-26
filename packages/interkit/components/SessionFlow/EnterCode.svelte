<script>
  import { InterkitClient } from '../../index'
  import {executeTrigger} from '../../actions'
  import DynamicContent from '../DynamicContent.svelte'
  import Button from '../Button.svelte'
  import Input from '../Input.svelte'
  import Modal from '../Modal.svelte'
  import ButtonPanel from '../ButtonPanel.svelte'

  export let setStep = function(){}
  export let restoredTrigger
  export let keyColumn
  export let contentColumn

  let code = ""

  let modalText
  let dismissModalFunction

  const send = async event => {
    const result = await InterkitClient.loginTokenUser({userToken: code})
    executeTrigger(restoredTrigger)
    //console.log(result)
    if (result.id) {
      modalText = "session.entercode.modal.success"
      dismissModalFunction = event => {
        modalText = null
        executeTrigger(restoredTrigger)
      }
    } else {
      modalText = "session.entercode.modal.tryagain"
      dismissModalFunction = event => {
        modalText = null
      }
    }
  }

  const columns = {
    keyColumn,
    contentColumn
  }

</script>

<div class="container">
  <div class="content">
    <DynamicContent
      {...columns}
      contentKey="session.entercode.intro"
      defaultContent="## Session-ID eingeben"
      type="richText"
    />
  </div>
  
  <div class="form">
    <ButtonPanel style="margin-bottom: calc( -1 * var(--distance-s) )">
      <Input type="text" flex="fill" fieldSize="large" placeholder="Session-ID" bind:value={code} />
    </ButtonPanel>

    <ButtonPanel>
      <Button flex="fill" type="large" on:click={send}>
        <DynamicContent
          {keyColumn}
          {contentColumn}
          contentKey="session.entercode.enter.button"
          defaultContent="Bestätigen"
          inline
        />
      </Button>
    </ButtonPanel>
  </div>

  <div class="content">
    <DynamicContent
      {...columns}
      contentKey="session.entercode.enter.info"
      defaultContent="Die Session-ID kannst du in den Browser, dessen Spielstand du übertragen willst, im Menü sehen"
      inline
    />
  </div>

  <DynamicContent
    {...columns}
    contentKey="session.entercode.cancel.info"
    defaultContent="Ich finde meine Session-ID nicht"
    let:content={infoText}
  >
    <ButtonPanel {infoText}>
      <Button on:click={()=>setStep("start")}>
        <DynamicContent
          {keyColumn}
          {contentColumn}
          contentKey="session.entercode.cancel.button"
          defaultContent="Abbrechen"
          inline
        />
      </Button>
    </ButtonPanel>
  </DynamicContent>

</div>

{#if modalText}
  <DynamicContent
    {...columns}
    contentKey="session.entercode.modal.confirm"
    defaultContent="Verstanden"
    let:content={modalDismissText}
  >
    <Modal dismissText={modalDismissText} >
      <DynamicContent
        {...columns}
        contentKey={modalText}
        defaultContent={modalText}
        type="richText"
      />
    </Modal>
  </DynamicContent>
{/if}

<style>
  .container {
    display: flex;
    flex-direction: column;
    font: var(--font-caption);
  }

  .content {
    padding: var(--distance-s) var(--distance-s) var(--distance-m) var(--distance-s);
  }

  .form {
    padding-bottom: var(--distance-s);
  }

</style>