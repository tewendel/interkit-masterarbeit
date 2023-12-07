#!/bin/bash

# usage in cron: 0 5 * * * /home/username/playground-reset-containers.sh "tomorrow 05:00"

# Initialize NEXT_RUN_TIMESTAMP to 0
INTERKIT_PLAYGROUND_RESET_TIMESTAMP=0

# Check if a time offset parameter is provided
if [ -n "$1" ]; then
    # Calculate the timestamp for the provided time offset
    next_run_timestamp=$(date -d "$1" +%s)

    # Check if the date command was successful
    if [ $? -eq 0 ]; then
        # Update INTERKIT_PLAYGROUND_RESET_TIMESTAMP with the calculated timestamp
        INTERKIT_PLAYGROUND_RESET_TIMESTAMP=$next_run_timestamp
    else
        echo "Error: Invalid time offset format."
        exit 1
    fi
fi

# Get the directory of the script
script_dir="$(dirname "$0")"

# Change to the directory of the script
cd "$script_dir" || exit

echo "running from $script_dir"

# Display the timestamp
echo "INTERKIT_PLAYGROUND_RESET_TIMESTAMP is: $INTERKIT_PLAYGROUND_RESET_TIMESTAMP"

# Export INTERKIT_PLAYGROUND_RESET_TIMESTAMP
export INTERKIT_PLAYGROUND_RESET_TIMESTAMP

docker compose down -v
docker compose pull
docker compose up -d
