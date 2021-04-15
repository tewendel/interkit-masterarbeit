<script>
import Styling from "interkit/components/Styling.svelte";
import BottomMenu from "interkit/components/BottomMenu.svelte";
import BottomMenuPage from "interkit/components/BottomMenuPage.svelte";
import BottomMenuButton from "interkit/components/BottomMenuButton.svelte";
import Dashboard from "interkit/components/Dashboard.svelte";
import Archive from "interkit/components/Archive.svelte";
import Map from "interkit/components/Map.svelte";
import Theming from "interkit/components/Theming.svelte";
</script>

<Styling
      primary_color="#33ff33"
      font_family="inter"
      google_font="Inter:wght@100"
      >

        <BottomMenu>
          <svelte:fragment slot="pages">
              <BottomMenuPage>  <Dashboard
            sectionTitles=""
            sectionRefs=""
            /></BottomMenuPage><BottomMenuPage>  <Archive
            dataSheet=""
            categorySheet1=""
            categorySheet2=""
            /></BottomMenuPage><BottomMenuPage>  <Map
            markerPositions=""
            markerLabels=""
            /></BottomMenuPage>
          </svelte:fragment>
          <svelte:fragment slot="buttons">
              <BottomMenuButton label="Home"/><BottomMenuButton label="Archive"/><BottomMenuButton label="Map"/>
          </svelte:fragment>

        </BottomMenu>

</Styling>
<Theming cssFile="global.css" />