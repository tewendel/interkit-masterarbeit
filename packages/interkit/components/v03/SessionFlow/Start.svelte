<script>
  import Button from '../Button.svelte'
  import {executeTrigger} from '../../actions'
  import DynamicContent from '../DynamicContent.svelte'
  import ButtonPanel from '../ButtonPanel.svelte'

  export let restartTrigger
  export let setStep = function(){}
  export let keyColumn
  export let contentColumn

  const columns = {
    keyColumn,
    contentColumn
  }

</script>

<div class="SessionFlow__Start container">
  <div class="content">
    <DynamicContent
      {...columns}
      contentKey="session.start.intro"
      defaultContent="## Start"
      format="richText"
    />
  </div>

  <div class="content">

    <DynamicContent
      {...columns}
      contentKey="session.start.new.info"
      
      let:content={infoText}
    >
      <ButtonPanel {infoText}>
        <Button type="primary" flex="fill" size="large" on:click={() => executeTrigger(restartTrigger)}>
          <DynamicContent
            {...columns}
            contentKey="session.start.new.button"
            defaultContent="Neustarten"
            inline
          />
        </Button>
      </ButtonPanel>
    </DynamicContent>

  </div>

  <div class="content buttonPanel">
    <DynamicContent
      {...columns}
      contentKey="session.start.restore.info"
      
      let:content={infoText}
    >
      <ButtonPanel {infoText}>
        <Button type="ghost" flex="fill" size="medium" on:click={() => setStep("enterCode")}>
          <DynamicContent
            {...columns}
            contentKey="session.start.restore.button"
            defaultContent="Forfahren"
            inline
          />
        </Button>
      </ButtonPanel>
    </DynamicContent>
  </div>
</div>

<style>
  .content + .content {
    margin-top: var(--distance-s);
  }
</style>