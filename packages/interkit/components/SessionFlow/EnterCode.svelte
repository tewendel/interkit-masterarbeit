<script>
  import { InterkitClient } from '../../index'
  import {executeTrigger} from '../../actions'
  import Button from '../Button.svelte'
  import Input from '../Input.svelte'
  import Modal from '../Modal.svelte'

  export let setStep = function(){}
  export let restoredTrigger

  let code = ""

  let modalText
  let modalDismissText = "Verstanden"
  let dismissModalFunction

  const send = async event => {
    const result = await InterkitClient.loginTokenUser({userToken: code})
    if (result.id) {
      modalText = "Success"
      dismissModalFunction = event => {
        modalText = null
      }
    } else {
      modalText = "try again"
      dismissModalFunction = event => {
        modalText = null
        executeTrigger(restoredTrigger)
      }
    }
  }

</script>

<div class="container">
  <h2>
    Login<br>
    <small>
      Session-ID eingeben
    </small>
  </h2>
  <div class="buttons">
    <Input type="text" placeholder="Session-ID" bind:value={code} />
    <Button on:click={send}>
      Bestätigen
    </Button>
  </div>
  <p>Mit der Session-ID kannst du deinen Spielstand wiederherstellen. Sie besteht aus Buchstaben und Ziffern. Wenn du deine Email angegeben hast, solltest du eine Email bekommen haben. Ansonsten siehst du sie im Menu des Browsers, dessen Spielstand du übertragen willst.</p>
  <Button type="tertiary" on:click={()=>setStep("start")}>
    Abbrechen
  </Button>
</div>

{#if modalText}
  <Modal dismissText={modalDismissText} dismissFunction={dismissModalFunction}>
    {modalText}
  </Modal>
{/if}

<style>
  .container, .buttons {
    display: flex;
    flex-direction: column;
  }
</style>