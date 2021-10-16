<script>
  import Button from '../Button.svelte'
  import {executeTrigger} from '../../actions'
  import DynamicContent from '../DynamicContent.svelte'

  export let restartTrigger
  export let setStep = function(){}
  export let keyColumn
  export let contentColumn

</script>

<DynamicContent
  {keyColumn}
  {contentColumn}
  contentKey="session.start.intro"
  defaultContent="## Start"
  format="richText"
/>
<Button on:click={() => executeTrigger(restartTrigger)}>
  <DynamicContent
    {keyColumn}
    {contentColumn}
    contentKey="session.start.new.button"
    defaultContent="Neustarten"
    inline
  />
</Button>

<DynamicContent
  {keyColumn}
  {contentColumn}
  contentKey="session.start.new.info"
  defaultContent="Von vorne beginnen"
  inline
/>

<Button on:click={() => setStep("enterCode")}>
  <DynamicContent
    {keyColumn}
    {contentColumn}
    contentKey="session.start.restore.button"
    defaultContent="Forfahren"
    inline
  />
</Button>

<DynamicContent
  {keyColumn}
  {contentColumn}
  contentKey="session.start.restore.info"
  defaultContent="Du hast bereits eine Session-ID"
  inline
/>