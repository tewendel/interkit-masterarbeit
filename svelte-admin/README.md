# interkit admin

Based on [Svelte](https://svelte.dev) / https://github.com/sveltejs/template.
## develop

### requirements

- npm >= 7 to use workspaces
- node >= 12

### setup

Copy `.env.example` to `.env`

```bash
cp .env.example .env
```

Install the dependencies...

```bash
cd svelte-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). ## Building and running in production mode

## build

To create an optimised version of the app:

```bash
npm run build
```
## Environment Variable substitution

Global variables are defined in `src/globals.envsub.js`. When the webserver is started, `$VAR` get substituted by the variable in .env (development) or in the environment (production).

(Maybe put them in index.html and get rid of globals.envsub.js)