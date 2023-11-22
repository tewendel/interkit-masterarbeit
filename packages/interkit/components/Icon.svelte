<script>
  import Full_AR            from "./icons/Full/AR.svg"
  import Full_Archiv        from "./icons/Full/Archiv.svg"
  import Full_Bookmark      from "./icons/Full/Bookmark.svg"
  import Full_Camera        from "./icons/Full/Camera.svg"
  import Full_Chat          from "./icons/Full/Chat.svg"
  import Full_Check         from "./icons/Full/Check.svg"
  import Full_Close         from "./icons/Full/Close.svg"
  import Full_Close_Circle  from "./icons/Full/Close-Circle.svg"
  import Full_Copy          from "./icons/Full/Copy.svg"
  import Full_Dashboard     from "./icons/Full/Dashboard.svg"
  import Full_Date          from "./icons/Full/Date.svg"
  import Full_Drag          from "./icons/Full/Drag.svg"
  import Full_FullScreen    from "./icons/Full/FullScreen.svg"
  import Full_GroupChat     from "./icons/Full/GroupChat.svg"
  import Full_Help          from "./icons/Full/Help.svg"
  import Full_Layer         from "./icons/Full/Layer.svg"
  import Full_List          from "./icons/Full/List.svg"
  import Full_Location      from "./icons/Full/Location.svg"
  import Full_Map           from "./icons/Full/Map.svg"
  import Full_Menu          from "./icons/Full/Menu.svg"
  import Full_Microphone    from "./icons/Full/Microphone.svg"
  import Full_More_1        from "./icons/Full/More-1.svg"
  import Full_More          from "./icons/Full/More.svg"
  import Full_Pause         from "./icons/Full/Pause.svg"
  import Full_Phaenomen     from "./icons/Full/Phaenomen.svg"
  import Full_Play          from "./icons/Full/Play.svg"
  import Full_QR_Scan       from "./icons/Full/QR-Scan.svg"
  import Full_Send          from "./icons/Full/Send.svg"
  import Full_Settings      from "./icons/Full/Settings.svg"
  import Full_SingleChat    from "./icons/Full/SingleChat.svg"
  import Full_Social        from "./icons/Full/Social.svg"
  import Full_Splitscreen   from "./icons/Full/Splitscreen.svg"
  import Full_Warning       from "./icons/Full/Warning.svg"
  import Full_to_Gallery    from "./icons/Full/to_Gallery.svg"
  import Thin_AR            from "./icons/Thin/AR.svg"
  import Thin_Archiv        from "./icons/Thin/Archiv.svg"
  import Thin_Arrow_Left    from "./icons/Thin/Arrow-Left.svg"
  import Thin_Arrow_Right   from "./icons/Thin/Arrow-Right.svg"
  import Thin_Bookmark      from "./icons/Thin/Bookmark.svg"
  import Thin_Camera        from "./icons/Thin/Camera.svg"
  import Thin_Chat          from "./icons/Thin/Chat.svg"
  import Thin_Check         from "./icons/Thin/Check.svg"
  import Thin_Chevron_Down  from "./icons/Thin/Chevron-Down.svg"
  import Thin_Chevron_Up    from "./icons/Thin/Chevron-Up.svg"
  import Thin_Close_Circle  from "./icons/Thin/Close-Circle.svg"
  import Thin_Close         from "./icons/Thin/Close.svg"
  import Thin_Copy          from "./icons/Thin/Copy.svg"
  import Thin_Dashboard     from "./icons/Thin/Dashboard.svg"
  import Thin_Dropdown_Up   from "./icons/Thin/Dropdown-Up.svg"
  import Thin_Dropdown      from "./icons/Thin/Dropdown.svg"
  import Thin_Filter        from "./icons/Thin/Filter.svg"
  import Thin_Forward_15    from "./icons/Thin/Forward-15.svg"
  import Thin_FullScreen    from "./icons/Thin/FullScreen.svg"
  import Thin_Help          from "./icons/Thin/Help.svg"
  import Thin_Hint          from "./icons/Thin/Hint.svg"
  import Thin_Layer         from "./icons/Thin/Layer.svg"
  import Thin_Location      from "./icons/Thin/Location.svg"
  import Thin_Map           from "./icons/Thin/Map.svg"
  import Thin_Menu          from "./icons/Thin/Menu.svg"
  import Thin_Microphone    from "./icons/Thin/Microphone.svg"
  import Thin_Minus         from "./icons/Thin/Minus.svg"
  import Thin_Pause         from "./icons/Thin/Pause.svg"
  import Thin_Phaenomen     from "./icons/Thin/Phaenomen.svg"
  import Thin_Play          from "./icons/Thin/Play.svg"
  import Thin_Plus          from "./icons/Thin/Plus.svg"
  import Thin_Position      from "./icons/Thin/Position.svg"
  import Thin_QR_Scan       from "./icons/Thin/QR-Scan.svg"
  import Thin_Replay_30     from "./icons/Thin/Replay-30.svg"
  import Thin_Settings      from "./icons/Thin/Settings.svg"
  import Thin_Social        from "./icons/Thin/Social.svg"
  import Thin_to_Gallery    from "./icons/Thin/to_Gallery.svg"
  import Thin_zoom_In       from "./icons/Thin/zoom-In.svg"

  import { getContext } from 'svelte';
  import { useLocation } from "svelte-navigator";
  import { InterkitClient } from "../"

  const config = InterkitClient.config
	const location = useLocation();
	
  export let type
  export let height = "1.5rem"
  export let inverse = false

  const iconHeightOverride = getContext("iconHeight")
  if (iconHeightOverride) height = iconHeightOverride

  let activeType = type;
  const iconFullOverride = getContext("iconFull")
  $: {
    if($iconFullOverride)
      activeType = type.replace("Thin", "Full")
    else 
      activeType = type
  }

  // convert icon type to url
  $: iconUrl = eval(activeType.replace("-", "_"))


  if (typeof inverse == "string") inverse = inverse === "TRUE" // blockly conversion

  const buttonContext = getContext("button");
  //console.log("buttonContext", buttonContext);
  
</script>


<span
  on:click
  class={`Icon icon icon-${activeType}`}
  class:inverse
  class:Icon--inverse={inverse}
  class:theme={$config?.INTERKIT_APP_LOAD_THEME}
  style={`--height: ${height}; --icon-url: url(${iconUrl})`}
  >
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
    flex-shrink: 0;
    background-image: var(--icon-url);
  }

  /* helpers */

  .icon.inverse           { filter: invert(1) }

  /* legacy icons */

  
  .icon-arrow-up {
    background-image: url("./icons/Thin/Chevron-Up.svg");
  }

  .icon-arrow-down {
    background-image: url("./icons/Thin/Chevron-Down.svg");
  }

  .icon-arrow-left {
    background-image: url("./icons/Thin/Arrow-Left.svg");
  }

  .icon-arrow-right {
    background-image: url("./icons/Thin/Arrow-Right.svg");
  }


</style>
