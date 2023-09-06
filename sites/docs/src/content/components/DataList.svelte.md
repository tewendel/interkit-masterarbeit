<script>
  import ComponentInfoYaml from "../../components/ComponentInfoYaml.svelte";
</script>

# Displaying multiple elements

These components allow you to display multiple rows from the database in different ways. 

In order for them to display data, they need to be children of a [DataLoaderMulti](/components/DataLoaderMulti) oder a [DataRouteMulti](/components/DataRouteMulti).



## DataList

![A DataList example](/images/component_previews/DataList.png)

Show data elements as a list. Use [ScrollContainer](/components/Scrollcontainer) to add scrolling. Commonly used in conjunction with a [DataCard](/components/DataCard).

<ComponentInfoYaml component="DataList" />

<details>
<summary>Developer docs</summary>

```docs
../../../../../packages/interkit/components/DataList.svelte
```

</details>

## DataCarousel

![A DataCarousel example](/images/component_previews/DataCarousel.png)

Show data elements as a carousel that you can slide left and right. Commonly used in conjunction with a [DataCard](/components/DataCard).

<ComponentInfoYaml component="DataCarousel" />

<details>
<summary>Developer docs</summary>

```docs
../../../../../packages/interkit/components/DataCarousel.svelte
```

</details>

## PictureBook

![A PictureBook example](/images/component_previews/PictureBook.png)

Shows images that you can swipe left and right. When an image is swiped, the component provides the data of the selected element to its "contentElement" slot, where you can show additional info, for example using a [DataCell](/components/DataCell).

<ComponentInfoYaml component="PictureBook" />

<details>
<summary>Developer docs</summary>

```docs
../../../../../packages/interkit/components/PictureBook.svelte
```

</details>

## Mosaic

![A Mosaic example](/images/component_previews/Mosaic.png)

Displays a mosaic of images in three columns. Intended to be used with [DataTile](/components/DataTile).

<ComponentInfoYaml component="Mosaic" />

<details>
<summary>Developer docs</summary>

```docs
../../../../../packages/interkit/components/Mosaic.svelte
```

</details>

