<script>
  import { onMount } from 'svelte'
  import { get } from 'svelte/store';
  import { Router, createHistory, createMemorySource } from "svelte-navigator";
  import { createHashHistory } from "history";

  export let postMessage
  export let projectId

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

  memoryHistory.listen(evt => {
    if (!postMessage) return
    postMessage({ previewHistoryEvent: evt })
    // only in Dev...
    if (document.location.href.indexOf('/dev/') === -1) return
    // only if "explicit" (the initial set of '/' on load is a POP somehow)...
    if (evt.action !== 'PUSH') return
    try {
      window.localStorage.setItem('initialRoute', evt.location?.pathname)
      const _projectId = get(projectId)
      if (_projectId) {
        window.localStorage.setItem('initialRoute.' + _projectId, evt.location?.pathname)
      }
    } catch (e) {
      console.warn('Router set initialRoute failed', e)
    }
  })

  const hashHistory = createHistory(createHashSource());

  onMount(() => {
    // this check is kinda dumb
    if (document.location.href.indexOf('/dev/') > -1) {
      try {
        const _projectId = get(projectId)
        const initialRoute = _projectId
          ? window.localStorage.getItem('initialRoute.' + projectId)
          : window.localStorage.getItem('initialRoute')
        if (initialRoute) memoryHistory.navigate(initialRoute)
      } catch (e) {
        console.warn('Router onMount initialRoute failed', e)
      }
    }
  })

</script>

<Router history={memoryHistory} primary={false}>
  <slot />
</Router>
