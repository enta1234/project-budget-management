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

To run the client manually:

```sh
cd client
npm install
npm run build
npm start
```
