proof of concept for creating, editing, compiling and bundling svelte apps with a meteor/svelte authoring system

- meteor-server reads and writes project files to repositories 
- app-bundler compiles and bundles projects

- check the readmes in individual components for setup and running

### quick start

install all packages

````
npm run install:all
````

run the relevant systems in one shell

````
npm run dev
````

````
open http://localhost:5000
````

### deploy

````
cp docker-compose.env.live.example .env
vi .env
docker-compose up -d
````
