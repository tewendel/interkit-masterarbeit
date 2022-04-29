# How to setup your own interkit server

Note: Also see the main [main readme](https://gitlab.interkit.app/interkit/interkit-experiments)

## create server (if you don't have one)

- book a server instance, e.g. Hetzner CPX11
- update `apt-get update && apt-get upgrade`
- set timezone `timedatectl set-timezone Europe/Berlin`
- install docker, see https://docs.docker.com/get-docker/
- install docker-compose
  - either see https://docs.docker.com/compose/install/ and use command `docker compose` later
  - or try `apt-get install docker-compose` and use command `docker-compose` later
- connect a domain, for example `my-interkit-server.de`

## configure and start server

see [main readme, deploy section](https://gitlab.interkit.app/interkit/interkit-experiments#deploy) for instructions

### get `.env` variables right

make sure to set the subdomains well, for example
- admin.my-interkit-server.de
- app.my-interkit-server.de
- server.my-interkit-server.de

make sure to get the latest image versions
- use the latest tag for all images https://hub.docker.com/r/interkit/server/tags

## setup project repository on the new interkit server

Do you already have an interkit project that is on a public git repository?

- make sure it is publicly clonable
  - if it is in a private gitlab, create an access token with read/write developer access, remember `NAME` and `TOKEN` for later
- log into admin on your interkit server
- create new project
  - enter a name for the project
  - enter the git repository url
  - press "create project"
  - wait a bit
- enter the new project and check that the component composition is there
- import a database

## update the interkit server

- change `INTERKIT_IMAGE_TAG` in `.env` to desired interkit version (see https://gitlab.interkit.app/interkit/interkit-experiments/-/pipelines)

### troubleshooting
- check if `.env` needs different variables compared to last deployed version
- check if `docker-compose.yml` has different options compared to last deployed version
