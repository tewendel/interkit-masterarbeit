<script>

  import { onMount } from 'svelte'

  export let name; // example: "AppBase"
  let yaml
  let color = 210

  onMount(async ()=>{
    import(`../../../../packages/interkit/components/${name}.yaml`).then((result)=>{
      yaml = result.default
      color = yaml.colour 

    }).catch(e=>{
      console.error(e)
    })
  })

</script>

<span style="background-color:hsl({color} 42% 52%)">{name}</span>

<style>
  span {
    border-radius: .2em;
    padding: 0 .4em;
    position: relative;
    color: white;
    display: inline-block;
    letter-spacing: 0.2px;
    background-color: #666;
  }
  span:before {
    content: "";
    position: absolute;
    left: 1px;
    top: 1px;
    width: 100%;
    height: 100%;
    background-color: inherit;
    z-index: -1;
    filter: brightness(0.8) saturate(0.8);
    border-radius: inherit;
  }
  span::after {
    content: "";
    position: absolute;
    left: -1px;
    top: -1px;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background-color: inherit;
    z-index: -2;
    filter: brightness(1.3) saturate(0.4);
  }
</style>
