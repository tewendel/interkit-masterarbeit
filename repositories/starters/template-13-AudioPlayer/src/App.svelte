<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AppBase from "interkit/components/AppBase.svelte";
import AudioPlayer from "interkit/components/AudioPlayer.svelte";
import DataCard from "interkit/components/DataCard.svelte";
import DataCell from "interkit/components/DataCell.svelte";
import DataList from "interkit/components/DataList.svelte";
import DataLoaderMulti from "interkit/components/DataLoaderMulti.svelte";
import DataLoaderSingle from "interkit/components/DataLoaderSingle.svelte";
import Icon from "interkit/components/Icon.svelte";
import InlineAudioButton from "interkit/components/InlineAudioButton.svelte";
import LayoutShellAudio from "interkit/components/LayoutShellAudio.svelte";
import NavButton from "interkit/components/NavButton.svelte";
import PopoutAudioButton from "interkit/components/PopoutAudioButton.svelte";
import Route from "interkit/components/Route.svelte";
import Spacing from "interkit/components/Spacing.svelte";
import StaticText from "interkit/components/StaticText.svelte";
import styleTokens from "./styleTokens.json";
globalThis.styleTokens = styleTokens;
console.log('AppBase styleTokens', styleTokens);
initActions();
$: $translations, translations, t, $lang, lang, console.log('AppBase i18n $', { t, $translations, translations, $lang, lang });
console.log('AppBase i18n', { t, $translations, translations, $lang, lang });
</script>

<AppBase
   >
  <Route
     path="/"
     keepAlive={false}
  >
    <LayoutShellAudio
    >
    <svelte:fragment slot="TopBar">
      <StaticText
         text="Audios"
      >
      </StaticText>
    </svelte:fragment>
    <svelte:fragment slot="Content">
      <Spacing
         top="s"
         right="s"
         bottom="s"
         left="s"
      >
        <StaticText
           text="This is a list of audios that launch the popout player."
        >
        </StaticText>
      </Spacing>
      <DataLoaderMulti
         sheetKey="elements"
            hideColumn="elements/hide"
               discoverableColumn="undefined/undefined"
            >
        <DataList
        >
        <svelte:fragment slot="dataElement">
          <Spacing
             top="s"
             right="s"
             bottom="s"
             left="s"
          >
            <DataCell
               column="elements/title"
               format="richText"
               inline={true}
               centerContent={false}
            >
            </DataCell>
            <PopoutAudioButton
               audioColumn="elements/audio"
            >
            </PopoutAudioButton>
          </Spacing>
        </svelte:fragment>
        <svelte:fragment slot="emptyElement">
        </svelte:fragment>
        </DataList>
      </DataLoaderMulti>
    </svelte:fragment>
    <svelte:fragment slot="Player">
        <AudioPlayer
           audioColumn="elements/audio"
           titleColumn="elements/title"
        >
          <DataCard
             variant="full"
                effect={undefined}
             imageColumn="elements/image"
             headlineColumn="elements/title"
             label1Column="elements/label1"
             subtitle1Column="elements/subtitle1"
             label2Column="elements/label2"
             subtitle2Column="elements/subtitle2"
             label3Column="elements/label3"
             subtitle3Column="elements/subtitle3"
             descriptionColumn="elements/description"
          >
          <svelte:fragment slot="chips">
          </svelte:fragment>
          <svelte:fragment slot="content">
          </svelte:fragment>
          </DataCard>
        </AudioPlayer>
    </svelte:fragment>
    <svelte:fragment slot="BottomBar">
        <NavButton
           text="Audios"
           disabled={false}
           effect={{"effectType":"route","path":"/"}}
        >
          <Icon
             type="Thin-Dashboard"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text="Other"
           disabled={false}
           effect={{"effectType":"route","path":"/other"}}
        >
          <Icon
             type="Thin-Archiv"
             inverse={false}
          >
          </Icon>
        </NavButton>
    </svelte:fragment>
    </LayoutShellAudio>
  </Route>
  <Route
     path="/other"
     keepAlive={false}
  >
    <LayoutShellAudio
    >
    <svelte:fragment slot="TopBar">
      <StaticText
         text="Something else"
      >
      </StaticText>
    </svelte:fragment>
    <svelte:fragment slot="Content">
      <Spacing
         top="s"
         right="s"
         bottom="s"
         left="s"
      >
        <StaticText
           text="This is an inline audio player."
        >
        </StaticText>
        <DataLoaderSingle
           sheet="elements"
           rowKey="a8159b74-a6dc-4ebe-b0e2-d24012531b8c"
           >
          <InlineAudioButton
             audioColumn="elements/audio"
             hideSkipControls={true}
          >
          </InlineAudioButton>
        </DataLoaderSingle>
      </Spacing>
    </svelte:fragment>
    <svelte:fragment slot="Player">
        <AudioPlayer
           audioColumn="elements/audio"
           titleColumn="elements/title"
        >
          <DataCard
             variant="full"
                effect={undefined}
             imageColumn="elements/image"
             headlineColumn="elements/title"
             label1Column="elements/label1"
             subtitle1Column="elements/subtitle1"
             label2Column="elements/label2"
             subtitle2Column="elements/subtitle2"
             label3Column="elements/label3"
             subtitle3Column="elements/subtitle3"
             descriptionColumn="elements/description"
          >
          <svelte:fragment slot="chips">
          </svelte:fragment>
          <svelte:fragment slot="content">
          </svelte:fragment>
          </DataCard>
        </AudioPlayer>
    </svelte:fragment>
    <svelte:fragment slot="BottomBar">
        <NavButton
           text="Audios"
           disabled={false}
           effect={{"effectType":"route","path":"/"}}
        >
          <Icon
             type="Thin-Dashboard"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text="Other"
           disabled={false}
           effect={{"effectType":"route","path":"/other"}}
        >
          <Icon
             type="Thin-Archiv"
             inverse={false}
          >
          </Icon>
        </NavButton>
    </svelte:fragment>
    </LayoutShellAudio>
  </Route>
