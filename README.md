# Interkit

Interkit is a flexible authoring system for browser-based real world experiences, playful urban interactions, location-based games, and more. 

*It is currently in early alpha stage.*

More information: https://interkit.app

Interkit is being developed in the context of the [Offene Welten](https://offenewelten.de/) project (in the framework of Digitalfonds der Kulturstiftung des Bundes).

### overview

- meteor-server reads and writes project files to repositories 
- svelte-admin is the authoring tool (Redaktionssystem)
- app-bundler compiles and bundles projects
- **check the readmes in individual components for setup and running**

### quick start

1) install all packages

````
npm install
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

#### run via tunnel (experimental)

If you want to test the app on another device inside your local network and have it access your local server, you can use [localtunnel](https://localtunnel.me/)

```
npm install -g localtunnel
npm run dev:tunnel
```
It should open 2 urls in the browser, you need to click the button on both for the warning to disappear.  
Then use the QR code "web preview" to open the the app on your device.

### deploy

````
cp docker-compose.env.live.example .env
vi .env
docker network create frontproxy
docker-compose -f docker-compose.yml -f docker-compose-proxy-live.yml up -d
````

#### optional: enable automatic db dumps

````
docker-compose -f docker-compose-backup.yml up -d
````


#### security considerations

- ⚠️ Make sure that `INTERKIT_BUNDLER_PASSWORD` in `.env` contains a random string
- you can use `openssl rand -hex 16` to generate a random string
- it is used to authenticate the connection from bundler to server
- repeat `docker-compose -f docker-compose.yml -f docker-compose-proxy-live.yml up -d` after changing the password on a running system


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
