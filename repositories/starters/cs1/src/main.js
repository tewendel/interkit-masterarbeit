import '@capacitor/core';
import App from './App.svelte';

import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;
SplashScreen.hide()

const app = new App({
	target: document.body
});

export default app;