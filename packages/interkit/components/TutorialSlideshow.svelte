<script>

  import { onMount, onDestroy } from 'svelte'
  import { InterkitClient, util } from '../'
  import { executeTrigger } from '../actions'
  import MultiStepContent from './MultiStepContent.svelte'

  export let mainTitle;
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
      const slideStore = await InterkitClient.getRowSubStore(titleColumn, {
        fgimage: imageColumn,
        bgimage: backgroundImageColumn,
        title: titleColumn,
        content: contentColumn,
        orderColumn
      });
      
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

<div class="container">

  <h1>{mainTitle}</h1>

  <MultiStepContent
    {slides}
    onClose = {completeTrigger ? onClose : null}
  />

</div>


<style>

  .container {
    height: 100%;
    width: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
</style>