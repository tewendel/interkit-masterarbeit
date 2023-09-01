# Component CSS

## Class names & style guide

CSS classes in interkit components should follow this style:

- There are 2 addressing schemes
  - one for internal use for the component editor
  - one for external use to write optional stylesheets for existing components

### internal classes

you are free to use internal classes utilising svelte's scoped css. Example:

```svelte
<script>
  // file name: MyComponent.svelte
  export let type = "default"
  export let selected = true
</script>

<div 
  class="container ${type}"
  class:selected
  >
  <span class="item">
  </span>
</div>

<style>
  .container {}
  .container.selected {}
  .container.default {}
  .item {}
</style>
```

### External classes

External classes roughly follow the BEM system
- the component container should have a class that is the component name, for example `MyContainer`
- classes of children should be prefixed with the component name and `__`, for example `MyContainer__MyChild`
- Variations should be prefixed with `--`

Example:

```svelte
<script>
  // file name: MyComponent.svelte
  export let type = "default"
  export let selected = true
</script>

<div 
  class="MyComponent MyComponent--${type}"
  class:MyComponent--selected={selected}
  >
  <span class="MyComponent__item">
  </span>
</div>
```

External stylesheet example:

```css
  #Theming .MyComponent {}
  #Theming .MyComponent--selected {}
  #Theming .MyComponent--default {}
  #Theming .MyComponent__item {}
```

### Combination

You may combine the internal and external style

```svelte
<script>
  // file name: MyComponent.svelte
  export let type = "default"
  export let selected = true
</script>

<div 
  class="MyComponent MyComponent--${type} container ${type}"
  class:selected
  class:MyComponent--selected={selected}
  >
  <span class="item MyComponent__item">
  </span>
</div>
```

## Spacing & sizing variables

### General scale/size, `rem`s

We use `rem`s almost everywhere.
This way, the complete app UI can be scaled uniformly using the `scale` style token.
While it is exposed as the `--scale` CSS variable,
the main functionality is provided by hooking it into your apps root `<html style="font-size">`.

New components should use `rem`s wherever possible to support this functionality.

Notable exceptions where we don't use `rem`

* `border-width`s of `1px`
* media queries: devices sizes in `px`
* `min-height`s of touch targets in `px` (like Buttons) to guarantee accessibility
* `em`s in certain complex CSS geometrical drawings (e.g. `Chat/MessageTyping`)

### Distances, lengths, margins, paddings

Building on the flexibility of `rem`s,
all distances will be scaled accordingly,
but can also be influenced by more fine-grained factors:

1. `--distance-scale-factor` is the default if nothing else is set.
   A value of `1.0` should have no effect;
   `1.1` should increase all distances by 10%, and so on.
2. `--inset` will affect all *inner distances*
   where direction (horizontal/vertical) doesn't, shouldn't, or mustn't matter.  
   (Like a container's padding which has to play nice with surrounding,
   or embedded border-radiuses.)
3. `--inset-x` and `--inset-y` will affect *inner distances*
   where direction *does* matter.  
   This way, you can affect a Button's vertical (top/bottom) and horizontal (left/right) separately.
4. Similarly, `--outset-x` and `--outset-y` will affect *outer distances*
   where direction does matter.  
   (Like the gap between items in a list.)

The code usually follows this pattern:  
(more on the values of `rem`s below)

```css
.item {
  /* single values */
  margin-bottom: calc(var(--outset-y) * 1rem);
  padding: calc(var(--inset) * 0.5rem);
}
.button {
  /* two values */
  padding:
    calc(var(--inset-y) * 0.25rem)  /* vertical, top&bottom, note the -y */
    calc(var(--inset-x) * 0.25rem); /* horizontal, left&right, note the -x */
}
.foo-card-header {
  /* all four values */
  padding:
    calc(var(--inset-y) * 0.5rem)   /* top, note the y */
    calc(var(--inset-x) * 1rem)     /* right, note the x */
    calc(var(--inset-y) * 1rem)     /* bottom, y*/
    calc(var(--inset-x) * 2rem);    /* left, x */
}
```

### `rem` values, visual rhythm

To keep a harmonious visual appearance that is also easily extensible,
we limit the distances to simple fractions and multiples of our base unit, the `rem`.

|       | decimal         | examples of usage |
| ----- | --------------- | ----------------- |
| ⅛     | `0.125rem`      | tiny distances between |
| ¼     | `0.25rem`       | small inner vertical paddings of Buttons |
| ½     | `0.5rem`        | most inner paddings (inset), small outer margins (outset-y) |
| 1     | `1rem`          | most inner paddings of containers with border-radius |
| 1½    | `1.5rem`        | some larger paddings of "lofty" containers |
| 2, 3… | `2rem`, `3rem`… | large outer margins, small image sizes |

We also use odder values like ⅜=`0.375rem`,
or occasionaly sixteenths (`0.0625rem`, `0.3125rem`) if needed.  
Typography is an art, not a science ;-)

