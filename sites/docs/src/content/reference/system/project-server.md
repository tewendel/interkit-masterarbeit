<script>
    import Mermaid from "../../../components/Mermaid.svelte"

    const graph = `
        graph TD

        Bundler[Bundler]
        Project(Project Server)
        Server(MeteorServer)
        Admin[Admin UI]
        
        Bundler -->|shell, env| Project
        Project --> |process,stdout,stderr| Bundler
        Server --- |ws| Project
        Server --- |ws| Admin 
        Server --- |ws| Bundler 
    `
    const legend = [{
        abbr: "ws",
        desc: "Websocket"
    }]
</script>

# Project server

The `Project Server` is a node application that runs the server-side code of a project. Things like
- replying to chat messages
- changing the project database

<Mermaid code={graph} {legend} />

