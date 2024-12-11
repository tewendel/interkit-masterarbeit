# How to create an archived static version of an app

## What is this?

Sometimes you might want to use an interkit app without the authoring system, live database and media server.

Example use cases:
- a museum guide on rental devices without internet connection
- archiving a project without maintaining the whole interkit system

## Current limitations

Supported: database sheets and mediafiles

Unsupported: user accounts, chat, actions that call the server

## Steps

* in Project/Settings, click "Create Archive" button. This will create a copy of the database and the current mediafiles and add them into the `static/archive` directory in the client

* you can test your archive by activating the `Archive Mode` toggle in the preview settings (the little gear symbol below the preview)

* activate archive mode on an app by calling it with `?archiveMode=true` query parameter

* to use outside of the dev environment, you need to publish your app once. This copies the archive from `static` to `public`

* you can run your app by running a <a href="https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Tools_and_setup/set_up_a_local_testing_server" target="_blank">web server</a> inside the `public` directory