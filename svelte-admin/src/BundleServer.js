import { writable } from 'svelte/store';

export const compileError = writable(null);
export const runtimeError = writable(null);
export const bundleProcessing = writable(false);

let bundleServerURL;
let projectId;

const reloadPreview = () => {
    document.getElementById('app-preview').src = document.getElementById('app-preview').src
    runtimeError.set(null)
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

    window.addEventListener("message", (event) => {
      console.log(event.data)
      runtimeError.set(event.data.msg + " (check browser console for details)")
    }, false);
  },
  
  compileReloadPreview: async () => {
    bundleProcessing.set(true)
    await compileProject();
    bundleProcessing.set(false)
    reloadPreview();
  },
  
  reloadPreview
}


