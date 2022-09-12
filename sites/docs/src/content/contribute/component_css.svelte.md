# Component CSS Style Guide

CSS classes in interkit components should follow this style:

- There are 2 addressing schemes
  - one for internal use for the component editor
  - one for external use to write optional stylesheets for existing components

## internal classes

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

## External classes

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

## Combination

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