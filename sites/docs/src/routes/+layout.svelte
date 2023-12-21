<script>

import { Layout } from 'interkit-websitetools'

import { onMount } from 'svelte'

import { setupHistory } from "$lib/iframed.js"

import { items } from "../content/structure.json.js"
import { links } from '../content/links.js'

import 'prismjs/themes/prism.css'

setupHistory()

</script>

<Layout
  {items}
  {links}
  {onMount}
  >
  <slot />
</Layout>
