<script>
  import Links from './Links.svelte'
  import { page } from '$app/stores';
  import { getSectionItems, getFirstDeepPath } from '../util/pathUtils'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  
  export let items;

  let sectionItems
  $: currentPath = $page.url.pathname
  $: sectionItems = getSectionItems(currentPath, items)

  const onLoadOpen = items.map(item =>
    $page.url.pathname.startsWith(item.path)
  )
  
</script>

<div class="root">
  <div class="details">
    {#each items as item, itemIndex}
      <details
        open={$page.url.pathname.startsWith(item.path)}
        data-path={item.path}
        data-open={onLoadOpen[itemIndex]}
        >
        <summary><h3>{item.title}</h3></summary>
        <ul>
          {#each item.items as subItem}
            <h4>
              <a
                href={getFirstDeepPath(subItem)}
                on:click={() => dispatch('clicked')}
                >{subItem.title}</a>
            </h4>
            <ul>
              {#each subItem.items as subsubItem}
                <li class:active={currentPath === subsubItem.path}>
                  <a
                    href={getFirstDeepPath(subsubItem)}
                    on:click={() => dispatch('clicked')}
                    >{subsubItem.title}</a>
                </li>
              {/each}
            </ul>
          {/each}
        </ul>
      </details>
    {/each}
    <ul class="links">
      <Links />
    </ul>
  </div>
</div>

<style>

  .root {
    --padding-left: 2rem;
    color: var(--color-text-light);
    position: relative;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }

  .details {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    overflow-y: scroll
  }

  a,
  .links :global(a) {
    color: inherit;
    text-decoration: none;
    display: block;
    padding: 0.25em 1rem 0.25em var(--padding-left);
  }

  a:hover {
    background-color: var(--color-accent-background);
  }

  .active {
    font-weight: var(--font-weight-bold);
    color: var(--color-text-accent);
    background-color: var(--color-accent-background);
  }

  details > summary,
  .links :global(li a) {
    list-style: none;
    cursor: pointer;
    padding: 1em 1rem 1em 2rem;
    border-bottom: var(--border-light);
  }

  summary::-webkit-details-marker,
  summary::marker {
    display: none;
  }
  
  .links :global(li:first-child a) {
    border-top: var(--border-light);
  }

  details[open] > summary {
    /* TODO replace with list-style-image */
    background-repeat: no-repeat;
    background-size: 1em 1em;
    background-position: 0.55em center;
    background-image: url('/images/Arrow-Left.svg');
  }

  /* this will cover the non-active <summary>s */
  details[open] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
  }

  @media (min-width: 1000px) {
    details[open] summary {
      display: none;
    }
  }

  .links {
    border-top: var(--border-menu-links);
  }

  .links :global(a) {
    font-weight: var(--font-weight-bold);
  }

  ul {
    padding: 0;
    margin: 0;
  }

  h3 {
    font-size: inherit;
    font-weight: var(--font-weight-bold);
    padding: 0;
    margin: 0.5em 0 0 0;
    display: inline;
  }

  details[open] summary > h3 {
    color: var(--color-text-accent);
  }

  h4 {
    font-weight: var(--font-weight-bold);
    padding: 0;
    margin: 0.5em 0 0 0;
  }

</style>
