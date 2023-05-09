import { writable, derived } from 'svelte/store'
import {InterkitClient} from 'interkit'

export const projectId = writable()

export const secondaryTabIndex = writable(0);
export const secondaryTabSpecialDoc = writable(false)
export const secondaryTabsVisible = writable(true);

let currentProjectSub = null
export const currentProject = derived(
  projectId,
  async ($projectId, set) => {

    if (!$projectId && currentProjectSub?.stop) {
      currentProjectSub.stop()
      set(null)
    }

    if ($projectId) {
      console.log("subscribing project", $projectId)
      currentProjectSub = await InterkitClient.getSub('projects', 'project', $projectId, (p)=>p.id == $projectId, true, null, "adminCurrentProject")
      currentProjectSub.data?.subscribe((p)=>{
        set(p)
      })
    } 

    return async () => {
      if(currentProjectSub?.stop) {
        await currentProjectSub.stop()
      }
    };

  }
);

export const secondaryTabPreviewProjectId = writable()

