<script>

  import { links } from '../content/links.js'

</script>

{#each links as link}
  <li>
    <a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
  </li>
{/each}
