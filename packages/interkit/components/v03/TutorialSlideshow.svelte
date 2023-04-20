<script>

  import { onMount, onDestroy } from 'svelte'
  import { InterkitClient, util } from '../'
  import { executeTrigger } from '../actions'
  import MultiStepContent from './MultiStepContent.svelte'

  export let completeTrigger;

  export let imageColumn;
  export let backgroundImageColumn;
  export let titleColumn;
  export let contentColumn;
  export let orderColumn;
  export let superTitle = 'Anleitung';

  let slides;
  let slideUnsubscribe;
  
  const initSlides = async ()=> {
      // setup the subscription to the tip rows
      const columnMap = {
        fgimage: imageColumn,
        bgimage: backgroundImageColumn,
        title: titleColumn,
        content: contentColumn,
        orderColumn
      }

      const slideStore = await InterkitClient.getRowSubStore(titleColumn, columnMap);
      
      // filter tips for targetElement and sort by order column
      slideUnsubscribe = slideStore.subscribe((data) => {
        slides = data.sort((a, b) => a.orderColumn - b.orderColumn)  
        console.log(slides);
      });
  }

  const onClose = () => {
    executeTrigger(completeTrigger)
  }

  onMount(async ()=>{
    await initSlides();
  })
  onDestroy(()=>{
    if(slideUnsubscribe) slideUnsubscribe();
  })

</script>

<div class="container TutorialSlideshow">

  <h1 class="title">{superTitle}</h1>

  <div class="content">
    <MultiStepContent
      {slides}
      onClose = {completeTrigger ? onClose : null}
    />
  </div>

</div>


<style>

  .container {
    width: 100%;
    background-color: white;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .title {
    font-size: calc(1.25 * var(--font-size-headline-1));
    padding: calc(1.25 * var(--font-size-headline-1)) 0;
    line-height: 1;
    flex-grow: 0;
    text-align: center;
  }

  .content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    padding: var(--distance-m);
    box-sizing: border-box;
    position: relative;
  }

  /* TODO remove these hacky selectors */

  :global(.Subsection.help) .container {
    min-height: auto;
    position: relative;
    overflow: hidden;
  }

  :global(.Subsection.help) .title {
    display: none;
  }
  
</style>
