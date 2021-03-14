import cloudcmd from 'cloudcmd';

const config = {
  "name": "interkit project file editor",       // set tab name in web browser
  //"auth"                  : false,    // enable http authentication
  //"username"              : "root",   // username for authentication
  //"password"              : "toor",   // password hash for authentication
  "algo": "sha512WithRSAEncryption", // cryptographic algorithm
  "editor": "edward", // default, could be "dword" or "edward"
  "packer": "tar",    // default, could be "tar" or "zip"
  "diff": true,     // when save - send patch, not whole file
  "zip": true,     // zip text before send / unzip before save
  "buffer": true,     // buffer for copying files
  "dirStorage": true,     // store directory listing
  "online": false,    // do not load js files from cdn
  //"open"                  : true,     // open web browser when server started
  "oneFilePanel": true,    // show one file panel
  "keysPanel": true,     // show classic panel with buttons of keys
  //"port"                  : 8000,     // http port
  "ip": null,     // ip or null(default)
  "root": process.env.REPOSITORIES_PATH + "/projects",      // root directory
  //"prefix"                : "",       // url prefix
  //"prefixSocket"          : "",       // prefix for socket connection
  "confirmCopy": true,     // confirm copy
  "confirmMove": true,     // confirm move
  "showConfig": true,    // show config at startup
  "showFileName": true,    // do not show file name in view and edit
  "contact": true,     // enable contact
  "configDialog": true,     // enable config dialog
  "configAuth": true,     // enable auth change in config dialog
  "console": true,     // enable console
  "syncConsolePath": false,    // do not sync console path
  "terminal": false,    // disable terminal
  "terminalPath": "",       // path of a terminal
  "terminalCommand": "",       // set command to run in terminal
  "terminalAutoRestart": true,     // restart command on exit
  "vim": false,    // disable vim hot keys
  "columns": "name-size-date", //"name-size-date-owner-mode", // set visible columns
  "export": false,    // enable export of config through a server
  "exportToken": "root",   // token used by export server
  "import": false,    // enable import of config
  "import-url": "http://localhost:8000",   // url of an export server
  "importToken": "root",   // token used to connect to export server
  "importListen": false,    // listen on config updates
  "dropbox": false,    // disable dropbox integration
  "dropboxToken": "",       // unset dropbox token
  "log": true     // logging
};

const filePicker = {
  data: {
    FilePicker: {
      key: 'key',
    },
  },
};

// override option from json/modules.json
const modules = {
  filePicker,
};

const {
  createConfigManager,
  configPath,
} = cloudcmd;

const configManager = createConfigManager({
  configPath,
});

const setup_cloudcmd = socket => cloudcmd({
  socket, // used by Config, Edit (optional) and Console (required)
  config, // config data (optional)
  modules, // optional
  configManager, // optional
})

export { setup_cloudcmd }