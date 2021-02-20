<script>
  export let tabs;
  let activeTab;
</script>

<ion-tabs on:ionTabsDidChange={(e)=>{activeTab = e?.detail?.tab}}>

  {#each tabs as tab}
    <ion-tab tab={tab.tab}>
      <svelte:component this={tab.component} {activeTab} />
    </ion-tab>
  {/each}

  <ion-tab-bar slot="bottom">
    {#each tabs as tab}
      <ion-tab-button tab={tab.tab}>
        <ion-label>{tab.label}</ion-label>
        <ion-icon name={tab.icon} />
      </ion-tab-button>
    {/each}

  </ion-tab-bar>
</ion-tabs>
