<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AnonymousLogin from "interkit/components/AnonymousLogin.svelte";
import AppBaseAdvanced from "interkit/components/AppBaseAdvanced.svelte";
import AudioPlayer from "interkit/components/AudioPlayer.svelte";
import ButtonBar from "interkit/components/ButtonBar.svelte";
import DataCard from "interkit/components/DataCard.svelte";
import DataCell from "interkit/components/DataCell.svelte";
import DataList from "interkit/components/DataList.svelte";
import DataLoaderMulti from "interkit/components/DataLoaderMulti.svelte";
import DataLoaderSingle from "interkit/components/DataLoaderSingle.svelte";
import Icon from "interkit/components/Icon.svelte";
import IfUIKey from "interkit/components/IfUIKey.svelte";
import LangSwitch from "interkit/components/LangSwitch.svelte";
import LayoutShellAudio from "interkit/components/LayoutShellAudio.svelte";
import NavBar from "interkit/components/NavBar.svelte";
import NavButton from "interkit/components/NavButton.svelte";
import PopoutAudioButton from "interkit/components/PopoutAudioButton.svelte";
import QRScanner from "interkit/components/QRScanner.svelte";
import Route from "interkit/components/Route.svelte";
import ScrollContainer from "interkit/components/ScrollContainer.svelte";
import Spacing from "interkit/components/Spacing.svelte";
import StaticText from "interkit/components/StaticText.svelte";
import TextFormat from "interkit/components/TextFormat.svelte";
import styleTokens from "./styleTokens.json";
globalThis.styleTokens = styleTokens;
console.log('AppBase styleTokens', styleTokens);
initActions();
$: $translations, translations, t, $lang, lang, console.log('AppBase i18n $', { t, $translations, translations, $lang, lang });
console.log('AppBase i18n', { t, $translations, translations, $lang, lang });
</script>

<AppBaseAdvanced
   languages="en,de"
      desktopFallbackMinWidth="600px"
