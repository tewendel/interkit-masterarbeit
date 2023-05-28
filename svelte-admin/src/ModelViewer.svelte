    <script>
      import { onMount } from 'svelte';
      import { 
        Scene,
        WebGLRenderer,
        HemisphereLight,
        DirectionalLight,
        Color,
        AnimationMixer,
        Vector3,
        PerspectiveCamera,
        Box3
      } from 'three';

      import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
      import { USDZLoader } from 'three/addons/loaders/USDZLoader.js';
      import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

      import { TooltipIcon } from "carbon-components-svelte";
      import InformationFilled from "carbon-icons-svelte/lib/InformationFilled.svelte";

      export let mediafile
      export let small = false

      let elem, loader, warning, loaded;

      let camera, scene, renderer;
      let mixers = [];

      let size = small ? 42 : window.innerWidth * .3;

      onMount(() => {

        const type = mediafile.type

        if (type.indexOf("model/gltf") === 0) {
          loader = new GLTFLoader();
        } else if (type.match("^model/.*usdz.*")) {
          loader = new USDZLoader();
          warning = "USDZ preview only possible with usda. usdc will appear blank"
        }

        init();
        animate();
      })
      
      function init() {

        camera = new PerspectiveCamera( 60, 1, 0.1, 100 );
        camera.position.set( 0, 0.75, - 1 );

        scene = new Scene();
        scene.background = new Color( 0xeeeeee );

        //scene.add( new THREE.GridHelper( 2, 4, 0xc1c1c1, 0x8d8d8d ) );

        const light = new 
        DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 );
        scene.add( light );

        const light2 = new HemisphereLight( 0xffffff, 0xc1c1c1 );
        scene.add( light2 );

        // renderer
        renderer = new WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( size, size );
        elem.appendChild( renderer.domElement );

        // controls
        if (!small) {
          const controls = new OrbitControls( camera, renderer.domElement );
          controls.minDistance = .1;
          controls.maxDistance = 80;
        } else {
          camera.position.set( 0, 0, 1 );
        }
        
        loader.load( mediafile.link, function ( object ) {

          const model = object.scene || object

          // scale to fit
          const box = new Box3().setFromObject( model );
          const size = box.getSize( new Vector3() ).length();
          const center = box.getCenter( new Vector3() );
          model.position.x += ( model.position.x - center.x );
          model.position.y += ( model.position.y - center.y );
          model.position.z += ( model.position.z - center.z );
          model.scale.multiplyScalar( 1 / size );

          // play animation
          const animations = object.animations || []
          if (animations.length > 0) {
            console.log("playing animation", animations[0])
            
            //mixer.clipAction( animations[ 0 ] ).play();
            const mixer = new AnimationMixer( model )

            animations.forEach( function ( clip ) {
              mixer.clipAction( clip ).play();
              
            } );
            mixers.push( mixer );
          }
          
          scene.add( model );

          loaded = true

        } );

        

      }

      function animate() {

        if (!small && loaded || !loaded) requestAnimationFrame( animate );
        renderer.render( scene, camera );
        if (!small) mixers.forEach( ( mixer ) => { mixer.update( 0.01 ); } );

      }

    </script>
  
<div class="container" bind:this={elem}>
{#if warning}
  <div class="warn">
    <TooltipIcon
      tooltipText={warning}
      icon={InformationFilled}
    />
  </div>
{/if}
</div>

<style>
  .container {
    min-width: 32px;
    min-height: 32px;
    position: relative;
  }
  .warn {
    position: absolute;
    top: 0px;
    left: 0px;
  }
</style>