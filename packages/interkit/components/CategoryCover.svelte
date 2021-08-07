<script>
  import { util } from '../'
  import MediaFileImage from './MediaFileImage.svelte'
  import MarkdownContent from './MarkdownContent.svelte'

  export let categoryRow;
  export let titleColumn;
  export let imageColumn;
  export let descriptionColumn;

</script>


<section class="CategoryCover .container">
  <figure class="CategoryCover__Picture picture">
    <MediaFileImage mediafileRef={util.rowVal(categoryRow, imageColumn)} />    
  </figure>
  <div class="CategoryCover__Content content">
    <h3 class="CategoryCover__Title title">
      {util.rowVal(categoryRow, titleColumn)}
    </h3>
    <p class="CategoryCover__Description description">
      <MarkdownContent content={util.rowValString(categoryRow, descriptionColumn)} />
    </p>
    <div class="CategoryCover__Button">Erkunden</div>
  </div>
</section>

<style>
  /* elements */

  .content {
    padding: 16px;
  }

  .description {
    margin-top: 8px;
  }

  .CategoryCover__Button {
    display: none;
  }

</style>