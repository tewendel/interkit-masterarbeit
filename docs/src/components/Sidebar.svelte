

<script>
  import Submenu from './Submenu.svelte'
  
  export let items;

  if (!items) items = {guides:[], theory:[]} // props.items

  
</script>

<Submenu items={items.components} />