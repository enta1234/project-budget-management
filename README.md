# Project Budget Management

This project now uses a NestJS service and a Next.js client. The service stores
user data in MongoDB and uses Redis for caching. Development is containerised
with Docker.

## Running with Docker

```sh
./start.sh
```

This starts MongoDB, Redis, the NestJS API on port `3000` and the Next.js client
on `http://localhost:8080`. All service endpoints are available under the
`/api/v1` path prefix.

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
Create a `.env` file in the `service` directory based on `.env.example` to set
database URLs and other options.

To run the client manually:

```sh
cd client
npm install
npm run build
npm start
```

Set the `SERVICE_URL` environment variable to control where API requests are
proxied. Create an `.env` file based on `.env.example` to override the default
(`http://localhost:3000`).

The service also provides a `service/.env.example` file. Copy it to
`service/.env` and adjust values if you prefer not to use the predefined files
under `service/env`.

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
