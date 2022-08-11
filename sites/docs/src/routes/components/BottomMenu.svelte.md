<script>
  import ComponentInfo from "../../components/ComponentInfo.svelte";
  import src from "../../../../../packages/interkit/components/BottomMenu.svelte?raw";
</script>

# BottomMenu

Use together with `BottomMenuButton` and `BottomMenuPage` to construct a row of buttons on the bottom to select different screens. 

## Overview 

- BottomMenu
  - blocks
    - BottomMenuPage
      - TopNavBarCustom
    - BottomMenuPage
      - TopNavBarCustom
  - buttons
    - BottomMenuButton
      - Icon
      - Icon
    - BottomMenuButton
      - Icon
      - Icon

![Pages](/images/BottomMenuPages.png)
![Buttons](/images/BottomMenuButtons.png)

## Important Tips

- the key prop on `BottomMenuButton` needs to be set to a unique key for each button for it to work
- currently only works correctly if you put `TopNavBarCustom` in the `BottomMenuPage`



```docs
../../packages/interkit/components/BottomMenu.svelte
```

<ComponentInfo code={src} />
