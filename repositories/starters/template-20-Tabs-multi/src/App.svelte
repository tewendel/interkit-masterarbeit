<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AppBase from "interkit/components/AppBase.svelte";
import IfUIKey from "interkit/components/IfUIKey.svelte";
import Spacing from "interkit/components/Spacing.svelte";
import StaticText from "interkit/components/StaticText.svelte";
import Tab from "interkit/components/Tab.svelte";
import TabBar from "interkit/components/TabBar.svelte";
import styleTokens from "./styleTokens.json";
globalThis.styleTokens = styleTokens;
console.log('AppBase styleTokens', styleTokens);
initActions();
$: $translations, translations, t, $lang, lang, console.log('AppBase i18n $', { t, $translations, translations, $lang, lang });
console.log('AppBase i18n', { t, $translations, translations, $lang, lang });
</script>

<AppBase
   >
  <Spacing
     top="s"
     right="s"
     bottom="s"
     left="s"
  >
    <StaticText
       text="Here are two independent sets of tabs:"
    >
    </StaticText>
  </Spacing>
    <TabBar
    >
      <Tab
         text="Tab One"
         effect={{"effectType":"setUIKey","value":"1","key":"tab1"}}
         execOnMount={true}
      >
      </Tab>
      <Tab
         text="Tab Two"
         effect={{"effectType":"setUIKey","value":"2","key":"tab1"}}
         >
      </Tab>
      <Tab
         text="Tab Three"
         effect={{"effectType":"setUIKey","value":"3","key":"tab1"}}
         >
      </Tab>
    </TabBar>
    <Spacing
       top="s"
       right="s"
       bottom="s"
       left="s"
    >
        <IfUIKey
           storeType="UIKey"
           key="tab1"
           value="1"
        >
        <svelte:fragment slot="iftrue">
          <StaticText
             text="Some content"
          >
          </StaticText>
        </svelte:fragment>
        <svelte:fragment slot="else">
        </svelte:fragment>
        </IfUIKey>
        <IfUIKey
           storeType="UIKey"
           key="tab1"
           value="2"
        >
        <svelte:fragment slot="iftrue">
          <StaticText
             text="More content"
          >
          </StaticText>
        </svelte:fragment>
        <svelte:fragment slot="else">
        </svelte:fragment>
        </IfUIKey>
        <IfUIKey
           storeType="UIKey"
           key="tab1"
           value="3"
        >
        <svelte:fragment slot="iftrue">
          <StaticText
             text="Other"
          >
          </StaticText>
        </svelte:fragment>
        <svelte:fragment slot="else">
        </svelte:fragment>
        </IfUIKey>
    </Spacing>
    <TabBar
    >
      <Tab
         text="Tab One"
         effect={{"effectType":"setUIKey","value":"1","key":"tab2"}}
         execOnMount={true}
      >
      </Tab>
      <Tab
         text="Tab Two"
         effect={{"effectType":"setUIKey","value":"2","key":"tab2"}}
         >
      </Tab>
    </TabBar>
    <Spacing
       top="s"
       right="s"
       bottom="s"
       left="s"
    >
        <IfUIKey
           storeType="UIKey"
           key="tab2"
           value="1"
        >
        <svelte:fragment slot="iftrue">
          <StaticText
             text="Some more"
          >
          </StaticText>
        </svelte:fragment>
        <svelte:fragment slot="else">
        </svelte:fragment>
        </IfUIKey>
        <IfUIKey
           storeType="UIKey"
           key="tab2"
           value="2"
        >
        <svelte:fragment slot="iftrue">
          <StaticText
             text="Also this"
          >
          </StaticText>
        </svelte:fragment>
        <svelte:fragment slot="else">
        </svelte:fragment>
        </IfUIKey>
    </Spacing>
</AppBase>
