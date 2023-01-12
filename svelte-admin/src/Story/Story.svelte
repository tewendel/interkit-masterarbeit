<script>

import MainColumns from '../MainColumns.svelte'
import Sidebar from '../Sidebar.svelte'
import Content from '../Content.svelte'
import ModalPanel from '../ModalPanel.svelte'

import { default as story, boards } from '../story.js'

export let projectId

let nodePanelLabel = 'start'

</script>

<MainColumns>
  <Sidebar side="left" label="Story">
    <ul>
    {#each $boards as boardId}
      <li>{boardId}</li>
    {/each}
    </ul>
  </Sidebar>
  <Content>
    <h2>board1</h2>
    <pre>nodes</pre>
  </Content>
  <ModalPanel label={nodePanelLabel}>
    Full/Twinish/Strings
  </ModalPanel>
</MainColumns>

