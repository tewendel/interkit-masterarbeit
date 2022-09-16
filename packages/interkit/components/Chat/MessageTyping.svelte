<script>
  import Bubble from "./Bubble.svelte"

  export let show
  export let message

</script>

{#if message?.payload?.options?.label && show}
  <span class="message-label">{message?.payload?.options?.label}</span> 
{/if}

<div
  class="container"
  style={`visibility: ${show ? 'visible' : 'hidden'}; opacity: ${show ? '1' : '0'}`}
  >
  <Bubble
  type="other"
  showSide={true}
  showHandle={true}
  transparent
  >
    <div class="inner">
      <div class="dots"/>
    </div>
  </Bubble>
</div>

<style>

@keyframes typingdot {
  0% { background: var(--color-text); }
  40% { background: var(  --color-background-highlight); }
  80% { background: var(--color-text); }
}

.container {
  transition: opacity 500ms;
  display: inline-flex;
}

.inner {
  display: inline-flex;
  align-items: center;
  padding: var(--distance-s);
}

.inner::after {
  content: "\200D" /* trick to make the element's min-height equal to line height */
}

.dots {
  /* easy configururation of appearance */
  --duration: 1s;
  --size: 55%;
  /* left */
  margin: 0 2em;
  /* center
  margin: 1em auto;
  */
  position: relative;
  font-size: var(--size);
}

.dots::after,
.dots::before {
  content: '';
  position: absolute;
}

.dots,
.dots::after,
.dots::before {
  width: 1em;
  height: 1em;
  background: black;
  border-radius: 100%;
  animation: typingdot var(--duration) infinite;
}

.dots::after {
  left: -1.3em;
  animation-delay: 0;
}

.dots {
  animation-delay: calc(var(--duration) * 0.25);
}

.dots::before {
  left: 1.3em;
  animation-delay: calc(var(--duration) * 0.5);
}

.message-label {
    font: var(--font-caption-bold);
    margin-bottom: var(--distance-xs);
}

</style>
