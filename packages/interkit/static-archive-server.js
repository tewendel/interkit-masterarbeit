/*
  here we implement a subset of SimpleDDP functionality to use when no server connection is available
  see https://github.com/Gregivy/simpleddp
*/

import projectApi from './project-api.js';
import { setupMessageHandling } from './project-server.js';
import { v4 as uuidv4 } from 'uuid';

/*
  StaticCollection is a replacement for collections in simpleddp
*/

class StaticCollection {
  constructor(name, data) {
    this.name = name
    this._data = data ? data : []
    this.changeHandlers = []
  }
  insert(obj) {
    const id = uuidv4()
    this._data.push({
      ...obj,
      id,
      _id: id
    })
    this.runChangeHandlers()
  }
  filter(filterMethod) {
    this.filterMethod = filterMethod
    return this
  }
  fetch() {
    if(typeof this.filterMethod == "function") {
      return this._data.filter(this.filterMethod)
    } else {
      return this._data
    }
  }
  onChange(changeHandler) {
    console.log("StaticCollection set changeHandler", this.name, changeHandler)
    this.changeHandlers.push(changeHandler)    
  }
  runChangeHandlers() {
    console.log("StaticCollection runChangeHandlers", this.name, this.changeHandlers)
    for(let changeHandler of this.changeHandlers) {
      if(typeof changeHandler == "function") {
        changeHandler(this._data)
      } 
    }    
  }
  data() {
    return this.fetch()
  }
  reactive() {
    return this
  }
}

/*
  StaticArchiveServer is intended as a drop-in replacement for the SimpleDDP server used throughout interkit meteor server calls are simulated
*/

export class StaticArchiveServer {
  constructor(archiveData) {
    console.log("StaticArchiveServer constructor", archiveData)
    this.archiveData = archiveData
    this.projectId = archiveData.project._id
    this.collections = {
      rows: new StaticCollection("rows", this.archiveData.rows),
      mediafiles: new StaticCollection("mediafiles", this.archiveData.mediafiles),
      users: new StaticCollection("users", []),
      messages: new StaticCollection("messages", []),
      scheduled_events: new StaticCollection("scheduled_events", []),
    }
    this.eventHandlers = {}
  }

  // register event handlers
  on(eventName, method) {
    this.eventHandlers[eventName] = method
    console.log("StaticArchiveServer event handlers", this.eventHandlers)
  }

  async connect() {
    // start the browser based project server
    await initBrowserProjectServer({server: this, projectId: this.projectId})

    // call connected event handler after
    if(typeof this.eventHandlers.connected == 'function') {
      this.eventHandlers.connected()
    }

    return Promise.resolve(true);
  }

  // we have only one user with a special id "archiveUser"
  async login(credentials) {
    console.log("StaticArchiveServer login")
    return Promise.resolve({id: "archiveUser"})
  }

  sub(pub, pubArgs) {
    // not so easy to implement
    // problem: how do we deal with conflicting subscriptions when project-server and interkit-client are in the same environment (browser)?
    // this was an issue when project-server subscribes to messages.unhandled that exlcudes messages wth origin "handler"
    let sub = {
      ready: () => { return Promise.resolve(true) },
    }
    return sub
  }

  subscribe(pub, pubArgs) {
    return this.sub(pub, pubArgs)
  }

  collection(colName) { 
    return this.collections[colName] 
  }

  // helpers

  getProjectUserData() {
    return this.collections.users._data[0]?.projectUserData[this.projectId]
  }

  setProjectUserData(data) {
    this.collections.users._data[0].projectUserData[this.projectId] = data
    console.log("StaticArchiveServer setProjectUserData", data, this.collections.users._data[0].projectUserData[this.projectId])
    this.collections.users.runChangeHandlers()
  }

  // call - here are all the simulations of meteor calls

  async call(methodName, params) {
    console.log("StaticArchiveServer call", methodName, params)
    
    let result = true
    let projectUserData = this.getProjectUserData()

    switch(methodName) {
      case "resumeUserSession":
        result = false // for now, have client create a new user each time
        break
      case "createProjectTokenUser":
        // we only have one user and one project
        if(this.collections.users._data.length == 0) {
          this.collections.users.insert({
            _id: "archiveUser",
            id: "archiveUser",
            projectUserData: {
              [this.projectId]: params?.projectData || {}
            }
          })
        }
        break
      case "user.getProjectUserData":
        result = projectUserData
        break
      case "user.updateUserProjectData":
        if(!projectUserData) projectUserData = {}
        projectUserData[params.key] = params.value
        this.setProjectUserData(projectUserData)
        result = 1
        break
      case "user.updateUserBoardArrivalState":
        let { boardId, nodeId, status } = params
        projectUserData.boardState[boardId] = {
          nodeId,
          status
        }
        this.setProjectUserData(projectUserData)
        break
      case "message.send":
        let { projectId, channel_key, sender, recipients=[], payload, origin } = params
        this.collections.messages.insert({
          projectId,
          sender,
          recipients,
          recipientsCount: recipients.length,
          channel_key,
          payload,
          origin,
          createdAt: new Date()
        })
    }
    return Promise.resolve(result)
  }
  
}

/*
  initBrowserProjectServer starts project server in browser - coresponds to the server/main.js in the client
*/

const initBrowserProjectServer = async ({server, projectId}) => {

  const currentUrl = new URL(window.location.href);
  const urlWithoutQuery = currentUrl.origin + currentUrl.pathname;      
  const handlersDir = urlWithoutQuery + "/archive/handlers"

  // read handlers from archive
  const handlersFiles = server.archiveData.handlersFiles
  
  // dynamically import the handlers
  let handlers = {}
  if(handlersFiles) {
    for (let handlerFile of handlersFiles) {
        let handler = await import(handlersDir + "/" + handlerFile)
        handlers[handlerFile.substring(0, handlerFile.length - 3)] = handler
        console.log(`imported ${handlerFile}`)
    }
  }
  
  setupMessageHandling({
    handlers, 
    projectApi, 
    server, 
    projectId,
    archiveData: server.archiveData
  })
  
}