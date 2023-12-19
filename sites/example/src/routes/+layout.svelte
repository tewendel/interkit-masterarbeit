<script>

import { Layout } from 'interkit-websitetools'

import items from "../content/structure.json.js"
import links from '../content/links.js'

</script>

<Layout
  {items}
  {links}
  >
  <slot />
</Layout>
