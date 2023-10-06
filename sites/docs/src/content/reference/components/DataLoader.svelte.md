<script>
  import ComponentInfoYaml from "../../../components/ComponentInfoYaml.svelte";
</script>

# DataLoaders

These components are needed to load data from the Database and provide them to child components.

## DataLoaderSingle

Use this DataLoaderSingle to load a single row from a sheet. 

Common child components are [DataCell](/reference/components/DataCell) or [DataCard](/reference/components/DataCard)

<ComponentInfoYaml component="DataLoaderSingle" />

<details>
<summary>Developer docs</summary>

```docs
../../../../../../packages/interkit/components/DataLoaderSingle.svelte
```

</details>

## DataLoaderMulti

User DataLoaderMulti to load multiple rows from a sheet. 

Common child components are [DataList](/reference/components/DataList) or [DataCarousel](/reference/components/DataList#datacarousel)

<ComponentInfoYaml component="DataLoaderMulti" />

<details>
<summary>Developer docs</summary>

```docs
../../../../../../packages/interkit/components/DataLoaderMulti.svelte
```

</details>

