import '@capacitor/core';
import App from './App.svelte';

// use this if we want this app to switch to a previously downloaded bundle
// import { InterkitLiveReload } from 'interkit'
// InterkitLiveReload.activateInstalledBundle();

const app = new App({
	target: document.body
});

export default app;