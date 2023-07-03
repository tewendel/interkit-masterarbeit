<script>

  import { InterkitClient } from '..'
  import { get } from "svelte/store"

  import { getShowDummyDataStore } from './dummyDataHelpers.js'

  import MediaFileImage from "./MediaFileImage.svelte";
  import AspectRatio from './AspectRatio.svelte';
  import UserCardValue from './fragments/UserCardValue.svelte';

  export let imageVar  
  export let topLeftLabel
  export let topLeftVar
  export let topRightLabel
  export let topRightVar
  export let bottomLeftLabel
  export let bottomLeftVar
  export let bottomRightLabel
  export let bottomRightVar

  const showDummyData = getShowDummyDataStore()

  const projectDataStore = InterkitClient.userProjectDataStore
  $: imageKey = $showDummyData ? "key" : $projectDataStore?.userVars?.[imageVar]
  $: topLeftValue = $showDummyData ? "valuelong" : $projectDataStore?.userVars?.[topLeftVar]
  $: topRightValue = $showDummyData ? "valuelonglong" : $projectDataStore?.userVars?.[topRightVar]
  $: bottomLeftValue = $showDummyData ? 0.5 : $projectDataStore?.userVars?.[bottomLeftVar]
  $: bottomRightValue = $showDummyData ? "value" : $projectDataStore?.userVars?.[bottomRightVar]

  if($showDummyData) {
    topLeftLabel = "Label" 
    topRightLabel = "Label"
    bottomLeftLabel = "Label"
    bottomRightLabel = "Label"
  }
  
</script>

<div
  class="UserCard frame"
  class:UserCard--noimage={!imageKey ? true : false}
  class:no-image={!imageKey ? true : false}
  >
  <div class="UserCard__ProfilePic profile-pic">    
    {#if imageKey}
      <AspectRatio aspectRatioType="square">
        <MediaFileImage style="border-radius: var(--border-radius);" fitDimension="both" mediafileRef={{value: imageKey}}/>
      </AspectRatio>
    {/if}
  </div>

  {#if topLeftLabel}<div class="one UserCard__One">
    <UserCardValue label={topLeftLabel} value={topLeftValue}/>
  </div>
  {/if}
  {#if topRightLabel}<div class="two UserCard__Two">
    <UserCardValue label={topRightLabel} value={topRightValue} justifyRight />
  </div>
  {/if}
  {#if bottomLeftLabel}<div class="three UserCard__Three">
    <UserCardValue label={bottomLeftLabel} value={bottomLeftValue}/>
  </div>
  {/if}
  {#if bottomRightLabel}<div class="four UserCard__Four">
    <UserCardValue label={bottomRightLabel} value={bottomRightValue} justifyRight />
  </div>
  {/if}
  
</div>


<style>

  .frame {
    background-color: var(--color-background);
    padding: var(--distance-s);
    padding-right: calc(2 * var(--distance-s));
    display: grid;
    grid-template-columns: 112px 1fr 1fr;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
  }
  
  .frame div {
    min-width: 0;
  }

  .profile-pic {
    width: 96px;
    height: 96px;
    grid-column: 1;
    grid-row: 1 / 3;
  }

  .one {
    grid-column: 2;
    grid-row: 1;
  }

  .two {
    grid-column: 3;
    grid-row: 1;
  }

  .three {
    grid-column: 2;
    grid-row: 2;
  }

  .four {
    grid-column: 3;
    grid-row: 2; 
  }

  .frame.no-image {
    grid-template-columns: 1fr 1fr;
  }

  .frame.no-image .one, .frame.no-image .three {
    grid-column: 1;
  }

  .frame.no-image .two, .frame.no-image .four {
    grid-column: 2;
  }

</style>
