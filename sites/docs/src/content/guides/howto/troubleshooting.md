## Troubleshooting

### Preview Iframe does not work

* We rely on inter-frame communication.
  Some script/ad blockers intercept this;
  switch yours off or add an exception.
* If you happen to run the server on `127.0.0.1` (check your `.env`s)
  but access admin in *incognito mode*, via `localhost`,
  the preview will fail (or you have to enable 3rd-party cookies).
  Cf. [this StackOverflow question](https://stackoverflow.com/q/30481516/629238).  
  Presumably also the case for other IPs vs domains.
* Also check the DevTools console for mentions of `window` and `iframe`.
