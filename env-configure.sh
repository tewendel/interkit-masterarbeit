#!/bin/bash

# This script updates a .env file by setting a specified domain and optionally a password
# usage: ./configure_env.sh -d example.com -p newPassword123
# usage: ./configure_env.sh -d example.com 

# Initialize variables
PASSWORD_PROVIDED=false
DOMAIN=""

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo "Error: .env file does not exist in the current directory."
  exit 1
fi

# Process arguments
while getopts ":d:p:" opt; do
  case $opt in
    d) DOMAIN="$OPTARG"
    ;;
    p) PASSWORD="$OPTARG"
       PASSWORD_PROVIDED=true
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    ;;
  esac
done

# Check if domain is provided
if [ -z "$DOMAIN" ]; then
  echo "Error: Domain not provided. Use -d to specify the domain."
  exit 1
fi

# Check for macOS or Linux for sed compatibility
if [[ "$(uname)" == "Darwin" ]]; then
  SED_INPLACE="sed -i ''"
else
  SED_INPLACE="sed -i"
fi

# Replace domain in .env file
$SED_INPLACE "s/demo.interkit.app/$DOMAIN/g" .env

# Update password if provided
if [ "$PASSWORD_PROVIDED" = true ]; then
  $SED_INPLACE "s/INTERKIT_BUNDLER_PASSWORD=.*/INTERKIT_BUNDLER_PASSWORD=$PASSWORD/" .env
fi

echo "Configuration updated in .env file."
