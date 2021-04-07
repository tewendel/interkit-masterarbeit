import '@capacitor-community/http';
import { Plugins, FilesystemDirectory } from '@capacitor/core';

const { Filesystem } = Plugins;

let filePath;
let codePath;

const readdir = async (path = "") => {
  try {
    let ret = await Filesystem.readdir({
      path,
      directory: FilesystemDirectory.Data
    });
    console.log("readdir", path, ret)
    if(ret.files.length) return true;
  } catch(e) {
    console.error('Unable to read dir', e);
  }
}
 
const downloadBundle = async (bundleZipURL) => {

  // delete bundle zip if there is already one 
  try {
    await Filesystem.deleteFile({
      path: "bundle.zip",
      directory: FilesystemDirectory.Data
    });
  } catch(e) {
    console.log(e)
  }

  console.log("attempting download of", bundleZipURL)

  // do the download and save the absolute paths
  try {
    const fileDownload = await Plugins.Http.downloadFile({
        url: bundleZipURL,
        filePath: 'bundle.zip',
        fileDirectory: FilesystemDirectory.Data
      })
    console.log("download complete: " + JSON.stringify(fileDownload));
    filePath = fileDownload.path;      
    codePath = filePath.replace(".zip", "")
  } catch(e) {
    console.log(JSON.stringify(e))
  }

  await readdir();
}

const unzipBundle = async () => {
  return new Promise((resolve, reject) => {

    // Handle the result of the process
    const StatusCallback = async (status) => {
        console.log("unzip done, status", status)     
        await readdir("/bundle");
        if(status == 0)
          resolve();
        else
          reject();
    };

    // Handle the progress of the decompression
    const ProgressCallback = (progressEvent) => {
        var percent =  Math.round((progressEvent.loaded / progressEvent.total) * 100);
        // Display progress in the console : 8% ...
        console.log(percent + "%");
    };

    // Unzip it !
    window.zip.unzip(filePath, codePath, StatusCallback, ProgressCallback);

  })
}
  
const activateBundle = async () => {
  
  Plugins.WebView.setServerBasePath({ path: codePath.replace("file://", "") })
  
  let serverBasePath = await Plugins.WebView.getServerBasePath()  
  console.log("serverBasePath", serverBasePath)    

  //Plugins.WebView.persistServerBasePath()
  // this would be nice, but on iOS the absolute path changes every time the app opens!!
}

const downloadAndActivateBundle = async (bundleZipURL) => {
  await downloadBundle(bundleZipURL);
  await unzipBundle();
  await activateBundle();
}

const activateInstalledBundle = async () => {

  let serverBasePath = await Plugins.WebView.getServerBasePath()  
  console.log("serverBasePath", serverBasePath)    
  
  // check if directory with new code already exists, create serverBasePath for us and switch over
  if(await readdir("bundle")) {
    console.log("found updated source code, creating serverBasePath...")
    let uri = await Filesystem.getUri({
      path: "bundle/bundle",
      directory: FilesystemDirectory.Data
    })
    console.log("uri", uri);
    Plugins.WebView.setServerBasePath({ path: uri.uri.replace("file://", "") })
  }
}

const InterkitLiveReload = {
  downloadAndActivateBundle,
  activateInstalledBundle
}

export default InterkitLiveReload;