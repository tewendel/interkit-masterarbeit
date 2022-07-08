<script>

  export let show

</script>

<div
  class="dots"
  style={`visibility: ${show ? 'visible' : 'hidden'}; opacity: ${show ? '1' : '0'}`}
  ></div>

<style>

@keyframes typingdot {
  0% { background: black; }
  20% { background: white; }
  40% { background: black; }
}

.dots {
  /* easy configururation of appearance */
  --duration: 1.25s;
  --size: 75%;
  /* left */
  margin: 1em 1em 1em 2em;
  /* center
  margin: 1em auto;
  */
  position: relative;
  font-size: var(--size);
  transition: opacity 500ms;
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
  left: -2em;
  animation-delay: 0;
}

.dots {
  animation-delay: calc(var(--duration) * 0.15);
}

.dots::before {
  left: 2em;
  animation-delay: calc(var(--duration) * 0.3);
}

</style>
