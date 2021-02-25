<script>
  import { InterkitClient } from 'interkit-shared'
  const INTERKIT_SERVER_WEBSOCKETS_URL = "ws://localhost:3000"; // todo: figure our how to configure this for the app

  import config from './App.yml'
  import Style from './Style.svelte'

  let Test;
  let myTabs = [];

  import { onMount } from 'svelte'

  onMount(async () => {

    await InterkitClient.connect(INTERKIT_SERVER_WEBSOCKETS_URL);

    let tabs = [];

    const loadComponent = async (component) => {
      let c;
      if(component == "Dashboard") c = (await import('./Dashboard.svelte')).default;
      if(component == "Archive") c = (await import('./Archive.svelte')).default;
      if(component == "Map") c = (await import('./Map.svelte')).default;
      return c;
    }

    const addMenuItem = async (key) => {
      if(config[key + "_label"]?.value) {
        tabs.push({
          label: config[key + "_label"]?.value,
          tab: config[key + "_component"]?.value,
          icon: config[key + "_icon"]?.value,
          component: await loadComponent(config[key + "_component"]?.value)
        })
      }
    }

    await addMenuItem("menu1");
    await addMenuItem("menu2");
    await addMenuItem("menu3");

    myTabs = tabs;
  })

  import IonTab from './IonTab.svelte'
  
</script>

<ion-app>
  <Style>
    <IonTab tabs={myTabs} />
  </Style>
</ion-app>

<svelte:head>
  <script
    type="module"
    src="https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js">
  </script>
<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@ionic/core/css/ionic.bundle.css" />
</svelte:head>