>
<svelte:fragment slot="viewport">
  <AnonymousLogin
     defaultLang="en"
     >
    <DataLoaderMulti
       sheetKey="elements"
                   discoverableColumn="elements/discoverable"
          >
      <Route
         path="/"
         keepAlive={false}
      >
        <LayoutShellAudio
        >
        <svelte:fragment slot="TopBar">
            <Spacing
               top="m"
                  bottom="m"
               >
              <ButtonBar
                 justify="left"
                 >
                <TextFormat
                   interfaceFormat="headline-2"
                   contentFormat="none"
                >
                  <StaticText
                     text={$lang ? ($translations[$lang] && $translations[$lang]["$apptitle"] ? $translations[$lang]["$apptitle"] : "apptitle") : "…"}>
                  </StaticText>
                </TextFormat>
                <LangSwitch
                      reloadAfterSwitch="yes"
                >
                </LangSwitch>
              </ButtonBar>
            </Spacing>
        </svelte:fragment>
        <svelte:fragment slot="Content">
          <ScrollContainer
          >
            <Spacing
               top="m"
               right="m"
               bottom="m"
               left="m"
            >
              <Spacing
                 top="s"
                    bottom="s"
                 >
                <StaticText
                   text={$lang ? ($translations[$lang] && $translations[$lang]["$description"] ? $translations[$lang]["$description"] : "description") : "…"}>
                </StaticText>
              </Spacing>
              <DataList
              >
              <svelte:fragment slot="dataElement">
                <DataCard
                   variant="large"
                      effect={undefined}
                   imageColumn={$lang ? "elements/" + "image$lang".replace("$lang", "$" + $lang) : "elements/image$lang"}   headlineColumn={$lang ? "elements/" + "title$lang".replace("$lang", "$" + $lang) : "elements/title$lang"}   label1Column="elements/label1"
                   subtitle1Column="elements/subtitle1"
                   label2Column="elements/label2"
                   subtitle2Column="elements/subtitle2"
                   label3Column="elements/label3"
                   subtitle3Column="elements/subtitle3"
                   descriptionColumn={$lang ? "elements/" + "description$lang".replace("$lang", "$" + $lang) : "elements/description$lang"}>
                <svelte:fragment slot="chips">
                </svelte:fragment>
                <svelte:fragment slot="content">
                  <PopoutAudioButton
                     audioColumn={$lang ? "elements/" + "audio$lang".replace("$lang", "$" + $lang) : "elements/audio$lang"}   buttonOptions={undefined}
                  >
                  </PopoutAudioButton>
                </svelte:fragment>
                </DataCard>
              </svelte:fragment>
              <svelte:fragment slot="emptyElement">
              </svelte:fragment>
              </DataList>
            </Spacing>
          </ScrollContainer>
        </svelte:fragment>
        <svelte:fragment slot="Player">
            <AudioPlayer
               audioColumn="elements/audio"
               titleColumn={$lang ? "elements/title$lang".replace("$lang", "$" + $lang) : "elements/title$lang"}>
            </AudioPlayer>
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
            <NavBar
            >
              <NavButton
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$buttontitle1"] ? $translations[$lang]["$buttontitle1"] : "buttontitle1") : "…"}   disabled={false}
                 effect={{"effectType":"route","path":"/"}}
              >
                <Icon
                   type="Thin-Dashboard"
                   inverse={false}
                >
                </Icon>
              </NavButton>
              <NavButton
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$buttontitle2"] ? $translations[$lang]["$buttontitle2"] : "buttontitle2") : "…"}   disabled={false}
                 effect={{"effectType":"route","path":"/other"}}
              >
                <Icon
                   type="Thin-Archiv"
                   inverse={false}
                >
                </Icon>
              </NavButton>
              <NavButton
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$buttontitle3"] ? $translations[$lang]["$buttontitle3"] : "buttontitle3") : "…"}   disabled={false}
                 effect={{"effectType":"setUIKey","value":"true","key":"scanner"}}
              >
                <Icon
                   type="Thin-QR-Scan"
                   inverse={false}
                >
                </Icon>
              </NavButton>
            </NavBar>
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
            <Spacing
               top="m"
                  bottom="m"
               >
              <ButtonBar
                 justify="left"
                 >
                <TextFormat
                   interfaceFormat="headline-2"
                   contentFormat="none"
                >
                  <StaticText
                     text={$lang ? ($translations[$lang] && $translations[$lang]["$apptitle"] ? $translations[$lang]["$apptitle"] : "apptitle") : "…"}>
                  </StaticText>
                </TextFormat>
                <LangSwitch
                      reloadAfterSwitch="yes"
                >
                </LangSwitch>
              </ButtonBar>
            </Spacing>
        </svelte:fragment>
        <svelte:fragment slot="Content">
          <Spacing
             top="s"
             right="s"
             bottom="s"
             left="s"
          >
            <DataLoaderSingle
               sheet="43b710ce-6eb8-4780-a524-8ef44a7daf5e"
               rowKey="90177843-8fb5-4dcf-81b5-c5595e67a18b"
               >
              <DataCell
                 column={$lang ? "43b710ce-6eb8-4780-a524-8ef44a7daf5e/" + "rich$lang".replace("$lang", "$" + $lang) : "43b710ce-6eb8-4780-a524-8ef44a7daf5e/rich$lang"}   format="richText"
                 centerContent={false}
              >
              </DataCell>
            </DataLoaderSingle>
          </Spacing>
        </svelte:fragment>
        <svelte:fragment slot="Player">
            <AudioPlayer
               audioColumn="elements/audio"
               titleColumn={$lang ? "elements/title$lang".replace("$lang", "$" + $lang) : "elements/title$lang"}>
            </AudioPlayer>
        </svelte:fragment>
        <svelte:fragment slot="BottomBar">
            <NavBar
            >
              <NavButton
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$buttontitle1"] ? $translations[$lang]["$buttontitle1"] : "buttontitle1") : "…"}   disabled={false}
                 effect={{"effectType":"route","path":"/"}}
              >
                <Icon
                   type="Thin-Dashboard"
                   inverse={false}
                >
                </Icon>
              </NavButton>
              <NavButton
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$buttontitle2"] ? $translations[$lang]["$buttontitle2"] : "buttontitle2") : "…"}   disabled={false}
                 effect={{"effectType":"route","path":"/other"}}
              >
                <Icon
                   type="Thin-Archiv"
                   inverse={false}
                >
                </Icon>
              </NavButton>
              <NavButton
                 text={$lang ? ($translations[$lang] && $translations[$lang]["$buttontitle3"] ? $translations[$lang]["$buttontitle3"] : "buttontitle3") : "…"}   disabled={false}
                 effect={{"effectType":"setUIKey","value":"true","key":"scanner"}}
              >
                <Icon
                   type="Thin-QR-Scan"
                   inverse={false}
                >
                </Icon>
              </NavButton>
            </NavBar>
        </svelte:fragment>
        </LayoutShellAudio>
      </Route>
        <IfUIKey
           storeType="UIKey"
           key="scanner"
           value="true"
        >
        <svelte:fragment slot="iftrue">
          <QRScanner
             elementKeyColumn="elements/106d5f6d-b563-461e-a73a-a2149bafaab6"
             closeEffect={{"effectType":"setUIKey","value":"false","key":"scanner"}}
             scanEffect={{"effectType":"actionTrigger","trigger":"playAudio"}}
          >
          </QRScanner>
        </svelte:fragment>
        <svelte:fragment slot="else">
        </svelte:fragment>
        </IfUIKey>
    </DataLoaderMulti>
  </AnonymousLogin>
