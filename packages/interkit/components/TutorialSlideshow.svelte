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

  <MultiStepContent
    {slides}
    onClose = {completeTrigger ? onClose : null}
  />

</div>


<style>

  .container {
    width: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    min-height: 100vh;
  }

  :global(.Subsection.help) .container {
    min-height: auto;
    position: relative;
    overflow: hidden;
    padding-top: var(--distance-l);
  }
  
</style>
