import { writable } from 'svelte/store'

export const projectId = writable()

export const secondaryTabIndex = writable(0);
export const secondaryTabsVisible = writable(true);