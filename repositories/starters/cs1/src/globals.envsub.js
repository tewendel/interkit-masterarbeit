// global variables that should be in the bundle at runtime, coming from .env or environment are defined here

let params = (new URL(document.location)).searchParams;

INTERKIT_PROJECT_ID = params.get("projectId")
console.log(`INTERKIT_PROJECT_ID=${INTERKIT_PROJECT_ID}`)

INTERKIT_APP_LOAD_THEME = params.get("loadTheme") === "true";
INTERKIT_SERVER_WEBSOCKETS_URL = "$INTERKIT_SERVER_WEBSOCKETS_URL"

console.log(`INTERKIT_SERVER_WEBSOCKETS_URL=${INTERKIT_SERVER_WEBSOCKETS_URL}`)
console.log(`INTERKIT_APP_LOAD_THEME=${INTERKIT_APP_LOAD_THEME}`)