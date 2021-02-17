import { writable } from 'svelte/store';

export const compileError = writable(null);

let bundleServerURL;
let projectId;

const reloadPreview = () => {
    document.getElementById('app-preview').src = document.getElementById('app-preview').src
};

const compileProject = async () => {
  const res = await fetch(bundleServerURL + "/compile/" + projectId)
  const resJSON = await res.json()
  console.log(resJSON)
  if(resJSON.status == "error") {
    compileError.set(
      resJSON.data.name + " at " + resJSON.data.filename + "\n" 
      + resJSON.data.message + " \n" 
      + resJSON.data.frame
    )
  } else {
    compileError.set(null)
  }

};

export const BundleServer = {
  init: async (_projectId, url) => {
    bundleServerURL = url;
    projectId = _projectId;
    console.log(bundleServerURL, projectId)
  },
  
  compileReloadPreview: async () => {
    await compileProject();
    reloadPreview();
  }
}


