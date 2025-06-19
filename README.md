# Project Budget Management

This repository now uses a basic monorepo layout with two folders:

- **client** – small web UI that allows a user to log in.
- **service** – Express API implementing a token-based login flow using JWT.

## Environment configuration

Environment specific variables are stored in files under the `env/` directory.
The application will load the file that matches the `NODE_ENV` value provided
when starting the servers. Five environments are available by default:
`local`, `development`, `staging`, `uat` and `production`.

Each file defines at least the following variables:

```
SERVICE_PORT  # Port for the API service
CLIENT_PORT   # Port for the static client
JWT_SECRET    # Secret used to sign JSON Web Tokens
```

For example, to run the service with the development configuration:

```
NODE_ENV=development npm start
```

## Running the service

```
cd service
npm install      # will fail without network but dependencies are express, jsonwebtoken and bcryptjs
npm start
```

The API exposes `/login` and `/profile` endpoints. The `/login` route accepts `username` and `password` and returns a JWT token when credentials are valid.

## Running the client

```
cd client
npm install      # installs express for a simple static server
npm start
```

Open `http://localhost:8080` (or the port from `CLIENT_PORT`) in a browser and
use `admin` / `password` to test.
