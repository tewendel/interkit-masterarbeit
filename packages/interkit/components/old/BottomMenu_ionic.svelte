<script>

  let activeTab;
  
</script>

<ion-tabs on:ionTabsDidChange={(e)=>{activeTab = e?.detail?.tab}}>
  
  <ion-tab tab="tab-1">
    <slot name="component-1"></slot>
  </ion-tab>
  <ion-tab tab="tab-2">
    <slot name="component-2"></slot>
  </ion-tab>
  <ion-tab tab="tab-3">
    <slot name="component-3"></slot>
  </ion-tab>
  
  <ion-tab-bar slot="bottom">
      
      <ion-tab-button tab="tab-1">
        <ion-label>tab-1</ion-label>
        <ion-icon name="home" />
      </ion-tab-button>

      <ion-tab-button tab="tab-2">
        <ion-label>tab-2</ion-label>
        <ion-icon name="home" />
      </ion-tab-button>

      <ion-tab-button tab="tab-3">
        <ion-label>tab-3</ion-label>
        <ion-icon name="home" />
      </ion-tab-button>
    
  </ion-tab-bar>
</ion-tabs>


<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script
    type="module"
    src="https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js">
  </script>
<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@ionic/core/css/ionic.bundle.css" />
</svelte:head>

