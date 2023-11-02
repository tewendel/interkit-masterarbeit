import { writable, derived } from 'svelte/store'
import {InterkitClient} from 'interkit'

export const projectId = writable()

export const secondaryTabIndex = writable(0)
export const secondaryTabSpecialDoc = writable(false)
/* the Tabs (their buttons, not their contents) */
export const secondaryTabsHidden = writable(false)
/* the pane / tab content */
export const secondaryTabsMinimized = writable(false)

export const secondaryTabsPreviewSize = writable(0)

export const secondaryTabsSize = writable(0)
export const secondaryTabsSizes = [1/3, 1/2, 2/3]

let currentProjectSub = null
// a derived store that subscribes to the current project according to $projectId
export const currentProject = derived(
  projectId,
  async ($projectId, set) => {

    previewCurrentRoute.set('…')

    if (!$projectId && currentProjectSub?.stop) {
      console.log("stopping project sub")
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

let currentProjectEditingUsersSub = null;
// a derived store that subscribes to the users that are currently editing the same project according to $projectId
export const currentProjectEditingUsers = derived(
  projectId,
  async ($projectId, set) => {

    if (!$projectId && currentProjectEditingUsersSub?.stop) {
      currentProjectEditingUsersSub.stop();
      set([]);
    }

    if ($projectId) {
      currentProjectEditingUsersSub = await InterkitClient.getSub(
        "users",
        "user.editingProject",
        {projectId: $projectId, userId: InterkitClient.userId},
        (u) => (u?.connections || []).some((c) => c?.url?.includes($projectId)),
        false,
        null,
        "adminCurrentProjectUsers"
      );
      currentProjectEditingUsersSub.data?.subscribe((p) => {
        if (p.length > 0) {
          set(p.map((u) => {
            const urls = u.connections.filter((c) => c.url.includes($projectId)).map((c) => c.url)
            let tabs = urls.map((url) => {
              const URLobject = new URL(url)
              return URLobject.hash.split("/")[2]
            })
            return { ...u, tabs }
          }));
        } else {
          set([]);
        };
      })
    }

    return async () => {
      if (currentProjectEditingUsersSub?.stop) {
        await currentProjectEditingUsersSub.stop();
      }
    };

  }
);

const userId = InterkitClient.userId;
let currentUserSub = null
// a derived store that subscribes to the current user according to interkit userId
export const currentUser = derived(
  userId, 
  async ($userId, set) => {

    if (!$userId && currentUserSub?.stop) {
      currentUserSub.stop();
      set(null);
    }

    if ($userId) {
      currentUserSub = await InterkitClient.getSub("users", "user", $userId, (u) => u.id == $userId, true, null, "adminCurrentUser");
      currentUserSub.data?.subscribe((u) => {
        set(u);
      });
    }

    return async () => {
      if (currentUserSub?.stop) {
        await currentUserSub.stop();
      }
    };
  }
);


export const secondaryTabPreviewProjectId = writable()

export const previewOverrideStyleTokens = writable('')
export const previewCurrentRoute = writable('')

export const projectManagerTab = writable(0)
export const projectManagerSortKey = writable('createdAt')
export const projectManagerSortDirection = writable('descending')
export const projectManagerPage = writable(1)
export const projectManagerSortKeyTemplate = writable('createdAt')
export const projectManagerSortDirectionTemplate = writable('descending')
export const projectManagerPageTemplate = writable(1)


export const currentProjectReadOnly = writable(false)