</AppBase>

<Route
   path="/"
   keepAlive={false}
>
  <LayoutShellAudio
  >
  <svelte:fragment slot="TopBar">
    <StaticText
       text="Audios"
    >
    </StaticText>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <Spacing
       top="s"
       right="s"
       bottom="s"
       left="s"
    >
      <StaticText
         text="This is a list of audios that launch the popout player."
      >
      </StaticText>
    </Spacing>
    <DataLoaderMulti
       sheetKey="elements"
          hideColumn="elements/hide"
             discoverableColumn="undefined/undefined"
          >
      <DataList
      >
      <svelte:fragment slot="dataElement">
        <Spacing
           top="s"
           right="s"
           bottom="s"
           left="s"
        >
          <DataCell
             column="elements/title"
             format="richText"
             inline={true}
             centerContent={false}
          >
          </DataCell>
          <PopoutAudioButton
             audioColumn="elements/audio"
          >
          </PopoutAudioButton>
        </Spacing>
      </svelte:fragment>
      <svelte:fragment slot="emptyElement">
      </svelte:fragment>
      </DataList>
    </DataLoaderMulti>
  </svelte:fragment>
  <svelte:fragment slot="Player">
      <AudioPlayer
         audioColumn="elements/audio"
         titleColumn="elements/title"
      >
        <DataCard
           variant="full"
              effect={undefined}
           imageColumn="elements/image"
           headlineColumn="elements/title"
           label1Column="elements/label1"
           subtitle1Column="elements/subtitle1"
           label2Column="elements/label2"
           subtitle2Column="elements/subtitle2"
           label3Column="elements/label3"
           subtitle3Column="elements/subtitle3"
           descriptionColumn="elements/description"
        >
        <svelte:fragment slot="chips">
        </svelte:fragment>
        <svelte:fragment slot="content">
        </svelte:fragment>
        </DataCard>
      </AudioPlayer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavButton
         text="Audios"
         disabled={false}
         effect={{"effectType":"route","path":"/"}}
      >
        <Icon
           type="Thin-Dashboard"
           inverse={false}
        >
        </Icon>
      </NavButton>
      <NavButton
         text="Other"
         disabled={false}
         effect={{"effectType":"route","path":"/other"}}
      >
        <Icon
           type="Thin-Archiv"
           inverse={false}
        >
        </Icon>
      </NavButton>
  </svelte:fragment>
  </LayoutShellAudio>
</Route>

<Route
   path="/other"
   keepAlive={false}
>
  <LayoutShellAudio
  >
  <svelte:fragment slot="TopBar">
    <StaticText
       text="Something else"
    >
    </StaticText>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <Spacing
       top="s"
       right="s"
       bottom="s"
       left="s"
    >
      <StaticText
         text="This is an inline audio player."
      >
      </StaticText>
      <DataLoaderSingle
         sheet="elements"
         rowKey="a8159b74-a6dc-4ebe-b0e2-d24012531b8c"
         >
        <InlineAudioButton
           audioColumn="elements/audio"
           hideSkipControls={true}
        >
        </InlineAudioButton>
      </DataLoaderSingle>
    </Spacing>
  </svelte:fragment>
  <svelte:fragment slot="Player">
      <AudioPlayer
         audioColumn="elements/audio"
         titleColumn="elements/title"
      >
        <DataCard
           variant="full"
              effect={undefined}
           imageColumn="elements/image"
           headlineColumn="elements/title"
           label1Column="elements/label1"
           subtitle1Column="elements/subtitle1"
           label2Column="elements/label2"
           subtitle2Column="elements/subtitle2"
           label3Column="elements/label3"
           subtitle3Column="elements/subtitle3"
           descriptionColumn="elements/description"
        >
        <svelte:fragment slot="chips">
        </svelte:fragment>
        <svelte:fragment slot="content">
        </svelte:fragment>
        </DataCard>
      </AudioPlayer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavButton
         text="Audios"
         disabled={false}
         effect={{"effectType":"route","path":"/"}}
      >
        <Icon
           type="Thin-Dashboard"
           inverse={false}
        >
        </Icon>
      </NavButton>
      <NavButton
         text="Other"
         disabled={false}
         effect={{"effectType":"route","path":"/other"}}
      >
        <Icon
           type="Thin-Archiv"
           inverse={false}
        >
        </Icon>
      </NavButton>
  </svelte:fragment>
  </LayoutShellAudio>
</Route>
