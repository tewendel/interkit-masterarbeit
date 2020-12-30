<script>
import { onMount } from 'svelte';

import { db } from 'interkit-helpers';
import { DynContent } from 'DynContent.svelte'

import { content_store } from './stores.js';


/*interkit:editable:string*/
const headline = "foo bar"

let content = "loading..."
onMount(async () => {
  content = await db.load("content")
});

</script>

<h1>{headline}</h1>

<p>{content}</p>

<p><DynContent key="content"/></p>

<p>{$content_store}</p>

<style>

body: {
  /*interkit:editable:color*/
  color: #fff
}

</style>




