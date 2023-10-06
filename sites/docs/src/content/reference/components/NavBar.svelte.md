<script>
  import ComponentInfoYaml from "../../../components/ComponentInfoYaml.svelte";
  import Figma from "../../../components/Figma.svelte";
  
</script>

# NavBar

![A NavBar example](/images/component_previews/NavBar.png)

Used as a container to build a navigation bar at the bottom of the screen. Use one of the layout [Shells](/reference/components/Shell) to position the NavBar. Add [NavButton](/reference/components/NavBar#navbutton) components to setup the individual buttons. 

<ComponentInfoYaml component="NavBar" />

## NavButton

![A NavButton example](/images/component_previews/NavButton.png)

To add functionality, you need to configure the NavButton's effect, for example to open a [Route](/reference/components/Route). The NavButton will be automaticaly highlighted when a route is opened. When using [Icons](/reference/components/Icon), make sure to use the `Thin-` version (the `Full-`) version is used when highlighted.

<ComponentInfoYaml component="NavButton" />

## Figma

<Figma url="https://www.figma.com/file/7y5c91AmKjRnfsnglX7yAD/Interkit-App-Interface?type=design&node-id=6496-54026&mode=design&t=u6n8efKF8M4gc5UV-4"/>