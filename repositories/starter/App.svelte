<script>
  import HeadlinePage from 'interkit/components/HeadlinePage.svelte'
  import BottomMenu from 'interkit/components/BottomMenu.svelte'
  import BottomMenuButton from 'interkit/components/BottomMenuButton.svelte'
  import BottomMenuPage from 'interkit/components/BottomMenuPage.svelte'

  import Map from 'interkit/components/Map.svelte'
  import Dashboard from 'interkit/components/Dashboard.svelte'
  import Archive from 'interkit/components/Archive.svelte'
  import Styling from 'interkit/components/Style.svelte'

</script>

<Styling
  primary_color="#27EBBC"
  font_family="inter"
  google_font="Inter:wght@100"
>

<BottomMenu>
  <div slot="buttons">
      <BottomMenuButton label="one"/>
      <BottomMenuButton label="two"/>
      <BottomMenuButton label="three"/>
  </div>
  <div slot="pages">
      <BottomMenuPage><Dashboard/></BottomMenuPage>
      <BottomMenuPage><Archive/></BottomMenuPage>
      <BottomMenuPage><Map/></BottomMenuPage>
  </div>
</BottomMenu>

</Styling>