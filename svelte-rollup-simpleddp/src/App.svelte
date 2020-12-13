<script>
  import { onMount } from 'svelte'
  import simpleDDP from 'simpleDDP'; // ES6
  import ws from 'isomorphic-ws';

  let opts = {
    endpoint: "ws://localhost:3000/websocket",
    SocketConstructor: ws,
    reconnectInterval: 5000
  };
  const server = new simpleDDP(opts);

  onMount(async ()=>{

    await server.connect();
    console.log("connected")

    let sub = server.subscribe("components.public");
    await sub.ready();
    console.log("sub ready")

    console.log(server.collection('components').fetch())

    let reactiveCollection = server.collection("components").reactive();
    reactiveCollection.onChange((data)=>{
      console.log(data)
    })
  })

	export let name;
</script>

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>