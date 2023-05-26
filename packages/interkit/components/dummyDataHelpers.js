import { getContext } from 'svelte';
import { readable } from 'svelte/store';
import { InterkitClient, util } from "..";

const getShowDummyDataStore = () => {

  

  if (getContext("showDummyData")) {
    return readable(true);
  } else {
    return InterkitClient.showDummyData
  };
}

export { getShowDummyDataStore };