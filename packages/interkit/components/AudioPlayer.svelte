<script context="module">
  import { InterkitClient } from '../'
  let projectId = INTERKIT_PROJECT_ID
  export const playAudio = async (key, title, autoplay=true) => {
    let mediafile = await InterkitClient.call("mediafile.get", {key, projectId})
    console.log(mediafile)
    audioPlayerStatus.set({
      mediafileKey: mediafile.meta.key,
      src: mediafile.link,
      title,
      autoplay
    })
  }

  const audioPlayerStatus = InterkitClient.getGlobalStore("audioPlayerStatus")
</script>

<script>
  const closePlayer = () => {
    audioPlayerStatus.set(null)
  }

</script>

{#if $audioPlayerStatus}

<div class="AudioPlayer container">

  <div class="AudioPlayer__Expand expand">
    <button class="AudioPlayer__Expand__Button icon-expand icon" on:click={()=>alert("expand")} title="Expand">
      expand
    </button>
  </div>

  <h4 class="AudioPlayer__Title title">{$audioPlayerStatus.title}</h4>

  {#key $audioPlayerStatus}
    <audio controls autoplay={$audioPlayerStatus.autoplay}>
      <source src={encodeURI($audioPlayerStatus.src)} type="audio/mpeg">
    </audio>
  {/key}

  <div class="AudioPlayer__Close close">
    <button class="AudioPlayer__Close__Button icon-close icon" on:click={closePlayer} title="Close">
      Close
    </button>
  </div>

</div>

{/if}

<style>

  .container {
    box-sizing: border-box;
    width: 100%;
    background-color: lightgrey;
    border: solid 1px black;
    border-bottom-width: 0;
    padding: 4px;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .container > * {
    margin: 0 4px;
  }

  .expand {}
  .title {
    flex: 1;
    text-overflow: ellipsis;
  }
  .close {}

  .icon {
    background-repeat: no-repeat;
    background-size: 25px;
    background-position: center;
    color: transparent;
    border: none;
    width: 25px;
    height: 25px;
    margin: 0 4px;
    cursor: pointer;
    user-select: none;
  }
  .icon-expand {
    background-image: url("../icons/Arrow-Up.svg");
  }
  .icon-close {
    background-image: url("../icons/Close.svg");
    padding: 0 12px;
  }

</style>