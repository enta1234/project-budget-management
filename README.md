# Project Budget Management

This project now uses a NestJS service and a Next.js client. The service stores
user data in MongoDB and uses Redis for caching. Development is containerised
with Docker.

## Running with Docker

```sh
./start.sh
```

When run, the script prompts for what to start. Select **1** to launch all
containers, **2** to start only MongoDB and Redis, or **3** to start the service
along with its databases. Choosing the first option will also start the Next.js
client on `http://localhost:8080` while exposing the service on port `3000`.
All service endpoints are available under the `/api/v1` path prefix.

The `docker-compose.yml` file sets `SERVICE_URL` for the client container so
that API requests are forwarded to the service.

The service now exposes a new endpoint `GET /api/v1/events` which returns the
timeline/calendar layout entries. It also provides a `POST /api/v1/projects`
endpoint for creating projects with a structured body containing the project
name, resources, start and end dates, manday estimate and priority.

An admin user is created automatically with username `admin` and password taken
from the `ADMIN_PASSWORD` environment variable (default `admin`).

## Manual Usage

To run the service manually:

```sh
cd service
npm install
npm run build
npm run start:prod
```
Create a `.env` file in the `service` directory by copying one of the files
from `service/env` and adjusting values to set database URLs and other options.

To run the client manually:

```sh
cd client
npm install
npm run build
npm run dev
```

The built client can be started with:

```sh
npm run start:dev   # uses the development environment
npm run start:local # uses the local environment
```

Set the `SERVICE_URL` environment variable to control where API requests are
proxied. You can create an `.env` file in the `client` directory based on one
of the files in `client/env` to override the default (`http://localhost:3000`).

The client also supports environment files under `client/env` in the same way as
the service. The file matching the `NODE_ENV` value will be loaded when the
client starts. Five example configurations are provided:

```
client/env/local.env
client/env/development.env
client/env/staging.env
client/env/uat.env
client/env/production.env
```

You may also copy one of the files in `service/env` to `service/.env` if you
prefer not to rely on the predefined `NODE_ENV` values.

## Environments

The service loads environment variables from files in `service/env` based on the
`NODE_ENV` value. Five example configurations are provided:

```
service/env/local.env
service/env/development.env
service/env/staging.env
service/env/uat.env
service/env/production.env
```

Set `NODE_ENV` to one of these names when starting the service to load the
matching file.
