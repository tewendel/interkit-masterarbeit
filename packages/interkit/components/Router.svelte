<script>
  import { Router, createHistory, createMemorySource } from "svelte-navigator";
  import { createHashHistory } from "history";

  // memory is the alternative to hash history, but does not keep the route on vite hmr
  const memoryHistory = createHistory(createMemorySource());

  // source: https://github.com/mefechoel/svelte-navigator/tree/main/example/custom-hash-history
  function createHashSource(basename) {
    const history = createHashHistory({ basename });

    let listeners = [];

    history.listen(location => {
      if (history.action === "POP") {
        listeners.forEach(listener => listener(location));
      }
    });

    return {
      get location() {
        return history.location;
      },
      addEventListener(name, handler) {
        if (name !== "popstate") return;
        listeners.push(handler);
      },
      removeEventListener(name, handler) {
        if (name !== "popstate") return;
        listeners = listeners.filter(fn => fn !== handler);
      },
      history: {
        get state() {
          return history.location.state;
        },
        pushState(state, title, uri) {
          console.log("router history pushState", uri, state)
          history.push(uri, state);
        },
        replaceState(state, title, uri) {
          console.log("router history replaceState", uri, state)
          history.replace(uri, state);
        },
        go(to) {
          console.log("router history go", to)
          history.go(to);
        },
      },
    };
  }

  const hashHistory = createHistory(createHashSource());

</script>

<Router history={memoryHistory} primary={false}>
  <slot />
</Router>
