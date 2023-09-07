<script>
  import ComponentInfoYaml from "../../components/ComponentInfoYaml.svelte";
</script>

# AudioPlayer

![A AudioPlayer example](/images/component_previews/AudioPlayer.png)

A floating audio player, that is intended to be placed above a NavBar in [LayoutShellAudio](/components/Shell#layoutshellaudio).

The player can be expanded to show additional content about the audio being played.

To keep the player visible across [Routes](/components/Route), you can set it up in a group and use [GroupConnector](/components/Group).

<ComponentInfoYaml component="AudioPlayer" />

## PopoutAudioButton

![A PopoutAudioButton example](/images/component_previews/PopoutAudioButton.png)

Use this button to open the floating audio player.

The data for the floating audio player needs to be loaded here, for example by placing a [DataLoaderSingle](/components/DataLoader#dataloadersingle) around the button.

<ComponentInfoYaml component="PopoutAudioButton" />

## InlineAudioButton

![A InlineAudioButton example](/images/component_previews/InlineAudioButton.png)

In some cases, the floating player is unnecessary. InlineAudioButton plays an audio file directly inside the button. 

Load data by placing a [DataLoaderSingle](/components/DataLoader#dataloadersingle) or equivalent around the button.

<ComponentInfoYaml component="InlineAudioButton" />
