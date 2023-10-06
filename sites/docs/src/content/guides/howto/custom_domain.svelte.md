# Setting up or changing custom domains for your app

This guide documents serveral different ways to configure custom domains for your app. 

Make sure you read the general guide about [setting up your own interkit server](/guides/howto/server_setup) first.

## Basic setup

The standard setup for domains uses A records. To connect a domain, for example if you have `my-interkit-server.de`, create the following 2 A records:
  
- `my-interkit-server.de` -> A record to [your server instance ip address]
- `*.my-interkit-server.de` -> A record to [your server instance ip address]

## Changing your domain setup

You might want to change your domain setup later on. Any time you modify any DNS records, you will need to update your system in two places:

- changing the `.env` file for your server.
- changing the `/static/interkit.config.json` file for each existing project. You can use the `Cloud Commander` tab from the `Repository` page in the authoring system for this.

## More complex setups

interkit uses three subdomains to access the different parts of the system:
- `admin.my-interkit-server.de` for the authoring sytem front-end
- `api.my-interkit-server.de` for the database
- `app.my-interkit-server.de` for the bundled apps

You can configure interkit to use different domains for each part.

## Serving apps via a different subdomain using CNAME

For example you might want to serve your app to the public at `my-project.my-institution.de` and continue to use the authoring system at `my-interkit-server.de`.

To do this, you can set the following CNAME record: 
- `my-project.my-institution.de` -> CNAME `app.my-interkit-server.de`

Then change your server's `.env` file to include:
- `INTERKIT_BUNDLER_URL=https://my-project.my-institution.de`
- `INTERKIT_BUNDLER_HOST=my-project.my-institution.de`

And in your project's `/static/interkit.config.json`:
- `INTERKIT_BUNDLER_URL=https://my-project.my-institution.de`

Keep in mind you currently cannot connect multiple domains to any part of the interkit system, and only the domains registered in the `.env` file will work. In this example, `app.my-interkit-server.de` will not be accessible anymore to serve apps.

## Making one project the default project

If you want to serve one specific project at `https://my-project.my-institution.de` (instead of a long url like `https://my-project.my-institution.de/app/sdfzughs8zgsdf`), you can make one project the default project on the server. 

You can do this from the `Project` page in the authoring system. 