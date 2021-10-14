<script>
  import Button from '../Button.svelte'
  import Input from '../Input.svelte'

  export let setStep = function(){}
</script>

<div class="container">
  <h2>
    Login<br>
    <small>
      Session-ID eingeben
    </small>
  </h2>
  <div class="buttons">
    <Input type="text" placeholder="Session-ID" />
    <Button on:click={() => setStep("enterCode")}>
      Bestätigen
    </Button>
  </div>
  <p>Mit der Session-ID kannst du deinen Spielstand wiederherstellen. Sie besteht aus Buchstaben und Ziffern. Wenn du deine Email angegeben hast, solltest du eine Email bekommen haben. Ansonsten siehst du sie im Menu des Browsers, dessen Spielstand du übertragen willst.</p>
  <Button type="tertiary" on:click={()=>setStep("start")}>
    Abbrechen
  </Button>
</div>

<style>
  .container, .buttons {
    display: flex;
    flex-direction: column;
  }
</style>