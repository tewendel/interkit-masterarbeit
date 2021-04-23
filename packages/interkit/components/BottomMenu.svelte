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

      selectPanel: (panel) => {
        const i = panels.indexOf(panel);  
        selectedPanel.set(panel)
        selectedTab.set(tabs[i])      
      },

      selectedTab,
      selectedPanel
    });



</script>

<div class="BottomMenu container">
  <div class="BottomMenu__Pages pages">
    <slot name="pages"></slot>
    <div class="BottomMenu__MediaPlayer media-player">
      <slot name="media_player"></slot>
    </div>
  </div>

  <div class="BottomMenu__Buttons buttons">
    <slot name="buttons"></slot>
  </div>
</div>

<style>

  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--background-color);
    /*--bottom-menu-height: 55px;*/
  }

  .pages {
    flex: 1;
    overflow: auto;
  }

  .media-player {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
  }

  .buttons {
    width: 100%;
    background: white;
    display: flex;
    height: 55px;
  }


</style>