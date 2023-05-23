<script>
  import { setContext } from "svelte";
  import { writable } from 'svelte/store';

  export let boardId;
  const boardIdStore = writable(boardId) // store to hold just the data for the board we want
  setContext("board", boardIdStore) // put that store in a board context

</script>

<slot></slot>