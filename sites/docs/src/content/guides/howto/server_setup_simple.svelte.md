<script>
  import cloudInit from '$repo/cloud-init.yml?raw'
</script>

# Simpe Step by Step Guide to Set Up an Interkit Server

## What is this about?

This is a guide to set up an interkit server aimed at non-technical people. If you want to go through the process manually, please have a look at [Set up your own interkit server](server_setup)

## Overview

There are three steps

1. Get a Domain
2. Set up the Server
3. Connect Domain and Server

## Get a domain

### Already have a domain?

Dou you already have a [Top Level Domain](https://de.wikipedia.org/wiki/Top-Level-Domain) such as `myinstitution.com` that you want to use (directly or with a subdomain such as `interkit.myinstitution.com`)? ☞ Continue with `Server Setup`

### Need a new domain

If you want to have a new Top Level Domain such as `myinterkit.com`, there are many providers to chose from. Here are some examples:

- [Namecheap (U.S.)](https://www.namecheap.com/)
- [Hetzner (Germany)](https://www.hetzner.com/de/domainregistration)
- [INWX (Germany)](https://www.inwx.de/de)

This tutorial does not cover the domain registration process, please read on at the provider of your choice.

☝ You only need the domain registration – no hosting is required at this step

## Set up the Server

### Chose a provider

We want to set up the interkit server on a virtual server instance. There are many provider. Here are some examples:

- [Digital Ocean (U.S.)](https://www.digitalocean.com/)
- [Hetzner (Germany)](https://www.hetzner.com/de/cloud)

### Detailed steps for Hetzner

We will cover `Hetzner` because this is what we have used so far.

Set up an account and add payment details first. Then continue the process in the web interface:

1. Go to the "Cloud Console" https://console.hetzner.cloud/projects
2. Create a "New Project" and give it a name such as "interkit" or the name of your project
3. Enter the project, click "Add Server" and chose these options:

| Step              | Action                                                                         |
|-------------------|--------------------------------------------------------------------------------|
| `Location`        | Chose a location that is close to you                                     |
| `Image`           | Chose `Ubuntu`                                                            |
| `Type`            | Chose "Shared". Select a package with 2 or more vCPUs, for example `CPX11`. You can always increase this later if your project needs it.                                                      |
| `Networking`      | IPv4 and IPv6 (Default)                                            |
| `SSH key`         | If you know what it is, you can add a public SSH key, otherwise just keep it empty |
| `Volumes`         | keep blank                                                          |
| `Firewalls`       | keep blank                                                          |
| `Backups`         | Not required, but you can check `Backups` for additional recoverability in case of failure                                                                                                     |
| `Placement groups`| keep blank                                                          |
| `Labels`          | keep blank                                                          |
| `Cloud config`    | Copy & Paste this script <pre>{cloudInit}</pre> <br> ☝ Important: Find the line where it says "myinterkit.app" and replace it with your domain or subdomain (`myinstitution.com` or `interkit.myinstitution.com`) <br>☝ Important: Replace "mypassword" with a real password in the same line               | 
| `Name`            | Chose a name, for example: "interkit" |


  4. Click `Create & Buy Now`
  4. The server is now spinning up and installing interkit.
  5. Copy the `Public IP` that was assigned to your new server that is spinning up.
  6. Continue with `Connect Domain and Server` immediately.

## Connect Domain and Server

### The Three Subdomains

The interkit server needs three subdomains to operate:
- `app.`
- `api.`
- `admin.`

For example, if you chose `interkit.myinstitution.com` above, this will result in
- `app.interkit.myinstitution.com`
- `api.interkit.myinstitution.com`
- `admin.interkit.myinstitution.com`

This is how you can reach your interkit server once it is set up and connected. You need to add just one `A-Record` to connect it all.

### Add A-Record to Nameserver

Go back to your Domain Provider and find the settings for `DNS` also known as `Nameserver`.

Add a new entry of type `A` also known as `A-Record` with the value set to the public IP address copied in the end of the previous section.

Name                           | Type | Value
-------------------------------|------|--------------
`*.interkit.myinstitution.com` | `A`  | Public IP addres of your server

## Finish

The server needs a few minutes to set up and connect. After that, you should be able to reach it at  

https://admin.interkit.myinstitution.com

Username: `admin`  
Passwort: the one you set up above

## Troubleshooting

#### Cannot reach domain `DNS_PROBE_FINISHED_NXDOMAIN`

Your domains are known publicly. Check if there are typos in your domain setup. Sometimes it takes a while until everything is up to date. You can restart your computer and router to speed it up.