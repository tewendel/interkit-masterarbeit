#/bin/sh

SUB=interkit-1234
SUB_BUNDLER=$SUB-bundler
SUB_SERVER=$SUB-server

lt --port 3000 -s $SUB_SERVER &
lt --port 4000 -s $SUB_BUNDLER &

export INTERKIT_SERVER_URL=https://${SUB_SERVER}.loca.lt 
export INTERKIT_SERVER_WEBSOCKETS_URL=wss://${SUB_SERVER}.loca.lt/websocket 
export INTERKIT_BUNDLER_URL=https://${SUB_BUNDLER}.loca.lt 
export BUNDLER_URL=https://${SUB_BUNDLER}.loca.lt 

npm run dev

# https://stackoverflow.com/questions/360201/how-do-i-kill-background-processes-jobs-when-my-shell-script-exits
trap 'kill $(jobs -p)' EXIT