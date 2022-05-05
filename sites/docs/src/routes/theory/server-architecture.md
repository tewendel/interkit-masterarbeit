# server architecture

````mermaid
graph TD

    server[[Data Server]]
    bundler[[App Server]]
    admin[[Admin Server]]

    app(( App ))
    redaktion((Admin App))
    
    db[(Database)]
    media[(Media Files)]
    starter(Starter App)
    repositories[(App Repositories)]

    server ==== |ddp| bundler
    server ==== |ddp| app
    server ==== |ddp| redaktion 

    server --- |tcp| db
    server --- |mount| media

    bundler --- |http| app
    bundler --- |integrated| starter
    bundler --- |mount| repositories
    bundler --- |http| redaktion

    admin --- |http| redaktion
````