<script>

import { setContext } from "svelte"

import { InterkitClient, util } from '../'

import {onMount, onDestroy } from 'svelte';
import jsQR from "jsqr";
import { executeTrigger } from '../actions'

import Button from './Button.svelte'
import Overlay from './Overlay.svelte'
import TopNavBarCustom from './TopNavBarCustom.svelte'
import Icon from './Icon.svelte'
import MapRenderer from './MapRenderer.svelte'
import MultiStepContent from './MultiStepContent.svelte'

let video;
let mediaStream;
let loading = true;
let showTips = false;
let running = true;
let scanInterval;
    
export let elementKeyColumn; // the column on a sheet to select an element (optional)
export let elementLocationColumn;

// columns for tips sheet
export let tipQrKeyColumn;
export let tipImageColumn;
export let tipTextColumn;
export let tipOrderColumn;

export let nextButtonText = "Nächster Hinweis"
export let backButtonText = "Zurück"
export let skipButtonText = "Jetzt Scannen"
export let finalButtonText = "Jetzt Scannen"

export let closeTrigger;

const QRElementStore = InterkitClient.getGlobalStore("QRElement") // this is a store
const targetElement = QRElementStore ? $QRElementStore : undefined
const targetElementObj = targetElement ? util.rowToObject(targetElement, { elementKeyColumn, elementLocationColumn }) : undefined

console.log("setting qr-scanner context with", targetElementObj)
setContext("qr-scanner", {
  mapOffset: [0, 150],
  targetElementObj 
});

let dataRows; 

const onScan = (code) => {
  if(!code || code == "") return
  console.log("found code", code)

  // try to find element by that key
  let elementRows = $dataRows.filter(r => util.rowVal(r, elementKeyColumn) == code)
  console.log(elementRows)

  let elementRow = elementRows?.[0]
  console.log(elementRow)
  
  let payload = {
    code,
    elementRow,
    targetFound: elementRow ? (elementRow.key == targetElement?.key) : false
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

let tipRowStore;
let tips;

const initTips = async ()=> {
    // setup the subscription to the tip rows
    tipRowStore = await InterkitClient.getRowSubStore(tipQrKeyColumn, {
      tipQrKeyColumn,
      image: tipImageColumn,
      content: tipTextColumn,
      tipOrderColumn
    });
    console.log("$tipRowStore", $tipRowStore)
    
    // filter tips for targetElement and sort by order column
    tips = $tipRowStore
      .filter(t => t.tipQrKeyColumn == targetElementObj?.elementKeyColumn)
      .sort((a, b) => a.tipOrderColumn - b.tipOrderColumn)
      .map((t,i) => { return {...t, title: "Such-Hinweis " +(i+1)} })  
    console.log("tips", tips)
}

const initCamera = ()=> {

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

let showQRScannerTipsUiKey;

onMount(async () => {
  initCamera()
  await initRowSub();
  await initTips();
  document.addEventListener('keydown', logKey);

  showQRScannerTipsUiKey = InterkitClient.getUiKeyStore("showQRScannerTips")
  if($showQRScannerTipsUiKey) showTips = true;
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

const closeQR = () => {
  if(closeTrigger) {
    executeTrigger(closeTrigger)
  }
}

const closeTips = () => {
  showTips = false;
}

</script>

<div id="scanner-container">
  <canvas id="canvas"></canvas>
  {#if loading}
    <div class="loadingMessage" hidden="">Warte auf Kamera...</div>
  {:else}
    <div class="qr-frame"></div>
  {/if}
  {#if targetElement && tips?.length}
    <div class="tip-button-container">
      <Button text="Such-Hinweise zeigen" onClick={()=>showTips = true}/>
    </div>
  {/if}
</div>

{#if showTips && tips.length}
  <Overlay 
    zIndex=3
  >
    <TopNavBarCustom
      headline="QR-Code Scannen"
    >
      <svelte:fragment slot="left">
        <Button text="" onClick={closeQR} type="secondary">
          <Icon type="arrow-left"/>
        </Button><span>QR-Code Scannen</span>
      </svelte:fragment>
      <svelte:fragment slot="content">
        <div class="center-box">
          <MultiStepContent
            slides = {tips}
            onClose = {closeTips}
            {nextButtonText}
            backButtonText = {null}
            {skipButtonText}
            {finalButtonText}
          />
        </div>
        <div class="map">
          <slot name="map"/>
        </div>
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
    background-image: url("../icons/QR_frame.svg");
    background-size: contain;
    z-index: 2;
  }

  .loadingMessage, .tip-button-container {
    z-index: 1;
  }

  .tip-button-container {
    position: absolute;
    bottom: 40px;
    transform: translateX(-50%);
    left: 50%;
  }

  .map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .center-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1000;
    pointer-events: none;
    padding: var(--distance-s);
    box-sizing: border-box;
  }



</style>
  
