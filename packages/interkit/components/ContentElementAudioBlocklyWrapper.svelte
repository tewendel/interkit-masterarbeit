<script>
  import ContentElementAudio from './ContentElementAudio.svelte';

  export let element;

  export let titleColumn
  export let audioColumn
  export let descriptionColumn
  export let imageColumn
  export let locationColumn
  export let minDistanceColumn
  export let categoryRefColumn
  export let categoryOrderColumn
  export let shortDescriptionColumn
  export let useBookmarks = "TRUE";

  //console.log("shortDescriptionColumn", shortDescriptionColumn)

  const elementColumns = {
    titleColumn,
    descriptionColumn,
    shortDescriptionColumn,
    audioColumn,
    imageColumn,
    categoryRefColumn: [categoryRefColumn], 
    categoryOrderColumn: [categoryOrderColumn],
    locationColumn,
    minDistanceColumn
  }

  export let categoryTitleColumn;
  export let categorySubtitleColumn;
  
  const categoryColumns = [{
    titleColumn: categoryTitleColumn,
    subtitleColumn: categorySubtitleColumn
  }]

</script>

<ContentElementAudio
  {element}
  {elementColumns}
  {categoryColumns}
  categoryIndex={0}
  {useBookmarks}
/>