# Platform - Backend
Backend part of the JDIS training platform.

See the [deploy repository](https://github.com/JDIS/Platform-Deploy) for details on how to deploy the platform.

## Run
The only requirement is that the `PWD` environment variable must be set to the directory of the project.
You can use `export PWD=$(pwd)` on unix-like platforms.

You can then run `npm start` to launch the server in `dev` mode.

## API
The swagger API is available at `/api/swagger`. You will need to give it a cookie.

## Seed
To seed the database, an admin needs to `POST` on the following endpoints:
- `/api/languages/seed`
- `/api/categories/seed`
- `/api/challenges/seed`
