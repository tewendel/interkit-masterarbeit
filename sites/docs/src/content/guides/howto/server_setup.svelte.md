# How to setup your own interkit server

## Table of contents

In this guide, you will set up a server instance running interkit, using the available docker images.

Note: Also see the main [main readme](https://gitlab.interkit.app/interkit/interkit-experiments)

## create server (if you don't have one)

- book a server instance, e.g. Hetzner CPX11
- connect a domain, for example `my-interkit-server.de` 
  - using an A record pointing to your server instance ip address
  - also set up a wildcard A record from `*.my-interkit-server.de` pointing to your server instance ip address

For more detailed information on working with custom domains, see [Custom Domains](/guides/howto/custom_domain)

## update and install prerequisites

- ssh into the server `ssh root@my-interkit-server.de`
- update `apt-get update && apt-get upgrade`
- set timezone `timedatectl set-timezone Europe/Berlin`
- install docker engine, for ubuntu see https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository

## download .env and docker compose files

- create an empty directory on your server, for example `mkdir my-interkit-server && cd my-interkit-server`
- download these three files from the interkit gitlab repository:
  - `wget https://gitlab.interkit.app/interkit/interkit-experiments/-/raw/v04/docker-compose.env.live.example`
  - `wget https://gitlab.interkit.app/interkit/interkit-experiments/-/raw/v04/docker-compose.yml`
  - `wget https://gitlab.interkit.app/interkit/interkit-experiments/-/raw/v04/docker-compose-proxy-live.yml`

## configure .env

- make a copy of the environment file with `cp docker-compose.env.live.example .env` and edit it with `vi .env`
- set all the subdomains by replacing `demo.interkit.app` with `my-interkit-server.de`, for example
  - `api.my-interkit-server.de`
  - `admin.my-interkit-server.de`
  - `app.my-interkit-server.de`
- set the `INTERKIT_IMAGE_TAG` variable to the latest version from https://hub.docker.com/r/interkit/server/tags
  - for example `INTERKIT_IMAGE_TAG=v03-dd2f5ac3`

## start the server

- `docker network create frontproxy`
- `docker compose -f docker-compose.yml -f docker-compose-proxy-live.yml up -d`

see also [main readme, deploy section](https://gitlab.interkit.app/interkit/interkit-experiments#deploy) 

## update new images

After changing your .env with a new image tag, do

- `docker compose pull`
- `docker compose -f docker-compose.yml -f docker-compose-proxy-live.yml up -d`

## freeing up disk space on your server

After pulling many images, you might need to free up disk space on the server to remove old images

- `docker system df` to check how much disk space is available
- `docker image prune -a` - delete unused images
- `docker system prune` - delete unused containers


## setup project repository on the new interkit server

It is possible to optionally connect your interkit project to an external repository

- if the repository you would like to use is a private repo in gitlab, create an access token with read/write developer access, remember `NAME` and `TOKEN` for later

### create a new interkit project and link it to an external repository

- log into admin on your interkit server
- create a new project
- go to the repository tab
- go to the cloudcmd tab
- enter your admin password
- in the cloudcmd shell, cd into your project directory (use the hint dockerized: displayed above)
- add an origin to your project respository, for example (using gitlab and access token for private repos)
`git remote add origin https://{NAME}:{TOKEN}@gitlab.interkit.app/my-user/my-project.git`
- now you should be a able to push to this origin

### connect an existing interkit project from an external repository

- log into admin on your interkit server
- create new project
  - enter a name for the project
  - enter the git repository url, for example `https://{NAME}:{TOKEN}@gitlab.interkit.app/my-user/my-project.git`
  - press "create project"
  - wait a bit
- enter the new project and check that the component composition is there
- import a database

## update the interkit server

- change `INTERKIT_IMAGE_TAG` in `.env` to desired interkit version (see https://gitlab.interkit.app/interkit/interkit-experiments/-/pipelines)
- `docker compose -f docker-compose.yml -f docker-compose-proxy-live.yml pull`
- `docker compose -f docker-compose.yml -f docker-compose-proxy-live.yml up -d`

### troubleshooting
- check if `.env` needs different variables compared to last deployed version
- check if `docker-compose.yml` has different options compared to last deployed version
