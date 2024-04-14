<script>
  import {onMount, onDestroy} from 'svelte'
  import { InterkitClient, util } from '../'
  import { executeTrigger } from '../actions.js'

  import ButtonBar from '../components/ButtonBar.svelte'
  import Button from '../components/Button.svelte'
  import AspectRatio from '../components/AspectRatio.svelte'
  import Icon from './Icon.svelte'

  import { addElement } from './Upload.svelte'

  export let meta

  export let imageColumn
  export let audioColumn
  export let videoColumn
  export let mode = "video" // video | audio | image
  export let cameraFacingMode // "user" for selfie or "environment" for back camera
  export let uploadedTrigger

  export let onUploadSuccess // optional callback

  const colKeyMapping = {
    'audio': audioColumn,
    'video': videoColumn,
    'image': imageColumn,
  }

  const maxSecMapping = {
    'audio': 28,
    'video': 14,
  }

  const mimeTypeMapping = {
    'audio': 'audio/mp3',
    'video': 'video/mp4',
    'image': 'image/jpeg',
  }

  const streamOptionsMapping = {
    'audio': {
      audio: true
    },
    'video': {
      video: {facingMode: cameraFacingMode || "user"},
      audio: true
    },
    'image': {
      video: {facingMode: cameraFacingMode || "user"},
      audio: false
    },
  }
  
  const projectId = InterkitClient.projectId;
  console.log("projectId", $projectId);

  const maxSec = maxSecMapping[mode]
  const mimeType = mimeTypeMapping[mode]
  const streamOptions = streamOptionsMapping[mode]

  let sec = maxSec

  let videoSource = null;
  let stream = null;
  let videoURL = null;
  let imageBlob = null
  let blob = null;

  let videoWidth;
  let videoHeight;
  let canvasWidth;
  let canvasHeight;

  let loading = false;
  let recording = false

  var mediaRecorder = null;
  let canvas = null
  var timer = null
  var animationFrameRequestId = null
  let audioLevel = 0

  const takePicture = async () => {
    console.log(videoWidth, videoHeight, videoSource.videoWidth, videoSource.videoHeight, canvasWidth, canvasHeight, canvas.width, canvas.height)
    if(videoSource.videoWidth > videoSource.videoHeight) {
      canvas.getContext('2d').drawImage(videoSource, (videoSource.videoWidth - 480) / 2, 0, videoSource.videoHeight, videoSource.videoHeight, 0, 0, 480, 480);
    } else {
      canvas.getContext('2d').drawImage(videoSource, 0, (videoSource.videoHeight - 480) / 2, videoSource.videoWidth, videoSource.videoWidth, 0, 0, 480, 480);
    }
    canvas.toBlob((b)=>{imageBlob=b},mimeType);
  }

  const startRecording = async () => {
    if (!stream) {
      await init()
      if (!stream) {
        alert("Unable get stream. Might be a permissions issue.")
        return
      }
    }
    mediaRecorder = new MediaRecorder(stream)

    var chunks = [];
    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    };

    mediaRecorder.onstop = function(e) {
      blob = new Blob(chunks, { 'type' : mimeType });
      chunks = [];
      videoURL = URL.createObjectURL(blob);
      videoSource.pause();
      clearTimeout(timer)
      recording = false
    };
    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    };

    mediaRecorder.start()

    sec = maxSec
    recording = true

    timer = setInterval(()=>{
      sec -= 1
      if (sec <= 0) {
        stopRecording()
      }
    }, 1000)
  }

  const stopRecording = async => {
    mediaRecorder.stop()
  }

  const discardRecording = async => {
    videoSource.play();
    videoURL = null
    imageBlob = null
  }

  const uploadRecording = async => {
    if (blob) uploadFile(blob)
    if (imageBlob) uploadFile(imageBlob)
  }

  const init = async () => {
    try {
      loading = true;
      const sanitizedStreamOptions = await sanitizeStreamOptions(streamOptions);
      stream = await navigator.mediaDevices.getUserMedia(
        sanitizedStreamOptions
      );
      if(!stream) {
        alert("Error starting camera")
        return;
      }
      console.log("stream", stream);
      videoSource.srcObject = stream;
      videoSource.play();
      loading = false;



      /* BEGIN audio meter */

      const audioContext = new AudioContext();
      const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
      const analyserNode = audioContext.createAnalyser();
      mediaStreamAudioSourceNode.connect(analyserNode);

      const pcmData = new Float32Array(analyserNode.fftSize);
      const onFrame = () => {
        analyserNode.getFloatTimeDomainData(pcmData);
        let sumSquares = 0.0;
        for (const amplitude of pcmData) { sumSquares += amplitude*amplitude; }
        audioLevel = Math.sqrt(sumSquares / pcmData.length);
        animationFrameRequestId = window.requestAnimationFrame(onFrame);
      };
      window.requestAnimationFrame(onFrame);

      /* END audio meter */

    } catch (error) {
      console.log("Media stream error", error);
    }
  };

  function uploadFile (file) {
    const uploadEndpoint = InterkitClient.getUploadEndpoint()
    const formData = new FormData();
    console.log("upload ", file.path, file.name, file.size, file.type)
    formData.append('mediafile', file);
    formData.append('projectId', $projectId);
    for (const metaKey in meta) {
      formData.append(metaKey, meta[metaKey])
    }
    console.log('uploadFile pre fetch', file, formData, $projectId)
    fetch(uploadEndpoint, {
        method: 'POST',
        body: formData
    })
    .then((response) => {
      console.log('uploadFile after fetch, response:', response)
      return response.json()
    })
    .then((result) => {
      console.log('uploadFile fetch response.json() success:', result);
      if(onUploadSuccess) onUploadSuccess(result);
      const col = colKeyMapping[mode]
      return addElement({mediaKey: result.key, mimeType }, col)
    })
    .then((result) => {
      executeTrigger(uploadedTrigger, result)
    })
    .catch((error) => {
      console.error('uploadFile Error:', error);
    });
  }

  async function sanitizeStreamOptions(options) {
    // you may check if the requested capabilities exist, for example, and provide a fallback
    // however, some information may be hard to get until permissions are granted
    return options;
  }


  onMount(() => {
    init()
  })

  onDestroy(() => {
    try {
      if (stream) {
        stream.getTracks().forEach(function(track) {
          track.stop();
        });
      }
    } catch (error) {
      console.log("Error stopping stream", error);
    }
    cancelAnimationFrame(animationFrameRequestId)
  })



