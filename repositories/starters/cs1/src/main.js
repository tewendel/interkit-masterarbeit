import '@capacitor/core';
import App from './App.svelte';

import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;
SplashScreen.hide()

import { InterkitClient } from 'interkit'

InterkitClient.connect(INTERKIT_SERVER_WEBSOCKETS_URL)

const app = new App({
	target: document.body
});

export default app;