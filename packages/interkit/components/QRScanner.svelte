<script>

  import { setContext, getContext } from "svelte"
  
  import { InterkitClient, util } from '../'
  
  import {onMount, onDestroy } from 'svelte';
  import jsQR from "jsqr";
  
  import OverlayFull from './OverlayFull.svelte'
  import WithEffect from "./WithEffect.svelte";
  
  let video;
  let mediaStream;
  let loading = true;
  let running = true;
  let scanInterval;
      
  export let elementKeyColumn; // the column on a sheet to select an element (optional)
  export let closeEffect;
  export let scanEffect;
  let executeScanEffect;
  
  const targetElementStore = getContext("element") // if this context is set, the qr scanner will focus on one element
  $: targetElementObj = $targetElementStore ? util.rowToObject($targetElementStore, { elementKeyColumn }) : undefined
  
  $: {
    console.log("setting qr-scanner context with", targetElementObj)
    setContext("qr-scanner", {
      mapOffset: [0, 150],
      targetElementObj 
    });
  }
  
  let dataRows; 
  
  const onScan = (code) => {
    if(!code || code == "") return
    console.log("qr scanner found code", code)
  
    // try to find element by that key
    let elementRows = $dataRows.filter(r => util.rowVal(r, elementKeyColumn) == code)
    console.log("qr scanner searching rows", elementRows)
  
    let elementRow = elementRows?.[0]
    console.log("qr scanner identified row", elementRow)
    
    let payload = {
      code,
      elementRow,
      elementKey: elementRow?.key,
      targetFound: elementRow ? (elementRow.key == $targetElementStore?.key) : false
    }
  
    if(scanEffect)
      executeScanEffect(payload);
  }
  
  const initRowSub = async ()=> {
    console.log("elementKeyColumn", elementKeyColumn)
    let dataSheetKey = util.getSheetKey(elementKeyColumn);
    console.log("dataSheetKey", dataSheetKey)
    dataRows = await InterkitClient.getRowSubStore(dataSheetKey);
    console.log($dataRows)
  }
  
  const initCamera = ()=> {
  
      video = document.createElement("video");
      var canvasElement = document.getElementById("canvas");
      var canvas = canvasElement.getContext("2d");
      
      /*function drawLine(begin, end, color) {
        canvas.beginPath();
        canvas.moveTo(begin.x, begin.y);
        canvas.lineTo(end.x, end.y);
        canvas.lineWidth = 4;
        canvas.strokeStyle = color;
        canvas.stroke();
      }
      */

      // WARNING: this currently does not work in capacitor on ios (need https!)
  
      if(!navigator?.mediaDevices) {
        alert("cannot access navigator.mediaDevices - https connection?")
      }
      
      // Use facingMode: environment to attemt to get the front camera on phones
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
        mediaStream = stream;
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        video.play();
        requestAnimationFrame(tick);
      });
  
      function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          loading = false;
          canvasElement.hidden = false;
  
          canvasElement.height = video.videoHeight;
          canvasElement.width = video.videoWidth;
          canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);        
        }
        if(running)
          requestAnimationFrame(tick);      
      }
  
      scanInterval = setInterval(()=>{
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code) {
          /*drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
          drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
          drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
          drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");*/
          onScan(code.data);
        } else {
          
        }
      }, 100);
  }
  
  const logKey = (e) => {
    console.log(e?.code);
    if(e?.code == "Space") {
      let result = prompt("Enter qr code directly")
      if(result) {
        onScan(result)
      }
    }
  }
  
  onMount(async () => {
    initCamera()
    await initRowSub();
    document.addEventListener('keydown', logKey);
  });
  
  onDestroy(()=>{
    running = false;
    console.log("stopping video stream", mediaStream);
    if(!mediaStream) return;
    mediaStream.getTracks().forEach((track)=>{
      track.stop();
    });
    clearInterval(scanInterval);
  
  });
  

  </script>
  
  <WithEffect effect={scanEffect} bind:execute={executeScanEffect}>
    <OverlayFull {closeEffect} classes="QRScanner">   
      <div id="scanner-container QRScanner__Container">
        <canvas id="canvas" class="QRScanner__Canvas"></canvas>
        {#if loading}
          <div class="loadingMessage QRScanner__LoadingMessage" hidden="">Waiting for camera...</div>
        {:else}
          <div class="qr-frame QRScanner__Frame"></div>
        {/if}
      </div>
    </OverlayFull>
  </WithEffect>
  
  <style>
    #scanner-container {
      height: 100%;
      width: 100%;
      background-color: white;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
    }
  
    canvas {
      box-sizing: border-box;
      width: auto;
      height: 100%;
      position: absolute;
      top: 0;
      width: auto;
      left: 50%;
      transform: translate(-50%, 0%);
    }
  
    .qr-frame {
      width: 200px;
      height: 200px;
      background-image: url("./icons/QR_frame.svg");
      background-size: contain;
      z-index: 2;
    }
  
    .loadingMessage {
      z-index: 1;
    }
  
  
  </style>
    
  
