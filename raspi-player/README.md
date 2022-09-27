# Raspi-Player

An audio player for a chat channel

## Setup up

### 1. Set up a user in interkit project

1. go to `Users` in your project and create new user (for example `raspi`/`raspi`)

### 2. Set up raspberry

Prerequisites:  
- A Raspberry pi with the Raspios Bullseye Full and a valid user
- An interkit project with a user set up (see above)

#### clone repository

```
git clone https://gitlab.interkit.app/interkit/interkit-experiments.git
cd interkit-experiments
```

#### set up right node version

see https://github.com/nodesource/distributions/blob/master/README.md

to set up node 16, run
```
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### npm install

```
npm run install:packages
npm run install:raspi
```

#### run 

```
cd raspi-player
```

run `npm start` to see arguments

example:
```
npm start wss://api.v03.demo.interkit.app/websocket TB38WTNBewMYe6YYe raspi raspi
```

## Usage

Send a message to the user the raspi is logged in as, for example `  api.sendAudio("116d7e98-d6eb-4c79-bbfb-b374c054fb3d", {recipients: ["7Rs92jzSPWGvJiDwq"])`
})

## Troubleshooting

- Check if the audio output device is correct
- Check if the output volume is up (`alsamixer`)
- Use `wpa_supplicant.conf` of the `boot` partition to setup wifi