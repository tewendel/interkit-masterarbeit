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

<Mermaid code={graph} {legend} />