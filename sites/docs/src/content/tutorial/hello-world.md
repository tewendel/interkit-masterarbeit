<script>
  import TemplateLoader from "../../components/TemplateLoader.svelte";
</script>

## Hello World

This is the first project in the tutorial. This template renders static text to the screen. 

<TemplateLoader slug="hello-world"/>

#### Which parts of the system were used

This template was created entirely using basic components in the **App** section. You can navigate there by selecting the App tab at the top of the screen.

#### Techniques demonstrated

- The **AppBase** component ist the starting point for all interkit apps and needs to be the outermost component you add.

- The **Spacing** component helps you add whitespace around content.

- The **TextFormat** component allows you to select predefined text formats for your text.

- Use **StaticText** to show text on the screen. Static means that the text should not change frequently.

#### Next Steps

- Modify the content by changing it in the StaticText block.

- Change the spacing around the content by playing with the settings on the Spacing block.

- Change the text format by playing with the settings in the TextFormat block.

- Add new StaticText components from the component sidebar. 

- Right click to duplicate and delete component blocks.

- Change the order of components by dragging.

- Remove the Spacing block and see what happens. Put it back.


#### Advanced

You can change the content of this help screen for your project by editing the **project.md** file in the project repository. Use the more/project and the cloudcmd tab.