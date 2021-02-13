let bundleServerURL;
let projectId;

const reloadPreview = () => {
    document.getElementById('app-preview').src = document.getElementById('app-preview').src
};

const compileProject = async () => {
  const res = await fetch(bundleServerURL + "/compile/" + projectId)
  console.log(res)
};

const BundleServer = {
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

export default BundleServer;


