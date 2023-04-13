import { writable, derived } from 'svelte/store'
import {InterkitClient} from 'interkit'

export const projectId = writable()

export const secondaryTabIndex = writable(0);
export const secondaryTabsVisible = writable(true);

let subStatus = {}
export const currentProject = derived(
  projectId,
  async ($projectId, set) => {

    if(subStatus?.currentProjectSub?.stop && (subStatus.currentProjectId && subStatus.currentProjectId != $projectId || !$projectId)) {
      console.log("unsubscribing project", subStatus.currentProjectId)
      await subStatus.currentProjectSub.stop()
      subStatus = {}
      set(null)
    }

    if ($projectId) {
      console.log("subscribing project", $projectId)

      const currentProjectSub = await InterkitClient.getSub('projects', 'project', $projectId, (p)=>p.id == $projectId, true)

      subStatus.currentProjectSub = currentProjectSub
      subStatus.currentProjectId = $projectId

      currentProjectSub.data?.subscribe((p)=>{
        set(p)
      })
    }

    return async () => {
      if(subStatus?.currentProjectSub?.stop) {
        await subStatus.currentProjectSub.stop()
      }
    };

  }
);
