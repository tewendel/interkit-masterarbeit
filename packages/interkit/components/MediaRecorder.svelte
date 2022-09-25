<script>
  import {onMount, onDestroy} from 'svelte'
  import { InterkitClient, util } from '../'
  import { executeTrigger } from '../actions.js'

  import ButtonBar from '../components/ButtonBar.svelte'
  import Button from '../components/Button.svelte'
  import AspectRatio from '../components/AspectRatio.svelte'
  import Flex2 from '../components/Flex2.svelte'

  import { addElement } from './Upload.svelte'

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
      video: true
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
      stream = await navigator.mediaDevices.getUserMedia(
        streamOptions
      );
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

  function uploadFile(file) {
    const uploadEndpoint = InterkitClient.getUploadEndpoint()
    const formData = new FormData();
    console.log("upload ", file.path, file.name, file.size, file.type)
    formData.append('mediafile', file);
    formData.append('projectId', $projectId);
    console.log(file, $projectId)
    fetch(uploadEndpoint, {
        method: 'POST',
        body: formData
    })
    .then((response) => {
      console.log(response)
      return response.json()
    })
    .then((result) => {
      console.log('Success:', result);
      if(onUploadSuccess) onUploadSuccess(result);
      const col = colKeyMapping[mode]
      return addElement({mediaKey: result.key, mimeType }, col)
    })
    .then((result) => {
      executeTrigger(uploadedTrigger, result)
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  onMount(() => {
    init()
  })

  onDestroy(() => {
    stream.getTracks().forEach(function(track) {
      track.stop();
    });
    cancelAnimationFrame(animationFrameRequestId)
  })



</script>

<div class="MediaRecorder container">

  <div class="media">
    <AspectRatio aspectRatio={1} standalone>

      <div class="mediacontainer mode-{mode}">
        {#if loading}
          Please allow access to camera and microphone
        {/if}

        <video playsinline class="camera" bind:clientWidth={videoWidth} bind:clientHeight={videoHeight} bind:this={videoSource} paused={videoURL} class:hidden={!!videoURL || loading || !!imageBlob} muted />

        {#if !videoURL && streamOptions.audio && !loading}
          <div class="audioMeter" style="--levelPerc: {Math.round(audioLevel*100)}%">
          </div>
        {/if}

        {#if mode == "image"}
          <canvas bind:clientWidth={canvasWidth} bind:clientHeight={canvasHeight} bind:this={canvas} width="480" height="480" class:hidden={!imageBlob}></canvas>
        {/if}

        {#if videoURL}
          {#if mode == "audio"}
            <audio class="recordedVideo" controls src={videoURL} />
          {:else if mode == "video"}
            <video class="recordedVideo" controls src={videoURL} />
          {/if}
        {/if}
      </div>
    </AspectRatio>
  </div>

  <div class="controls">
    <ButtonBar>
      {#if mode != "image"}
        {#if !recording && !videoURL}
          <Button on:click={startRecording}>
            start recording (max. {maxSec}s)
          </Button>
        {/if}
      {:else if !imageBlob}
          <Button on:click={takePicture}>
            Take picture
          </Button>
      {/if}
      {#if recording}
        <Button on:click={stopRecording}>
          stop recording ({sec}s)
        </Button>
      {/if}
      {#if videoURL || imageBlob}
        <Button on:click={uploadRecording}>
          Upload
        </Button>
        <Button on:click={discardRecording}>
          Retry
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
  }

  .media {
    padding: 0 var(--distance-s) 0 var(--distance-s);
  }

  .mediacontainer {
    width: 100%;
    height: 100%;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: black;
  }

  video {
    object-fit: cover;
    width: 100%;
    height: 100%;
    flex: 1;
  }

  video, canvas {
    border-radius: var(--border-radius);
  }

  .audioMeter {
    border: 1px solid black;
    background: linear-gradient(0deg, rgba(0,255,0,1) 0%, rgba(0,255,0,1) var(--levelPerc), rgba(205,205,205,1) var(--levelPerc), rgba(255,255,255,1) 100%);
  }

  .mode-video .audioMeter {
    position: absolute;
    width: 20px;
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