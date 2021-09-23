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