</svelte:fragment>
<svelte:fragment slot="desktopFallback">
</svelte:fragment>
<svelte:fragment slot="networkHint">
</svelte:fragment>
</AppBaseAdvanced>

<Route
   path="/"
   keepAlive={false}
>
  <LayoutShellAudio
  >
  <svelte:fragment slot="TopBar">
      <Spacing
         top="m"
            bottom="m"
         >
        <ButtonBar
           justify="left"
           >
          <TextFormat
             interfaceFormat="headline-2"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$apptitle"] ? $translations[$lang]["$apptitle"] : "apptitle") : "…"}>
            </StaticText>
          </TextFormat>
          <LangSwitch
                reloadAfterSwitch="yes"
          >
          </LangSwitch>
        </ButtonBar>
      </Spacing>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <ScrollContainer
    >
      <Spacing
         top="m"
         right="m"
         bottom="m"
         left="m"
      >
        <Spacing
           top="s"
              bottom="s"
           >
          <StaticText
             text={$lang ? ($translations[$lang] && $translations[$lang]["$description"] ? $translations[$lang]["$description"] : "description") : "…"}>
          </StaticText>
        </Spacing>
        <DataList
        >
        <svelte:fragment slot="dataElement">
          <DataCard
             variant="large"
                effect={undefined}
             imageColumn={$lang ? "elements/" + "image$lang".replace("$lang", "$" + $lang) : "elements/image$lang"}   headlineColumn={$lang ? "elements/" + "title$lang".replace("$lang", "$" + $lang) : "elements/title$lang"}   label1Column="elements/label1"
             subtitle1Column="elements/subtitle1"
             label2Column="elements/label2"
             subtitle2Column="elements/subtitle2"
             label3Column="elements/label3"
             subtitle3Column="elements/subtitle3"
             descriptionColumn={$lang ? "elements/" + "description$lang".replace("$lang", "$" + $lang) : "elements/description$lang"}>
          <svelte:fragment slot="chips">
          </svelte:fragment>
          <svelte:fragment slot="content">
            <PopoutAudioButton
               audioColumn={$lang ? "elements/" + "audio$lang".replace("$lang", "$" + $lang) : "elements/audio$lang"}   buttonOptions={undefined}
            >
            </PopoutAudioButton>
          </svelte:fragment>
          </DataCard>
        </svelte:fragment>
        <svelte:fragment slot="emptyElement">
        </svelte:fragment>
        </DataList>
      </Spacing>
    </ScrollContainer>
  </svelte:fragment>
  <svelte:fragment slot="Player">
      <AudioPlayer
         audioColumn="elements/audio"
         titleColumn={$lang ? "elements/title$lang".replace("$lang", "$" + $lang) : "elements/title$lang"}>
      </AudioPlayer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$buttontitle1"] ? $translations[$lang]["$buttontitle1"] : "buttontitle1") : "…"}   disabled={false}
           effect={{"effectType":"route","path":"/"}}
        >
          <Icon
             type="Thin-Dashboard"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$buttontitle2"] ? $translations[$lang]["$buttontitle2"] : "buttontitle2") : "…"}   disabled={false}
           effect={{"effectType":"route","path":"/other"}}
        >
          <Icon
             type="Thin-Archiv"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$buttontitle3"] ? $translations[$lang]["$buttontitle3"] : "buttontitle3") : "…"}   disabled={false}
           effect={{"effectType":"setUIKey","value":"true","key":"scanner"}}
        >
          <Icon
             type="Thin-QR-Scan"
             inverse={false}
          >
          </Icon>
        </NavButton>
      </NavBar>
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
      <Spacing
         top="m"
            bottom="m"
         >
        <ButtonBar
           justify="left"
           >
          <TextFormat
             interfaceFormat="headline-2"
             contentFormat="none"
          >
            <StaticText
               text={$lang ? ($translations[$lang] && $translations[$lang]["$apptitle"] ? $translations[$lang]["$apptitle"] : "apptitle") : "…"}>
            </StaticText>
          </TextFormat>
          <LangSwitch
                reloadAfterSwitch="yes"
          >
          </LangSwitch>
        </ButtonBar>
      </Spacing>
  </svelte:fragment>
  <svelte:fragment slot="Content">
    <Spacing
       top="s"
       right="s"
       bottom="s"
       left="s"
    >
      <DataLoaderSingle
         sheet="43b710ce-6eb8-4780-a524-8ef44a7daf5e"
         rowKey="90177843-8fb5-4dcf-81b5-c5595e67a18b"
         >
        <DataCell
           column={$lang ? "43b710ce-6eb8-4780-a524-8ef44a7daf5e/" + "rich$lang".replace("$lang", "$" + $lang) : "43b710ce-6eb8-4780-a524-8ef44a7daf5e/rich$lang"}   format="richText"
           centerContent={false}
        >
        </DataCell>
      </DataLoaderSingle>
    </Spacing>
  </svelte:fragment>
  <svelte:fragment slot="Player">
      <AudioPlayer
         audioColumn="elements/audio"
         titleColumn={$lang ? "elements/title$lang".replace("$lang", "$" + $lang) : "elements/title$lang"}>
      </AudioPlayer>
  </svelte:fragment>
  <svelte:fragment slot="BottomBar">
      <NavBar
      >
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$buttontitle1"] ? $translations[$lang]["$buttontitle1"] : "buttontitle1") : "…"}   disabled={false}
           effect={{"effectType":"route","path":"/"}}
        >
          <Icon
             type="Thin-Dashboard"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$buttontitle2"] ? $translations[$lang]["$buttontitle2"] : "buttontitle2") : "…"}   disabled={false}
           effect={{"effectType":"route","path":"/other"}}
        >
          <Icon
             type="Thin-Archiv"
             inverse={false}
          >
          </Icon>
        </NavButton>
        <NavButton
           text={$lang ? ($translations[$lang] && $translations[$lang]["$buttontitle3"] ? $translations[$lang]["$buttontitle3"] : "buttontitle3") : "…"}   disabled={false}
           effect={{"effectType":"setUIKey","value":"true","key":"scanner"}}
        >
          <Icon
             type="Thin-QR-Scan"
             inverse={false}
          >
          </Icon>
        </NavButton>
      </NavBar>
  </svelte:fragment>
  </LayoutShellAudio>
</Route>
