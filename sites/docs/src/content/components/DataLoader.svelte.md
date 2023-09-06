<script>
  import ComponentInfoYaml from "../../components/ComponentInfoYaml.svelte";
</script>

# DataLoaders

These components are needed to load data from the Database and provide them to child components.

## DataLoaderSingle

Use this DataLoaderSingle to load a single row from a sheet. 

Common child components are [DataCell](/components/DataCell) or [DataCard](/components/DataCard)

<ComponentInfoYaml component="DataLoaderSingle" />

<details>
<summary>Developer docs</summary>

```docs
../../../../../packages/interkit/components/DataLoaderSingle.svelte
```

</details>

## DataLoaderMulti

User DataLoaderMulti to load multiple rows from a sheet. 

Common child components are [DataList](/components/DataList) or [DataCarousel](/components/DataList#datacarousel)

<ComponentInfoYaml component="DataLoaderMulti" />

<details>
<summary>Developer docs</summary>

```docs
../../../../../packages/interkit/components/DataLoaderMulti.svelte
```

</details>

