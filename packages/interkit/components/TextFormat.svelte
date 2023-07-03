<script>

  export let interfaceFormat;
  export let contentFormat;

</script>

<span
  class="
    TextFormat
    interface-{interfaceFormat}
    TextFormat--interface{interfaceFormat}
    content-{contentFormat}
    TextFormat--content{contentFormat}
  "><slot></slot></span>

<style>

  /* interface typography */

  span.interface-headline-1 {
    font: var(--font-headline-1);
  }
  span.interface-headline-2 {
    font: var(--font-headline-2);
    letter-spacing: var(--letter-spacing-headline-2);
  }
  span.interface-headline-3 {
    font: var(--font-headline-3);
    letter-spacing: var(--letter-spacing-headline-3);
  }
  span.interface-headline-4 {
    font: var(--font-headline-4);
    letter-spacing: var(--letter-spacing-headline-4);
  }
  span.interface-headline-5 {
    font: var(--font-headline-5);
    letter-spacing: var(--letter-spacing-headline-5);
  }
  span.interface-body-1 {
    font: var(--font-body-1);
    letter-spacing: var(--letter-spacing-body-1);
  }
  span.interface-body-2 {
    font: var(--font-body-2);
    letter-spacing: var(--letter-spacing-body-2);
  }
  span.interface-subtitle-1 {
    font: var(--font-subtitle-1);
    letter-spacing: var(--letter-spacing-subtitle-1);
  }
  span.interface-subtitle-2 {
    font: var(--font-subtitle-2);
    letter-spacing: var(--letter-spacing-subtitle-2);
  }
  span.interface-button {
    font: var(--font-button);
  }
  span.interface-caption {
    font: var(--font-caption);
  }
  span.interface-caption-bold {
    font: var(--font-caption-bold);
  }
  span.interface-overline {
    font: var(--font-overline);
    letter-spacing: var(--letter-spacing-overline);
  }

  /* content typography */

  span.content-headline-1 {
    font: var(--font-content-headline-1);
    letter-spacing: var(--letter-spacing-content-headline-1);
  }
  span.content-headline-2 {
    font: var(--font-content-headline-2);
    letter-spacing: var(--letter-spacing-content-headline-2);
  }
  span.content-headline-3 {
    font: var(--font-content-headline-3);
    letter-spacing: var(--letter-spacing-content-headline-3);
  }
  span.content-headline-4 {
    font: var(--font-content-headline-4);
    letter-spacing: var(--letter-spacing-content-headline-4);
  }
  span.content-headline-5 {
    font: var(--font-content-headline-5);
    letter-spacing: var(--letter-spacing-content-headline-5);
  }
  span.content-body-1 {
    font: var(--font-content-body-1);
    letter-spacing: var(--letter-spacing-content-body-1);
  }
  span.content-body-2 {
    font: var(--font-body-2);
    letter-spacing: var(--letter-spacing-content-body-2);
  }

</style>
