<script>

  import { InterkitClient } from '../'
  import { get } from "svelte/store"

  import MediaFileImage from "./MediaFileImage.svelte";
import AspectRatio from './AspectRatio.svelte';

  export let imageVar  
  export let topLeftLabel
  export let topLeftVar
  export let topRightLabel
  export let topRightVar
  export let bottomLeftLabel
  export let bottomLeftVar
  export let bottomRightLabel
  export let bottomRightVar

  const projectDataStore = InterkitClient.userProjectDataStore
  $: imageKey = $projectDataStore?.userVars?.[imageVar]
  $: topLeftValue = $projectDataStore?.userVars?.[topLeftVar]
  $: topRightValue = $projectDataStore?.userVars?.[topRightVar]
  $: bottomLeftValue = $projectDataStore?.userVars?.[bottomLeftVar]
  $: bottomRightValue = $projectDataStore?.userVars?.[bottomRightVar]
  
</script>

<div class="UserProfile frame">

  <div class="profile-pic">
    {#if imageKey}
      <AspectRatio aspectRatioType="square">
        <MediaFileImage style="border-radius: var(--border-radius);" fitDimension="both" mediafileRef={{value: imageKey}}/>
      </AspectRatio>
    {:else}
      <div class="image-fallback"></div>
    {/if}
  </div>

  <div class="one">
    <span class="label">{topLeftLabel}</span>
    <span class="value">{typeof topLeftValue != "undefined" ? topLeftValue : ""}</span>
  </div>
  <div class="two">
    <span class="label">{topRightLabel}</span>
    <span class="value">{typeof topRightValue != "undefined" ? topRightValue : ""}</span>
  </div>
  <div class="three">
    <span class="label">{bottomLeftLabel}</span>
    <span class="value">{typeof bottomLeftValue != "undefined" ? bottomLeftValue : ""}</span>
  </div>
  <div class="four">
    <span class="label">{bottomRightLabel}</span>
    <span class="value">{typeof bottomRightValue != "undefined" ? bottomRightValue : ""}</span>
  </div>
  
</div>


<style>

  .frame {
    background-color: #F2F2F2;
    padding: var(--distance-m);
    display: grid;
    grid-template-columns: 112px 1fr 1fr;
  }

  .profile-pic {
    width: 96px;
    height: 96px;
    grid-column: 1;
    grid-row: 1 / 3;
  }

  .image-fallback {
    border-radius: var(--border-radius);
    background-color: #FFDBD3;
    width: 100%;
    height: 100%;
  }
  
  .one {
    grid-column: 2;
    grid-row: 1;
  }

  .two {
    grid-column: 3;
    grid-row: 1;
    text-align: right;
  }

  .three {
    grid-column: 2;
    grid-row: 2;
  }

  .four {
    grid-column: 3;
    grid-row: 2;
    text-align: right;
  }

  .frame .label {
    text-transform: uppercase;
    font: var(--font-overline);
    letter-spacing: var(--letter-spacing-overline);
    display: block;
    margin-bottom: 2px;
  }

  .frame .value {
    font: var(--font-content-headline-5);
    letter-spacing: var(--letter-spacing-headline-5);  
    font-weight: 700;
  }

</style>