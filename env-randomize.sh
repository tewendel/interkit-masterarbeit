#!/bin/bash

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo "Error: .env file does not exist in the current directory."
  exit 1
fi

# Generate a random password
RANDOM_PASSWORD=$(openssl rand -base64 12)

# Check for macOS or Linux for sed compatibility
if [[ "$(uname)" == "Darwin" ]]; then
  SED_INPLACE="sed -i ''"
else
  SED_INPLACE="sed -i"
fi

# Update password in .env file
$SED_INPLACE "s/INTERKIT_BUNDLER_PASSWORD=.*/INTERKIT_BUNDLER_PASSWORD=$RANDOM_PASSWORD/" .env

echo "INTERKIT_BUNDLER_PASSWORD updated with a random value in .env file."
