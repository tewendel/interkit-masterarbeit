<script>
import initActions from "./actions.js"; 
initActions(); 
import AppBase from "interkit/components/AppBase.svelte";
import ContentElement from "interkit/components/ContentElement.svelte";
import ElementList from "interkit/components/ElementList.svelte";
import ElementsContextProvider from "interkit/components/ElementsContextProvider.svelte";
import HeadlinePage from "interkit/components/HeadlinePage.svelte";
import ScrollContainer from "interkit/components/ScrollContainer.svelte";
import Span from "interkit/components/Span.svelte";
import Theming from "interkit/components/Theming.svelte";
</script>

<AppBase
>
<svelte:fragment slot="viewport">
  <ElementsContextProvider
     sheetKey="elements"
                 discoverableColumn="elements/discoverable"
     discoverProperty="discovered"
  >
    <ScrollContainer
    >
      <ElementList
         dataSheetKey="elements"
         sortColumn="elements/categoryOrder"
         bookmarkFilter="FALSE"
         hideColumn="elements/hideInArchive"
         >
      <svelte:fragment slot="contentElement" let:element={element}>
          <HeadlinePage
             headline="l"
          >
          </HeadlinePage>
          <ContentElement
             supertextColumn="elements/supertext"
             titleColumn="elements/title"
             shortDescriptionColumn="elements/shortDescription"
             descriptionColumn="elements/description"
             imageColumn="elements/image"
             locationColumn="elements/position"
             size="l"
             {element}
          >
          <svelte:fragment slot="buttons">
          </svelte:fragment>
          </ContentElement>
          <HeadlinePage
             headline="s"
          >
          </HeadlinePage>
          <ContentElement
             supertextColumn="elements/supertext"
             titleColumn="elements/title"
             shortDescriptionColumn="elements/shortDescription"
             descriptionColumn="elements/description"
             imageColumn="elements/image"
             locationColumn="elements/position"
             size="s"
             {element}
          >
          <svelte:fragment slot="buttons">
          </svelte:fragment>
          </ContentElement>
          <HeadlinePage
             headline="xs"
          >
          </HeadlinePage>
          <ContentElement
             supertextColumn="elements/supertext"
             titleColumn="elements/title"
             shortDescriptionColumn="elements/shortDescription"
             descriptionColumn="elements/description"
             imageColumn="elements/image"
             locationColumn="elements/position"
             size="xs"
             {element}
          >
          <svelte:fragment slot="buttons">
          </svelte:fragment>
          </ContentElement>
          <HeadlinePage
             headline="slide"
          >
          </HeadlinePage>
          <ContentElement
             supertextColumn="elements/supertext"
             titleColumn="elements/title"
             shortDescriptionColumn="elements/shortDescription"
             descriptionColumn="elements/description"
             imageColumn="elements/image"
             locationColumn="elements/position"
             size="slide"
             {element}
          >
          <svelte:fragment slot="buttons">
          </svelte:fragment>
          </ContentElement>
      </svelte:fragment>
      <svelte:fragment slot="emptyElement">
        <Span
           text="nothing to see here"
        >
        </Span>
      </svelte:fragment>
      </ElementList>
    </ScrollContainer>
  </ElementsContextProvider>
</svelte:fragment>
<svelte:fragment slot="desktopFallback">
</svelte:fragment>
</AppBase>
<Theming
   cssFile="global.css"
   >
</Theming>
