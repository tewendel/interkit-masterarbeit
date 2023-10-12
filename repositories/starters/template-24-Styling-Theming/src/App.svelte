<script>
import initActions from "./actions.js";
import { t, translations, lang } from 'interkit/i18n.js';
import AppBase from "interkit/components/AppBase.svelte";
import Button from "interkit/components/Button.svelte";
import DataCard from "interkit/components/DataCard.svelte";
import DataCell from "interkit/components/DataCell.svelte";
import DataLoaderSingle from "interkit/components/DataLoaderSingle.svelte";
import Icon from "interkit/components/Icon.svelte";
import ScrollContainer from "interkit/components/ScrollContainer.svelte";
import SectionShell from "interkit/components/SectionShell.svelte";
import Spacing from "interkit/components/Spacing.svelte";
import StaticText from "interkit/components/StaticText.svelte";
import Styling from "interkit/components/Styling.svelte";
import styleTokens from "./styleTokens.json";
globalThis.styleTokens = styleTokens;
console.log('AppBase styleTokens', styleTokens);
initActions();
$: $translations, translations, t, $lang, lang, console.log('AppBase i18n $', { t, $translations, translations, $lang, lang });
console.log('AppBase i18n', { t, $translations, translations, $lang, lang });
</script>

<AppBase
   >
  <ScrollContainer
  >
    <SectionShell
    >
      <DataLoaderSingle
         sheet="elements"
         rowKey="e52cedf4-e9e4-4f68-a8ac-715142255ed7"
         >
        <DataCard
           variant="large"
              effect={undefined}
           imageColumn="elements/image"
           headlineColumn="elements/headline"
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
          <DataCell
             column="elements/baf94630-202a-4a9c-a680-e5ec099fa7ba"
             format="richText"
             inline={true}
             centerContent={false}
          >
          </DataCell>
        </svelte:fragment>
        </DataCard>
      </DataLoaderSingle>
    </SectionShell>
    <Spacing
       top="m"
       right="m"
       bottom="m"
       left="m"
    >
      <Button
         text="Hover me"
         type="primary"
         size="medium"
         flex="normal"
            effect={undefined}
      >
        <Icon
           type="Thin-Close-Circle"
           inverse={false}
        >
        </Icon>
      </Button>
    </Spacing>
    <Spacing
       top="none"
       right="m"
       bottom="m"
       left="m"
    >
      <Styling
         styleTokens={{"colorText":"#43ad4a","colorTextStrong":"#000000","colorTextSoft":"#4C4C4C","colorBackground":"#ad5c5c","colorBackgroundHighlight":"#E5E5E5","colorBackgroundBackdrop":"#F2F2F2","colorBorder":"#999999","colorDummyAsset":"#1ddd20","colorTextButtonPressed":"#000000","colorBackgroundButtonPressed":"#B2B2B2","colorTextButtonDanger":"#000000","colorBackgroundButtonDanger":"#FF6A49","colorTextButtonPrimary":"#FFFFFF","colorTextButtonPrimaryPressed":"#FFFFFF","colorBackgroundButtonPrimary":"#000000","colorBackgroundButtonPrimaryPressed":"#000000","colorBorderButtonPrimary":"#000000","colorBorderButtonPrimaryPressed":"#000000","colorBackgroundLabel1":"#B2B2B2","colorTextLabel1":"#000000","colorBackgroundChatMe":"#E5E5E5","colorBackgroundChatOther":"#000000","borderWidth":"1px","borderRadius":"24px","borderRadiusButton":"16px","borderRadiusLabel":"8px","boxShadow":"0px 0px 1px rgba(0, 0, 0, 0.5)","distanceScaleFactor":1}}
      >
        <Button
           text="test"
           type="primary"
           size="medium"
           flex="normal"
              effect={undefined}
        >
          <Icon
             type="Thin-Archiv"
             inverse={false}
          >
          </Icon>
        </Button>
        <StaticText
           text="This section is styled differently using the <Styling> component"
        >
        </StaticText>
      </Styling>
    </Spacing>
  </ScrollContainer>
</AppBase>
