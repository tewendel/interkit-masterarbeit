<script>

  export let label;
  export let back = false;
  export let onClick;

</script>

<nav class:back={back}>
  <span on:click={onClick}>{label}</span>
</nav>

<style>

nav {
    display: flex;
    height: 40px;
    top: 0;
    left: 0;
    width: 100%;
    background-color: gray;
    z-index: 1000;
    justify-content: right;
    padding: 5px;
  }

  nav.back {
    justify-content: left;
  } 

  nav span:hover {
    cursor: pointer;
  }

  nav.back span::before {
    content: "< ";
  }

</style>