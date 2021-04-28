<script>

  import { InterkitClient, util } from '../'
  import { get } from 'svelte/store'
  
  export let elementKey;

  const bookmarkFilter = "bookmarks"
  const bookmarkStore = InterkitClient.getGlobalStore(bookmarkFilter)
  
  const addBookmark = (key) => {
    let bookmarks = get(bookmarkStore)
    console.log(bookmarks, key)
    if(!bookmarks) {
      bookmarks = {}
    }
    if(!bookmarks[key]) {
      bookmarks[key] = true;
    }
    bookmarkStore.set(bookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  
  const removeBookmark = (key) => {
    let bookmarks = get(bookmarkStore)
    if(bookmarks) 
      if(bookmarks[key]) {
        bookmarks[key] = undefined;
      }
    bookmarkStore.set(bookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks)); 
  }

  $: isBookmarked = $bookmarkStore ? $bookmarkStore?.[elementKey] : false
  
  const toggleBookmark = () => {
    if(isBookmarked) 
      removeBookmark(elementKey)
    else
      addBookmark(elementKey)
  }

</script>

<span on:click={toggleBookmark}>
  {#if isBookmarked}
    gemerkt
  {:else}
    merken
  {/if}
</span>

<style>
  span:hover {
    cursor: pointer;
  }
</style>