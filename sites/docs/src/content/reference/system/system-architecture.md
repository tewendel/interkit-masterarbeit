<script>
    import Mermaid from "../../../components/Mermaid.svelte"

    const graph = `
        graph TD

            subgraph c0 [Server]
            subgraph c1 [Server Container]
                server[[Data Server]]
            end
            subgraph c2 [Bundler Container]
                bundler[[Bundle Server]]
                starter(Starter App)
                projectserver[Project Server]
            end
            subgraph c3 [Admin Container]
                admin[[Admin Server]]
            end
                

            db[(Database)]
            media[(Media Files)]
            repositories[(App Repositories)]
            end

            subgraph Browser
            app(( Web App ))
            redaktion((Redaktionssystem))
            end

            server === |ddp| bundler
            server === |ddp| app
            server === |ddp| redaktion 
            server === |ddp| projectserver

            server -.- |tcp| db
            server -.- |mount| media

            bundler --- |http| app
            bundler -.- |directory| starter
            bundler -.- |mount| repositories
            bundler --- |http| redaktion
            bundler -.-> |process| projectserver

            admin ----- |http| redaktion
                
            class c1,c2,c3 container;
            classDef container fill:#fff,stroke:#444,stroke-width:3px
            classDef server fill:#eee
    `

    const legend = [{
        abbr: "ws",
        desc: "Websocket Connection"
    },{
        abbr: "ddp",
        desc: "Distributed Data Protocol"
    }
    ]
</script>

# System Architecture

Interkit consists of three elements. In the standard installation via Docker, each runs in it's own container.

## Server

A meteorjs backe-end server that handles
- the database (see [collections](collections))
- `media files` (uploaded files)

Every project, as well as the admin interface, needs to connect to an interkit server

## Bundler

A node back-end server that handles project files and repositories.
- serves projects via HTTP
- runs vite servers for project development
- runs `project servers` ("story")
- manages project repositories with `git`.
- has several RPC and REST interfaces
- connects to server via ddp

The bundler is required for the admin interface to work. Apart from that, projects are able to run standalone.

## Admin

A svelte front-end to edit projects (Redaktionssystem / admin interface). It connects to the server and sends requests to the bundler in order to manage project files.

# Graph

This graph illustrates the connections between the subsystems and containers.

<Mermaid code={graph} {legend} />