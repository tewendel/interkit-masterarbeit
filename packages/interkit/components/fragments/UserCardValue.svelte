<script>

  export let label
  export let value
  export let justifyRight

  const bar = typeof value == "number" && value >= 0 && value <= 1

</script>

<div
  class="UserCardValue container"
  class:justifyRight
  class:UserCardValue--justifyright={justifyRight}
  >
  <span class="UserCardValue__Label label">{label ? label : ""}</span>
  <span class="UserCardValue__Value value" class:bar>
    {#if bar}
      <div class="UserCardValue__Bar bar" style="--value: {value}"/>
    {:else}
      {value ? value : ""}
    {/if}
  </span>
</div>

<style>

.container {
  width: 100%;
}

span.label, span.value {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: block;
}

.container.justifyRight {
  text-align: right;
}

.label {
  font: var(--font-caption);
}

.value {
  font: var(--font-content-headline-5);
  letter-spacing: var(--letter-spacing-headline-5);  
  font-weight: 700;
}

span.bar {
  width: 100%;
  max-width: 87px;
}

div.bar {
  display: inline-block;
  background-color: #999999;
  width: 100%;
  height: 6px;
  position: relative;
  border-radius: 2px;
  margin-top: 11px;
}

div.bar::before {
  content: "";
  position:absolute;
  top: 0;
  left: 0;
  background-color: #000;
  height: 6px;
  width: calc(var(--value) * 100%);
  border-radius: 2px;
}

</style>
