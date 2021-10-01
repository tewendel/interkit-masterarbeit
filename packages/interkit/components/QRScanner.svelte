<script>

import { InterkitClient, util } from '../'

import {onMount, onDestroy } from 'svelte';
import jsQR from "jsqr";
import { executeTrigger } from '../actions'

import Button from './Button.svelte'
import Overlay from './Overlay.svelte'
import TopNavBarCustom from './TopNavBarCustom.svelte'
import QRTips from './QRTips.svelte'

let video;
let mediaStream;
let loading = true;
let showTips = false;

export let elementKeyColumn; // the column on a sheet to select an element (optional)
export let targetKey; // a key that we use as target element (optional)

let dataRows; 

const onScan = (code) => {
  if(!code || code == "") return
  console.log("found code", code)

  // try to find element by that key
  let elementRows = $dataRows.filter(r => util.rowVal(r, elementKeyColumn) == code)
  console.log(elementRows)

  let elementRow = elementRows?.[0]
  console.log(elementRow)

  if(!elementRow) alert("Code nicht erkannt.", code)

  let payload = {
    code,
    elementRow,
    targetFound: elementRow ? (util.rowVal(elementRow, elementKeyColumn) == targetKey) : false
  }

  executeTrigger("QRCodeScanned", payload);
}

const initRowSub = async ()=> {
  console.log("elementKeyColumn", elementKeyColumn)
  let dataSheetKey = util.getSheetKey(elementKeyColumn);
  console.log("dataSheetKey", dataSheetKey)
  dataRows = await InterkitClient.getRowSubStore(dataSheetKey);
  console.log($dataRows)
}

const init = ()=> {

    video = document.createElement("video");
    var canvasElement = document.getElementById("canvas");
    var canvas = canvasElement.getContext("2d");
    
    function drawLine(begin, end, color) {
      canvas.beginPath();
      canvas.moveTo(begin.x, begin.y);
      canvas.lineTo(end.x, end.y);
      canvas.lineWidth = 4;
      canvas.strokeStyle = color;
      canvas.stroke();
    }

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
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code) {
          drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
          drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
          drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
          drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
          onScan(code.data);
        } else {
          
        }
      }
      requestAnimationFrame(tick);
    }

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
  init()
  await initRowSub();
  document.addEventListener('keydown', logKey);
});

onDestroy(()=>{
  console.log("stopping video stream", mediaStream);
  if(!mediaStream) return;
  mediaStream.getTracks().forEach((track)=>{
    track.stop();
  });

});

</script>

<div id="scanner-container">
  <canvas id="canvas"></canvas>
  {#if loading}
    <div class="loadingMessage" hidden="">⌛ Warte auf Kamera...</div>
  {:else}
    <div class="tip-button-container">
      <Button text="Hinweis" onClick={()=>showTips = true}/>
    </div>
  {/if}
</div>

{#if showTips}
  <Overlay>
    <TopNavBarCustom
      headline="QR-Code Scannen"
    >
      <svelte:fragment slot="left">
        <Button text="<" onClick={()=>showTips = false}/>
      </svelte:fragment>
      <svelte:fragment slot="content">
        <QRTips/>
      </svelte:fragment>
    </TopNavBarCustom>
  </Overlay>
{/if}

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
    width: 100%;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
  }

  .loadingMessage, .tip-button-container {
    z-index: 1;
  }

</style>
  
