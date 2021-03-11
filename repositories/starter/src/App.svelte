<script>
  import HeadlinePage from 'interkit/components/HeadlinePage.svelte'
  import BottomMenu from 'interkit/components/BottomMenu.svelte'
  import BottomMenuButton from 'interkit/components/BottomMenuButton.svelte'
  import BottomMenuPage from 'interkit/components/BottomMenuPage.svelte'

</script>

<BottomMenu>
  <div slot="buttons">
      <BottomMenuButton label="one"/>
      <BottomMenuButton label="two"/>
      <BottomMenuButton label="three"/>
  </div>
  <div slot="pages">
      <BottomMenuPage><HeadlinePage/></BottomMenuPage>
      <BottomMenuPage><HeadlinePage/></BottomMenuPage>
      <BottomMenuPage><HeadlinePage/></BottomMenuPage>
  </div>
</BottomMenu>
