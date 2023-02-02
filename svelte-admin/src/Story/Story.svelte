<script>

import MainColumns from '../MainColumns.svelte'
import Sidebar from '../Sidebar.svelte'
import Content from '../Content.svelte'
import ModalPanel from '../ModalPanel.svelte'

import { default as story, boards } from '../story.js'

let nodePanelLabel = 'start'

</script>

<MainColumns
  sidebarLeftLabel="Story"
  modalPanelRightLabel={nodePanelLabel}
  >
  <svelte:fragment slot="sidebarLeft">
    {#each $boards as boardId}
      <li>{boardId}</li>
    {/each}
  </svelte:fragment>
  <Content>
    <h2>board1</h2>
    <pre>nodes</pre>
  </Content>
  <svelte:fragment slot="modalPanelRight">
    Full/Twinish/Strings
  </svelte:fragment>
</MainColumns>

