<script>

import { InterkitClient, util } from '../'

import {onMount, onDestroy } from 'svelte';
import jsQR from "jsqr";
import { executeTrigger } from '../actions'

import Button from './Button.svelte'
import Overlay from './Overlay.svelte'
import TopNavBarCustom from './TopNavBarCustom.svelte'
import QRTips from './QRTips.svelte'
import Icon from './Icon.svelte'

let video;
let mediaStream;
let loading = true;
let showTips = false;

export let elementKeyColumn; // the column on a sheet to select an element (optional)

// columns for tips sheet
export let tipQrKeyColumn;
export let tipImageColumn;
export let tipTextColumn;
export let tipOrderColumn;

const QRElementStore = InterkitClient.getGlobalStore("QRElement") // this is a store
const targetElement = QRElementStore ? $QRElementStore : undefined

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
    const tipSheetKey = util.getSheetKey(tipQrKeyColumn);
    tipRowStore = await InterkitClient.getRowSubStore(tipSheetKey);

    // filter tips for targetElement and sort by order column
    tips = $tipRowStore
      .filter(t => 
        util.rowVal(t, tipQrKeyColumn) == util.rowVal(targetElement, elementKeyColumn)
      )
      .sort((a, b) => util.rowVal(a, tipOrderColumn) - util.rowVal(b, tipOrderColumn))  
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
  console.log("stopping video stream", mediaStream);
  if(!mediaStream) return;
  mediaStream.getTracks().forEach((track)=>{
    track.stop();
  });

});

const close = () => {
  showTips = false;
}

</script>

<div id="scanner-container">
  <canvas id="canvas"></canvas>
  {#if loading}
    <div class="loadingMessage" hidden="">⌛ Warte auf Kamera...</div>
  {:else}
    {#if targetElement && tips?.length}
      <div class="tip-button-container">
        <Button text="Hinweise zeigen" onClick={()=>showTips = true}/>
      </div>
    {/if}
  {/if}
</div>

{#if showTips}
  <Overlay>
    <TopNavBarCustom
      headline="QR-Code Scannen"
    >
      <svelte:fragment slot="left">
        <Button text="" onClick={close} type="secondary">
          <Icon type="arrow-left"/>
        </Button><span>QR-Code Scannen</span>
      </svelte:fragment>
      <svelte:fragment slot="content">
        <QRTips 
          {targetElement}
          {elementKeyColumn}
          {tipQrKeyColumn}
          {tipImageColumn}
          {tipTextColumn}
          {tipOrderColumn}
          onClose={close}
          {tips}
        />
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
  
