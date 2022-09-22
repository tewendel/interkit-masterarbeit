<script context="module">
  export const TABS = {};
</script>

<script>

  import { setContext, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import { InterkitClient } from '../'

  const tabs = [];
  const panels = [];
  const selectedTab = writable(null);
  const selectedPanel = writable(null);

  let containerHeightPx = 0
  let pagesHeightPx = 0
  let buttonsHeightPx = 0
  let audioPlayerHeightPx = 0

  setContext(TABS, {
      registerTab: (tab, key) => {
        tabs.push(tab);
        
        // set current to the first tab that is registered
        selectedTab.update(current => current || tab);

        // set the UiKey to the first key that is registered
        if(!InterkitClient.getUiKey("bottomMenuKey")) {
          InterkitClient.setUiKey("bottomMenuKey", key);    
        }
        
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
      selectedPanel,
      pagesHeightPx
    });

    const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")

    //const throttledMaxHeightUpdate = throttle(100, false, val => $audioPlayerStatus.maxHeightPx = val, true)

    $: if ($audioPlayerStatus) {
      //throttledMaxHeightUpdate(pagesHeightPx + audioPlayerHeightPx)
      $audioPlayerStatus.maxHeightPx = containerHeightPx - buttonsHeightPx
    }

</script>

<div 
  class="BottomMenu container" 
  class:mediaPlayerActive={$audioPlayerStatus?.active}
  bind:clientHeight={containerHeightPx}
  >
  <div class="BottomMenu__Pages pages" bind:clientHeight={pagesHeightPx}>
    <slot name="pages"></slot>
  </div>

  <div class="BottomMenu__MediaPlayer media-player" 
    class:active={$audioPlayerStatus?.active}
    class:expanded={$audioPlayerStatus?.expanded}
    bind:clientHeight={audioPlayerHeightPx}
  >
      <slot name="media_player"></slot>
  </div>

  <div class="BottomMenu__Buttons buttons" bind:clientHeight={buttonsHeightPx}>
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
    overflow: hidden;
    position: relative;
  }

  .media-player {
    position: relative;
    width: 100%;
    pointer-events: none;
    touch-action: none;
    display: flex;
    overflow: hidden;
  }
  :global(.media-player > *) {
    pointer-events: all;
    touch-action: auto;
  }

  .media-player.active {
    
    /*height: 55px;*/
  }

  .media-player.expanded {
    /*height: 100%;*/
  }

  .buttons {
    width: 100%;
    display: flex;
    height: 64px;
  }


</style>