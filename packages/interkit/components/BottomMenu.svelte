<script context="module">
  export const TABS = {};
</script>

<script>

  import { setContext, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';

  const tabs = [];
  const panels = [];
  const selectedTab = writable(null);
  const selectedPanel = writable(null);

  setContext(TABS, {
      registerTab: tab => {
        tabs.push(tab);
        selectedTab.update(current => current || tab);
        
        onDestroy(() => {
          const i = tabs.indexOf(tab);
          tabs.splice(i, 1);
          selectedTab.update(current => current === tab ? (tabs[i] || tabs[tabs.length - 1]) : current);
        });
      },

      registerPanel: panel => {
        panels.push(panel);
        selectedPanel.update(current => current || panel);
        
        onDestroy(() => {
          const i = panels.indexOf(panel);
          panels.splice(i, 1);
          selectedPanel.update(current => current === panel ? (panels[i] || panels[panels.length - 1]) : current);
        });
      },

      selectTab: (tab) => {
        const i = tabs.indexOf(tab);
        //console.log(i)
        
        selectedTab.set(tab);
        selectedPanel.set(panels[i]);
      },

      selectedTab,
      selectedPanel
    });



</script>

<div class="BottomMenu container">
  <div class="BottomMenu__Pages pages">
    <slot name="pages"></slot>
  </div>

  <div class="media-player">
    <slot name="media_player"></slot>
  </div>

  <div class="BottomMemu__Buttons buttons">
    <div class="button-container">
      <slot name="buttons"></slot>
    </div>
  </div>
</div>

<style>

  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--background-color);
  }

  .pages {
    flex: 1;
  }

  .media-player {
    position: fixed;
    left: 0;
    bottom: 50px;
  }

  .buttons {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: white;
  }

  .button-container {
    display: flex;
    width: 100%;
  }


</style>