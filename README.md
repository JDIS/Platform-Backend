# Platform - Backend

## Deployment

The easiest way to launch the platform backend is to use `docker-compose`.

The only requirement is that the `PWD` environment variable must be set to the directory of the project.
You can use `export PWD=$(pwd)` on unix-like platforms.

You can then use `sudo -E docker-compose up` to start the platform.

Notes:
- You must have a least 10G of free space for the various images
- You must use `localhost` and not `127.0.0.1` on local otherwise the CAS auth won't accept the connexion
