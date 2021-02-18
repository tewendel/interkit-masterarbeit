<script>
  export let tabs;
</script>

<ion-tabs>

  {#each tabs as tab}
    <ion-tab tab={tab.tab}>
      <svelte:component this={tab.component} />
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
