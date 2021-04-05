<script>
	
  import '@capacitor-community/http';
  import { Plugins, FilesystemDirectory } from '@capacitor/core';

  const { Filesystem } = Plugins;

  import { onMount } from 'svelte'


  onMount(async ()=>{
    let serverBasePath = await Plugins.WebView.getServerBasePath()  
    console.log("serverBasePath", serverBasePath)    

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
 
    await readdir();

    await Filesystem.deleteFile({
      path: "public.zip",
      directory: FilesystemDirectory.Data
    });

    // check if directory with new code already exists, create serverBasePath for us and switch over
    if(await readdir("public")) {
      console.log("found updated source code, creating serverBasePath...")
      let uri = await Filesystem.getUri({
        path: "public/public",
        directory: FilesystemDirectory.Data
      })
      console.log("uri", uri);
      Plugins.WebView.setServerBasePath({ path: uri.uri.replace("file://", "") })
      
      // for now just stops - todo: manage versions to check for the newest version etc
      return
    }

    await readdir();
    
    try {
      const fileDownload = await Plugins.Http.downloadFile({
          url: `https://sebquack.uber.space/public.zip`,
          filePath: 'public.zip',
          fileDirectory: FilesystemDirectory.Data
        })
      console.log(fileDownload);
      filePath = fileDownload.path;      
      codePath = filePath.replace(".zip", "")
    } catch(e) {
      console.log(e)
    }

    await readdir();

    // Handle the result of the process
    var StatusCallback = async (status) => {
        console.log("status", status)
       
        await readdir("/public");

        if(confirm("switch to updated code now?")) {

          Plugins.WebView.setServerBasePath({ path: codePath.replace("file://", "") + "/public/" })
          
          let serverBasePath = await Plugins.WebView.getServerBasePath()  
          console.log("serverBasePath", serverBasePath)    

          //Plugins.WebView.persistServerBasePath()
          // this would be nice, but the absolute path changes every time the app opens!!
        }

    };

    // Handle the progress of the decompression
    var ProgressCallback = (progressEvent) => {
        var percent =  Math.round((progressEvent.loaded / progressEvent.total) * 100);

        // Display progress in the console : 8% ...
        console.log(percent + "%");
    };

    // Unzip it !
    window.zip.unzip(filePath, codePath, StatusCallback, ProgressCallback);

    
    })
    


</script>

<h1>hello, world</h1>