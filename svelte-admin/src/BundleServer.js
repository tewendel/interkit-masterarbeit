import { writable } from 'svelte/store';

export const compileError = writable(null);
export const runtimeError = writable(null);
export const bundleProcessing = writable(false);
export const bundleNotBuilt = writable(false);
export const buildHash = writable("0");

let bundleServerURL;
let projectId;

const reloadPreview = () => {
    buildHash.set(Date.now()+"")
    runtimeError.set(null)
};

const compileProject = async (dev=false) => {
  const res = await fetch(bundleServerURL + "/compile/" + projectId + (dev ? "/?dev" : ""))
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

const connect = async (url) => {
  if(!bundleServerURL) {
    bundleServerURL = url
    console.log("Bundle Server connected to " + bundleServerURL)
    // TODO maybe test connection and return result
  }
}

const duplicateProject = async (projectId, newProjectId) => {
  // TODO sending the newProjectId here is a possible attack vector, maybe the other server should do this
  const res = await fetch(bundleServerURL + "/app/" + newProjectId + "/?from=" + projectId, { method: "PUT"})
  const resJSON = await res.json()
  console.log(resJSON)
}

const initProject = async (_projectId) => {

  projectId = _projectId;
  console.log(bundleServerURL, projectId)

  window.addEventListener("message", (event) => {
    console.log(event.data)
    runtimeError.set(event.data.msg + " (check browser console for details)")
  }, false);
}

const compileReloadPreview = async (dev=false) => {
  bundleProcessing.set(true)
  await compileProject(dev);
  bundleProcessing.set(false)
  bundleNotBuilt.set(dev)
  reloadPreview();
}

const gitStatus = async (projectId) => {
  const res = await fetch(bundleServerURL + "/git/status/" + projectId)
  const resJSON = await res.json()
  return resJSON
}

const loadBlockData = async (projectId) => {
  const res = await fetch(bundleServerURL + "/components/" + projectId)
  const resJSON = await res.json()
  return resJSON 
}

export const BundleServer = {
  connect,
  getServerURL: () => bundleServerURL,
  initProject,
  compileReloadPreview,
  reloadPreview,
  duplicateProject,
  gitStatus,
  loadBlockData
}

