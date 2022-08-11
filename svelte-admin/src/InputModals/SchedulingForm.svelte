<script>

import {
  RadioButton,
  RadioButtonGroup,
  NumberInput,
  Select,
  SelectItem
  /*
  DatePicker seems to be broken?
    Error: UMD and IIFE output formats are not supported for code-splitting builds.
  DatePicker,
  DatePickerInput,
  TimePicker*/
} from "carbon-components-svelte"

export let mode = 'immediate'
export let value

const relativeUnits = {
  'seconds': 1000,
  'minutes': 1000 * 60,
  'hours':   1000 * 60 * 60,
  'days':    1000 * 60 * 60 * 24,
}

let relativeNumber = 1
let relativeUnit = 'hours'
let absoluteValue = new Date((+new Date()) + relativeNumber * relativeUnits[relativeUnit])

$: {
  switch (mode) {
    case 'immediate':
      value = null
      break
    case 'absolute':
      value = new Date(absoluteValue)
      value.setMinutes(value.getMinutes() + value.getTimezoneOffset())
      break
    case 'relative':
      // of course this does not respect timezone, daylight saving changes etc.
      value = new Date((+new Date()) + relativeNumber * relativeUnits[relativeUnit])
      let valueForAbs = new Date(value)
      // insane conversion https://stackoverflow.com/a/61082536/629238
      valueForAbs.setMinutes(value.getMinutes() - value.getTimezoneOffset())
      absoluteValue = valueForAbs.toISOString().slice(0, 16)
      break
  }
}

</script>

<RadioButtonGroup
  bind:selected={mode}
  >
  <RadioButton
    value="immediate"
    labelText="immediately"
    />
  <RadioButton
    value="relative"
    labelText="scheduled, in… (relative)"
    />
  <RadioButton
    value="absolute"
    labelText="scheduled, on… (absolute)"
    />
</RadioButtonGroup>

<div class="inputs">
  {#if mode === 'absolute'}
    <input type="datetime-local" bind:value={absoluteValue} />
    <!--
    <DatePicker
      datePickerType="single"
      bind:value={absoluteDate}
      >
      <DatePickerInput labelText="date" />
    </DatePicker>
    <TimePicker
      bind:value={absoluteTime}
      labelText="time"
      />
    -->
  {:else if mode === 'relative'}
    <NumberInput
      bind:value={relativeNumber}
      />
    <Select
      bind:selected={relativeUnit}
      >
      {#each Object.keys(relativeUnits) as ru}
        <SelectItem value={ru} />
      {/each}
    </Select>
  {/if}
</div>

<style>

  /* mimic Carbon Design */
  [type="datetime-local"] {
    background: #f4f4f4;
    border: 0;
    border-bottom: 1px solid #8d8d8d;
    line-height: 1.28572;
    padding: 0 3rem 0 1rem;
    height: 2.5rem;
  }

  .inputs {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    align-items: flex-end;
    min-height: 4.5rem;
    
  }

</style>
