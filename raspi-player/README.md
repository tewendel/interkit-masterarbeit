# Raspi-Player

An audio player for a chat channel

## Setup up

### 1. Set up a user in interkit project

1. go to `Users` in your project and create new user (for example `raspi`/`raspi`)

### 2. Set up raspberry

Prerequisites:  
- A Raspberry pi with the Raspios Bullseye Full and a valid user
- An interkit project with a user set up (see above)

#### set up audio

if you want to use the regular audio-out jack, run `sudo raspi-config`, go to `1 > S2 Audio` and enable `headphones`. Then `sudo reboot`


#### set up right node version

see https://github.com/nodesource/distributions/blob/master/README.md

to set up node 16, run
```
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### clone repository

```
git clone https://gitlab.interkit.app/interkit/interkit-experiments.git
cd interkit-experiments
```

#### npm install

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

### (Optional) 3. Make it persistent and recover from crashes

#### install pm2

```
npm i -g pm2
```

#### run your command with pm2

use you command with `pm2 start`, for example:  
```
npm start --restart-delay=60000 "npm start wss://api.v03.demo.interkit.app/websocket TB38WTNBewMYe6YYe raspi raspi"
```

#### restore at startup

(see https://pm2.keymetrics.io/docs/usage/startup/)

1. run `pm2 startup`
2. execute the command it spits out: `sudo env ...`
3. reboot
4. it should replay the audio it played on startup

## Usage

Send a message to the user the raspi is logged in as, for example `  api.sendAudio("116d7e98-d6eb-4c79-bbfb-b374c054fb3d", {recipients: ["7Rs92jzSPWGvJiDwq"])`
})

## Troubleshooting

- Check if the audio output device is correct
- Check if the output volume is up (`alsamixer`)
- Use `wpa_supplicant.conf` of the `boot` partition to setup wifi
- If the connection works, but audio does not play, you can test audio playing with `cvlc raspi-player/tmp/xxx.mp3`, where `xxx.mp3` is the audio file that the raspi-player downloaded

