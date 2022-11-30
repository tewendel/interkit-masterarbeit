<script>
  import ComponentInfo from "../../components/ComponentInfo.svelte";
  import src from "../../../../../packages/interkit/components/BottomMenu.svelte?raw";
</script>

# BottomMenu

The BottomMenu is often used as the main navigation for apps.

![Example](/images/BottomMenuExample.png)

Here's the BottomMenu in the context of an interkit app:

![Example](/images/BottomMenuExampleContext.png)

## How to Build

Use the `BottomMenu` component together with `BottomMenuPage` and `BottomMenuButton` to construct a row of buttons on the bottom that select different screens.

Arrange the components in the following way. This is an example with two buttons and two pages.

- BottomMenu
  - pages
    - BottomMenuPage
      - TopNavBarCustom
    - BottomMenuPage
      - TopNavBarCustom
  - buttons
    - BottomMenuButton
      - defaultIcon: Icon
      - selectedIcon: Icon
    - BottomMenuButton
      - defaultIcon: Icon
      - selectedIcon: Icon

![Pages](/images/bottomMenuPages.png)
![Buttons](/images/bottomMenuButtons.png)

## Important Tips

- the key prop on `BottomMenuButton` needs to be set to a unique key for each button for it to work
- currently only works correctly if you put `TopNavBarCustom` in the `BottomMenuPage`

```docs
../../../../../packages/interkit/components/BottomMenu.svelte
```

<ComponentInfo code={src} />