</script>

<div class="MediaRecorder container">

  <div class="MediaRecorder__Media media">
    <AspectRatio aspectRatio={1}>

      <div class="MediaRecorder__MediaContainer MediaRecorder__MediaContainer-{mode} mediacontainer mode-{mode}">
        {#if loading}
          Please allow access to camera and microphone
        {/if}

        <video
          playsinline
          class="MediaRecorder__Camera camera"
          class:MediaRecorder__Camera--hidden={!!videoURL || loading || !!imageBlob}
          class:hidden={!!videoURL || loading || !!imageBlob}
          bind:clientWidth={videoWidth}
          bind:clientHeight={videoHeight}
          bind:this={videoSource}
          paused={videoURL}
          muted
          />

        {#if !videoURL && streamOptions.audio && !loading}
          <div class="MediaRecorder__AudioMeter audioMeter" style="--levelPerc: {Math.round(audioLevel*100)}%">
          </div>
        {/if}

        {#if mode == "image"}
          <canvas
            class="MediaRecorder__Canvas"
            class:MediaRecorder__Canvas--hidden={!imageBlob}
            class:hidden={!imageBlob}
            bind:clientWidth={canvasWidth}
            bind:clientHeight={canvasHeight}
            bind:this={canvas}
            width="480"
            height="480"
            ></canvas>
        {/if}

        {#if videoURL}
          {#if mode == "audio"}
            <audio class="MediaRecorder__RecordedAudio recordedAudio" controls src={videoURL} />
          {:else if mode == "video"}
            <video class="MediaRecorder__RecordedVideo recordedVideo" controls src={videoURL} />
          {/if}
        {/if}
      </div>
    </AspectRatio>
  </div>

  <div class="MediaRecorder__Controls controls">
    <ButtonBar hideHelpText>
      {#if mode != "image"}
        {#if !recording && !videoURL}
          <Button on:click={startRecording}>
            start recording (max. {maxSec}s)
          </Button>
        {/if}
      {:else if !imageBlob}
          <Button type="primary" on:click={takePicture} dummyNoText>
            <Icon type="Full-Camera" inverse/>
          </Button>
      {/if}
      {#if recording}
        <Button on:click={stopRecording}>
          stop recording ({sec}s)
        </Button>
      {/if}
      {#if videoURL || imageBlob}
        <Button on:click={discardRecording} dummyNoText>
          Retry
        </Button>
        <Button type="primary" on:click={uploadRecording} dummyNoText>
          Upload
          <Icon type="Full-Send" inverse/>
        </Button>
        <br style="clear: both" />
      {/if}
    </ButtonBar>
  </div>

</div>

<style>
  .hidden {
    display: none;
  }

  .container {
    width: 100%;
    height: 100%;
    flex: 1;
    background-color: var(--color-background-backdrop);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .media {
    
  }

  .mediacontainer {
    width: 100%;
    height: 100%;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: black;
    border-radius: 0;
  }

  video {
    object-fit: cover;
    width: 100%;
    height: 100%;
    flex: 1;
  }

  video, canvas {
    border-radius: 0; 
  }

  .camera {
    border-radius: 0 !important; 
  }

  .controls {
    padding:
      calc(var(--outset-y) * 2rem)
      calc(var(--outset-x) * 2rem);
    background-color: var(--color-background-backdrop);
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
  }

  .audioMeter {
    border: var(--border-width) solid var(--color-border);
    background: linear-gradient(0deg, rgba(0,255,0,1) 0%, rgba(0,255,0,1) var(--levelPerc), rgba(205,205,205,1) var(--levelPerc), rgba(255,255,255,1) 100%);
  }

  .mode-video .audioMeter {
    position: absolute;
    width: 1.25rem;
    height: 96%;
    right: 2%;
    top: 2%;
  }

  .mode-audio .audioMeter {
    width: 100%;
    height: 100%;
    border: none;
  }

  canvas {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .mode-audio .camera {
    display: none;
  }
</style>
