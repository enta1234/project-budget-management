# Project Budget Management

This repository now uses a basic monorepo layout with two folders:

- **client** – small web UI that allows a user to log in.
- **service** – Express API implementing a token-based login flow using JWT.

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

Open `http://localhost:8080` in a browser and use `admin` / `password` to test.
