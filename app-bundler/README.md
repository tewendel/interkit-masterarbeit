# setup

`npm install`

`cp .env.example .env`

Add the absolute path to the `repositores` directory to `REPOSITORIES_PATH` in `.env`

# run

`npm start`

# develop app-bundler (watches for file change and reloads bundler)

`npm run dev`

# develop starter project directly

`npm run dev-starter-project`


# API

- GET /compile/project/id attempts to compile and bundle the project into public/build/id
- GET /app/id serves the project from public/build/id

# notes

- needs node 15 or higher 

