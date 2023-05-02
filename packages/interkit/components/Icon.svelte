<script>
  import { getContext } from 'svelte';

  export let type
  export let height = "25px"
  export let inverse = false

  const iconHeightOverride = getContext("iconHeight")

  if (iconHeightOverride) height = iconHeightOverride

  if (typeof inverse == "string") inverse = inverse === "TRUE" // blockly conversion

</script>

<span on:click class:inverse class={`icon icon-${type}`} style={`--height: ${height};`}>
  <slot />
</span>

<style>

  .icon {
    background-repeat: no-repeat;
    background-size: var(--height);
    background-position: center;
    color: transparent;
    border: none;
    width: var(--height);
    height: var(--height);
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;   
    -ms-user-select: none;    
    user-select: none;        
    display: inline-flex;
  }

  /* helpers */

  .icon.inverse           { filter: invert(1) }

  /* figma import Full/ */
  
  .icon-Full-AR           { background-image: url("./icons/Full/AR.svg"); }
  .icon-Full-Archiv       { background-image: url("./icons/Full/Archiv.svg"); }
  .icon-Full-Bookmark     { background-image: url("./icons/Full/Bookmark.svg"); }
  .icon-Full-Camera       { background-image: url("./icons/Full/Camera.svg"); }
  .icon-Full-Chat         { background-image: url("./icons/Full/Chat.svg"); }
  .icon-Full-Check        { background-image: url("./icons/Full/Check.svg"); }
  .icon-Full-Close-Circle { background-image: url("./icons/Full/Close-Circle.svg"); }
  .icon-Full-Copy         { background-image: url("./icons/Full/Copy.svg"); }
  .icon-Full-Dashboard    { background-image: url("./icons/Full/Dashboard.svg"); }
  .icon-Full-Date         { background-image: url("./icons/Full/Date.svg"); }
  .icon-Full-Drag         { background-image: url("./icons/Full/Drag.svg"); }
  .icon-Full-FullScreen   { background-image: url("./icons/Full/FullScreen.svg"); }
  .icon-Full-GroupChat    { background-image: url("./icons/Full/GroupChat.svg"); }
  .icon-Full-Help         { background-image: url("./icons/Full/Help.svg"); }
  .icon-Full-Layer        { background-image: url("./icons/Full/Layer.svg"); }
  .icon-Full-List         { background-image: url("./icons/Full/List.svg"); }
  .icon-Full-Location     { background-image: url("./icons/Full/Location.svg"); }
  .icon-Full-Map          { background-image: url("./icons/Full/Map.svg"); }
  .icon-Full-Menu         { background-image: url("./icons/Full/Menu.svg"); }
  .icon-Full-Microphone   { background-image: url("./icons/Full/Microphone.svg"); }
  .icon-Full-More-1       { background-image: url("./icons/Full/More-1.svg"); }
  .icon-Full-More         { background-image: url("./icons/Full/More.svg"); }
  .icon-Full-Pause        { background-image: url("./icons/Full/Pause.svg"); }
  .icon-Full-Phaenomen    { background-image: url("./icons/Full/Phaenomen.svg"); }
  .icon-Full-Play         { background-image: url("./icons/Full/Play.svg"); }
  .icon-Full-QR-Scan      { background-image: url("./icons/Full/QR-Scan.svg"); }
  .icon-Full-Send         { background-image: url("./icons/Full/Send.svg"); }
  .icon-Full-Settings     { background-image: url("./icons/Full/Settings.svg"); }
  .icon-Full-SingleChat   { background-image: url("./icons/Full/SingleChat.svg"); }
  .icon-Full-Social       { background-image: url("./icons/Full/Social.svg"); }
  .icon-Full-Splitscreen  { background-image: url("./icons/Full/Splitscreen.svg"); }
  .icon-Full-Warning      { background-image: url("./icons/Full/Warning.svg"); }
  .icon-Full-to_Gallery   { background-image: url("./icons/Full/to_Gallery.svg"); }
  

  /* figma import Thin/ */

  
  .icon-Thin-AR           { background-image: url("./icons/Thin/AR.svg"); }
  .icon-Thin-Archiv       { background-image: url("./icons/Thin/Archiv.svg"); }
  .icon-Thin-Arrow-Left   { background-image: url("./icons/Thin/Arrow-Left.svg"); }
  .icon-Thin-Arrow-Right  { background-image: url("./icons/Thin/Arrow-Right.svg"); }
  .icon-Thin-Bookmark     { background-image: url("./icons/Thin/Bookmark.svg"); }
  .icon-Thin-Camera       { background-image: url("./icons/Thin/Camera.svg"); }
  .icon-Thin-Chat         { background-image: url("./icons/Thin/Chat.svg"); }
  .icon-Thin-Check        { background-image: url("./icons/Thin/Check.svg"); }
  .icon-Thin-Close-Circle { background-image: url("./icons/Thin/Close-Circle.svg"); }
  .icon-Thin-Close        { background-image: url("./icons/Thin/Close.svg"); }
  .icon-Thin-Copy         { background-image: url("./icons/Thin/Copy.svg"); }
  .icon-Thin-Dashboard    { background-image: url("./icons/Thin/Dashboard.svg"); }
  .icon-Thin-Dropdown-Up  { background-image: url("./icons/Thin/Dropdown-Up.svg"); }
  .icon-Thin-Dropdown     { background-image: url("./icons/Thin/Dropdown.svg"); }
  .icon-Thin-Filter       { background-image: url("./icons/Thin/Filter.svg"); }
  .icon-Thin-Forward-15   { background-image: url("./icons/Thin/Forward-15.svg"); }
  .icon-Thin-FullScreen   { background-image: url("./icons/Thin/FullScreen.svg"); }
  .icon-Thin-Hint         { background-image: url("./icons/Thin/Hint.svg"); }
  .icon-Thin-Layer        { background-image: url("./icons/Thin/Layer.svg"); }
  .icon-Thin-Location     { background-image: url("./icons/Thin/Location.svg"); }
  .icon-Thin-Map          { background-image: url("./icons/Thin/Map.svg"); }
  .icon-Thin-Menu         { background-image: url("./icons/Thin/Menu.svg"); }
  .icon-Thin-Microphone   { background-image: url("./icons/Thin/Microphone.svg"); }
  .icon-Thin-Minus        { background-image: url("./icons/Thin/Minus.svg"); }
  .icon-Thin-Pause        { background-image: url("./icons/Thin/Pause.svg"); }
  .icon-Thin-Phaenomen    { background-image: url("./icons/Thin/Phaenomen.svg"); }
  .icon-Thin-Play         { background-image: url("./icons/Thin/Play.svg"); }
  .icon-Thin-Plus         { background-image: url("./icons/Thin/Plus.svg"); }
  .icon-Thin-Position     { background-image: url("./icons/Thin/Position.svg"); }
  .icon-Thin-QR-Scan      { background-image: url("./icons/Thin/QR-Scan.svg"); }
  .icon-Thin-Replay-30    { background-image: url("./icons/Thin/Replay-30.svg"); }
  .icon-Thin-Settings     { background-image: url("./icons/Thin/Settings.svg"); }
  .icon-Thin-Social       { background-image: url("./icons/Thin/Social.svg"); }
  .icon-Thin-to_Gallery   { background-image: url("./icons/Thin/to_Gallery.svg"); }
  .icon-Thin-zoom-In      { background-image: url("./icons/Thin/zoom-In.svg"); }
  

  /* legacy icons */

  
  .icon-arrow-up {
    background-image: url("./icons/Arrow-Up.svg");
  }

  .icon-arrow-down {
    background-image: url("./icons/Arrow-Down.svg");
  }

  .icon-arrow-left {
    background-image: url("./icons/Arrow-Left.svg");
  }

  .icon-arrow-right {
    background-image: url("./icons/Arrow-Right.svg");
  }

  .icon-close {
    background-image: url("./icons/Close.svg");
  }

  .icon-play {
    background-image: url("./icons/Play.svg");
  }

  .icon-pause {
    background-image: url("./icons/Pause.svg");
  }

  .icon-settings {
    background-image: url("./icons/Settings.svg");
  }

  .icon-plus {
    background-image: url("./icons/Plus.svg");
  }
  .icon-minus {
    background-image: url("./icons/Minus.svg");
  }

  .icon-position {
    background-image: url("./icons/Position.svg");
  }

  .icon-location {
    background-image: url("./icons/Location.svg");
  }

  .icon-layer {
    background-image: url("./icons/Layer.svg");
  }

  .icon-filter {
    background-image: url("./icons/Filter.svg");
  }

  .icon-skip-forward {
    background-image: url("./icons/forward_10.svg");
  }

  .icon-skip-backward {
    background-image: url("./icons/replay_30.svg");
  }

  .icon-qr-scan {
    background-image: url("./icons/QR-Scan.svg");
  }

  .icon-qr-scan-thin {
    background-image: url("./icons/QR-Scan-Thin.svg");
  }

  .icon-hint {
    background-image: url("./icons/Hint.svg");
  }

  .icon-help {
    background-image: url("./icons/Help.svg");
  }

  .icon-archive {
    background-image: url("./icons/Archiv.svg");
  }

  .icon-archive-full {
    background-image: url("./icons/full/Archiv.svg");
  }

  .icon-dashboard {
    background-image: url("./icons/Dashboard.svg"); 
  }

  .icon-dashboard-full {
    background-image: url("./icons/full/Dashboard.svg");  
  }

  .icon-map {
    background-image: url("./icons/Map.svg"); 
  }

  .icon-map-full {
    background-image: url("./icons/full/Map.svg"); 
  }

  .icon-ar {
    background-image: url("./icons/AR.svg"); 
  }

  .icon-check {
    background-image: url("./icons/Check-Thin.svg"); 
  }

  .icon-copy {
    background-image: url("./icons/full/Copy.svg"); 
  }

  .icon-hamburger-full {
    background-image: url("./icons/full/Menu.svg"); 
  }

  .icon-full-screen-thin {
    background-image: url("./icons/Full-Screen-Thin.svg");
  }

  .icon-full-screen-full {
    background-image: url("./icons/Full-Screen-Full.svg");
  }

</style>
