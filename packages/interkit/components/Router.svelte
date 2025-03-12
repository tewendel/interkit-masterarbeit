<script>
  import { onMount } from 'svelte'
  import { get } from 'svelte/store';
  import { Router, createHistory, createMemorySource } from "svelte-navigator";
  import { createHashHistory } from "history";

  export let postMessage
  export let projectId

  const hashHistory = createHistory(createHashSource());

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
      const _projectId = get(projectId)
      if (!_projectId) {
        console.warn('Router set initialRoute, projectId not there (yet), bailing')
        return
      }
      window.localStorage.setItem('initialRoute.' + _projectId, evt.location?.pathname)
    } catch (e) {
      console.warn('Router set initialRoute failed', e)
    }
  })

  const followInitialRoute = () => {
    // this check is kinda dumb
    if (document.location.href.indexOf('/dev/') === -1) {
      console.log('Router followInitialRoute, not dev, bailing')
      return
    }
    const _projectId = get(projectId)
    if (!_projectId) {
      console.log('Router followInitialRoute, no projectId (yet), bailing')
      return
    }
    const localStorageKey = 'initialRoute.' + _projectId
    const initialRoute = window.localStorage.getItem(localStorageKey)
    if (!initialRoute) {
      console.log('Router followInitialRoute, initialRoute not set, bailing', { localStorageKey })
      return
    }
    const fakeEvent = { previewHistoryEvent: { location: { pathname: initialRoute } } }
    console.log('Router followInitialRoute, have initialRoute, navigating', { initialRoute, postMessage, fakeEvent })
    memoryHistory.navigate(initialRoute)
    postMessage?.(fakeEvent)
  }

  onMount(() => {
    console.log('Router, gonna followInitialRoute, from onMount')
    followInitialRoute()
  })

  $: if (projectId && $projectId) {
    console.log('Router, gonna followInitialRoute, from $projectId')
    followInitialRoute()
  }

  let history
  if (window.parent === window) {
    console.log('Router not in iframe, using hashHistory')
    history = hashHistory
  } else {
    console.log('Router in preview iframe, using memoryHistory')
    history = memoryHistory
  }

</script>

<Router history={history} primary={false}>
  <slot />
</Router>
