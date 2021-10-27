# Interkit

Interkit is a flexible authoring system for browser-based real world experiences, playful urban interactions, location-based games, and more. 

*It is currently in early alpha stage.*

- meteor-server reads and writes project files to repositories 
- svelte-admin is the authoring tool (Redaktionssystem)
- app-bundler compiles and bundles projects
- check the readmes in individual components for setup and running

### quick start

1) install all packages

````
npm run install:all
````

you may additionally need to install meteor with

````
npm install -g meteor
````

2) update .env files in /app-bundler, /meteor-server, /svelte-admin (see READMEs in those folders for details)

3) create folder /repositories/projects

4) run the relevant systems in one shell

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
docker network create frontproxy
docker-compose -f docker-compose.yml -f docker-compose-proxy-live.yml up -d
````

### deploy multiple versions on one server instance for staging

````
# clone interkits
git clone ... interkit1
git clone ... interkit2

# start reverse proxy
cd interkit1
docker network create frontproxy
docker-compose -f docker-compose-proxy-staging.yml up -d
cd ..

# start instance 1
cd interkit1
cp docker-compose.env.live.example .env
vi .env
docker-compose up -d
cd ..

# start instance 2
cd interkit2
cp docker-compose.env.live.example .env
vi .env
docker-compose up -d
````

### deploy locally
````
docker network create frontproxy
docker-compose -f docker-compose-proxy-local.yml -f docker-compose.yml --env-file docker-compose.env.local.example up
open http://admin.localhost
````

### build & deploy locally
````
docker network create frontproxy
docker-compose -f docker-compose-proxy-local.yml up -d
INTERKIT_IMAGE_TAG=local docker-compose build
INTERKIT_IMAGE_TAG=local docker-compose --env-file docker-compose.env.local.example up 
open http://admin.localhost
````

### update

````
git pull
docker build -f Dockerfile.interkit-packages -t interkit/interkit-packages:latest .
docker-compose up -d --build
````

### Contributing

It is too early to seriously collaborate but let us know if you're interested. See contac tinformation on http://interkit.app

Interkit development is funded by Offene Welten (Teil des Digitalfonds der Kulturstiftung des Bundes)
