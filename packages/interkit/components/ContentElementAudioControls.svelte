<script>

import { InterkitClient, util } from '../'

import AudioPlayButton from './AudioPlayButton.svelte'
import Button from './Button.svelte'
import BookmarkToggle from './BookmarkToggle.svelte'
  
export let element;
export let elementColumns;
export let categoryColumns;
export let categoryRow;
export let categoryIndex;
export let playing;
export let size;
export let duration;
export let useBookmarks;
export let play;
export let onOpenMap;

const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")
const audioPlayerElement = InterkitClient.getGlobalStore("audioPlayerElement")

const mapFocus = InterkitClient.getGlobalStore("mapFocus")
const openMapTo = (element) => {
  InterkitClient.callGlobalMethod("menuSwitcherTarget")
  mapFocus.set(element);
  if(typeof onOpenMap == "function") onOpenMap();
}

const userPositionStore = InterkitClient.getGlobalStore("userPosition");
let distanceMeters;
let distance = "";

const calculateDistance = (userPosition) => {
  let elementPosition = util.rowVal(element, elementColumns.locationColumn);
  distanceMeters = util.getDistance(elementPosition, userPosition)
  if(distanceMeters) {
    distance = util.formatDistance(distanceMeters)
  }
}

$: {
  calculateDistance($userPositionStore)
}


</script>

<div class="ContentElementAudio__Controls controls">
    {#if play && util.rowVal(element, elementColumns.audioColumn)}
      <span class="ContentElementAudio__Play play">
        <AudioPlayButton
          {playing}
          onTap={()=>{if(size!="xs") play()}}
          paused={$audioPlayerStatus?.paused}
          loading={$audioPlayerStatus?.loading}
        />
        <span class="ContentElementAudio__Duration">{util.formatDuration(duration)}</span>
      </span>
    {/if}

    {#if util.rowVal(element, elementColumns.locationColumn)}
    <span class="ContentElementAudio__Distance distance" on:click|stopPropagation={()=>{openMapTo(element)}}>
      <Button>
        {distance}
      </Button>
    </span>
    {/if}

    {#if useBookmarks == "TRUE" && !util.rowVal(categoryRow, categoryColumns[categoryIndex].unlistedColumn)}
      <span class="ContentElementAudio__Bookmark bookmark">
        <Button>
          <BookmarkToggle elementKey={element?.key}/>
        </Button>
      </span>      
    {/if}
  
  </div>


<style>
    /* Controls Layout */

  .controls {
    display: flex;
    padding: 8px;
  }

  .controls > *:not(:first-child) {
    margin-left: 8px;
  }
  .play {
    flex: 1;
  }

  .play {
    height: 2em;
    line-height: 2em;
  }

  .play span {
    vertical-align: middle;
  }

</style>