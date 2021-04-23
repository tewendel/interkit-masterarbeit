<div class="AppBase">
  <slot ></slot>
</div>

<style>
  .AppBase {
    height: 100%;
  }
  :global(html),
  :global(body) {
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
    background-color: #FFFFFF;
  }
  /* default font */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
  :global(body) {
    font-family: 'Inter', sans-serif;
  }

</style>

<!-- reset styles -->

<svelte:head>
  <style>
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary, button,
    time, mark, audio, video {
      margin: 0;
      padding: 0;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure, 
    footer, header, hgroup, menu, nav, section {
      display: block;
    }
    body {
      line-height: 1;
    }
    ol, ul {
      list-style: none;
    }
    blockquote, q {
      quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
      content: '';
      content: none;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }

    /* buttons no special */
    button {
      background-color: transparent;
      border-radius: 0;
    }

    /* Make images easier to work with */
    img {
      max-width: 100%;
      display: block;
    }

    /* Inherit fonts for inputs and buttons */
    input,
    button,
    textarea,
    select {
      font: inherit;
    }

    /* Remove all animations and transitions for people that prefer not to see them */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  </style>
</svelte:head>