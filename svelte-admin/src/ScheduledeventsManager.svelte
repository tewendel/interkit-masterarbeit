<script>

  import { onDestroy } from 'svelte'
  import { InterkitClient } from 'interkit'
  import ScheduledeventsList from './ScheduledeventsList.svelte'

  export let projectId
  export let notification = 0

  let scheduledeventsStore
  let unsubscribe
  let scheduledeventsArray

  let subHandle
  $: resetSub(projectId)

  const resetSub = async (projectId) => {
    if (subHandle) await subHandle.stop()
    subHandle = await InterkitClient.getSub('scheduled_events', 'scheduled_events', { projectId, anyStatus: true })
    scheduledeventsStore = subHandle.data
    unsubscribe = scheduledeventsStore.subscribe((data) => {
      scheduledeventsArray = data
    })
  }

  onDestroy(()=>{
    if (unsubscribe) unsubscribe()
  });

  const STATUS_SCHEDULED = 'scheduled'

  $: notification = scheduledeventsArray?.filter(scheduledevent => scheduledevent?.status === STATUS_SCHEDULED)?.length || 0

</script>

<ScheduledeventsList
  scheduledevents={scheduledeventsArray}
  {projectId}
  />

