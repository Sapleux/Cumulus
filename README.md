# Cumulus

Cumulus is a full-stack weather app with:
- interactive map search,
- weather overlays and forecasts,
- user authentication,
- favorite locations,
- and real-time chat scoped by location.

The project is split into:
- `frontend/`: Angular 17 SPA
- `backend/`: Spring Boot 3.2 API + WebSocket server
- `backend/data/app.db`: SQLite database file

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Run the Project](#run-the-project)
- [API Reference](#api-reference)
- [WebSocket Chat](#websocket-chat)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Useful Commands](#useful-commands)

## Features

### Frontend
- Authentication UI (register, login, logout) with JWT persistence in `localStorage`.
- Protected routes for city detail pages via `authGuard`.
- Interactive OpenLayers map:
  - city autocomplete and geocoding (Geoapify),
  - reverse geocoding on map click,
  - browser geolocation,
  - weather tile overlays (temperature, wind, precipitation, clouds),
  - custom animated rain canvas for precipitation layer.
- Favorite locations management:
  - add/remove favorites from map and carousel,
  - synced with backend per authenticated user.
- Rich weather detail page:
  - current weather,
  - hourly forecast,
  - weekly forecast,
  - UV, wind, precipitation charts,
  - weather-themed dynamic UI.
- Real-time chat:
  - STOMP over SockJS,
  - room-like scoping by `localisation` (e.g. city name),
  - pinned bottom-right,
  - retractable/minimized floating circle button,
  - current user username used as message author.

### Backend
- JWT-based authentication (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`).
- Spring Security stateless config with JWT filter.
- Per-user liked locations REST API (`/api/liked-locations`).
- SQLite persistence via Spring Data JPA + Hibernate dialect.
- STOMP WebSocket broker and chat message relay by localisation.

## Tech Stack

### Frontend
- Angular 17
- TypeScript 5
- RxJS 7
- OpenLayers (`ol`) + `ol-mapbox-style`
- Bootstrap 5
- `@stomp/stompjs` + `sockjs-client`

### Backend
- Java 17
- Spring Boot 3.2.2
- Spring Web, Security, Data JPA, Validation, WebSocket
- SQLite (`org.xerial:sqlite-jdbc`)
- JWT (`io.jsonwebtoken`)
- Lombok

### DevOps
- Docker + Docker Compose
- Nginx (frontend production container)

## Architecture

```text
Browser (Angular)
  |-- HTTP /api/* --------------------> Spring Boot REST API
  |-- STOMP / SockJS -----------------> Spring Boot WebSocket endpoint
  |-- External Weather/Geo APIs ------> Open-Meteo / OpenWeatherMap / Geoapify

Spring Boot
  |-- Security + JWT filter
  |-- AuthController
  |-- LikedLocationController
  |-- MessageController (WebSocket chat)
  |-- SQLite database (app.db)
```

## Prerequisites

- Java 17+
- Node.js 20+ and npm
- Docker + Docker Compose (optional, for containerized runs)
- Internet access for external weather/geocoding map providers

## Configuration

### Backend config

Main file: `backend/src/main/resources/application.properties`

Important properties:
- `server.port=8080`
- `spring.datasource.url=jdbc:sqlite:./data/app.db`
- `jwt.secret=...`
- `jwt.expiration=86400000`
- `app.cors.allowed-origins=http://localhost:4200`

Docker profile overrides: `backend/src/main/resources/application-docker.properties`
- `spring.datasource.url=jdbc:sqlite:/app/data/app.db`

### Frontend config

Files:
- `frontend/src/environments/environment.ts`
- `frontend/src/environments/environment.prod.ts`

Important values:
- `apiUrl: '/api'` (works with Angular proxy in dev, and Nginx routing in prod)
- `geoapifyApiKey`
- `owmApiKey`

> Note: API keys are currently stored directly in environment files.

## Run the Project

## 1) Local development (recommended for coding)

### Start backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend URL: `http://localhost:8080`

### Start frontend

In a second terminal:

```bash
cd frontend
npm install
npm start
```

Frontend URL: `http://localhost:4200`

Angular dev server uses `frontend/proxy.conf.json` to proxy `/api` to `http://localhost:8080`.

## 2) Docker (build images manually)

### Backend container

```bash
docker build -t cumulus-backend ./backend
docker run --rm -p 8080:8080 -v "$PWD/backend/data:/app/data" cumulus-backend
```

### Frontend container

In a second terminal:

```bash
docker build -t cumulus-frontend ./frontend
docker run --rm -p 4200:80 cumulus-frontend
```

Frontend is served by Nginx inside the container.

## 3) Docker Compose

`docker-compose.yml` defines both services, but currently references `frontend/Dockerfile.dev`, which is not present in the repository.

You have two options:

### Option A - quick fix in compose file
Change:
- `dockerfile: Dockerfile.dev`

To:
- `dockerfile: Dockerfile`

Then run:

```bash
docker compose up --build
```

### Option B - add your own `Dockerfile.dev`
Keep compose as-is and create that file for a hot-reload workflow.

## API Reference

Base URL (local): `http://localhost:8080`

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Login and receive JWT |
| `GET` | `/api/auth/me` | Yes | Get current user profile |

### Liked locations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/liked-locations` | Yes | List current user's liked locations |
| `POST` | `/api/liked-locations` | Yes | Add location (`latitude`, `longitude`) |
| `POST` | `/api/liked-locations/remove` | Yes | Remove location (`latitude`, `longitude`) |

### Auth header

Use JWT as:

```http
Authorization: Bearer <token>
```

### Example requests

Register:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","email":"demo@example.com","password":"demo123"}'
```

Login:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'
```

Get current user:

```bash
curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer <token>"
```

Add liked location:

```bash
curl -X POST http://localhost:8080/api/liked-locations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"latitude":48.8566,"longitude":2.3522}'
```

## WebSocket Chat

### Endpoint and destinations
- SockJS endpoint: `/gs-guide-websocket`
- Client publish destination: `/app/chat/{localisation}`
- Client subscription destination: `/topic/message/{localisation}`

### Behavior
- Each localisation acts like a chat room.
- Backend validates non-empty message text.
- Backend broadcasts only to the matching localisation topic.
- `author` is preserved from client payload (frontend sends logged-in username).

### Message payload

```json
{
  "author": "alice",
  "text": "Hello from Paris"
}
```

## Testing

### Frontend tests

```bash
cd frontend
npm install
npx ng test
```

Existing specs include:
- `frontend/src/app/components/chat/chat.component.spec.ts`
- `frontend/src/app/components/city-detail/city-detail.component.spec.ts`
- `frontend/src/app/components/map/map.component.spec.ts`
- `frontend/src/app/services/map.service.spec.ts`
- `frontend/src/app/liked-locations.spec.ts`

### Backend tests

No backend test classes were found under `backend/src/test/` at the time of writing.

You can still run Maven verification/build:

```bash
cd backend
./mvnw clean verify
```

## Project Structure

```text
Cumulus/
  backend/
	src/main/java/com/app/
	  config/
	  controller/
	  dto/
	  model/
	  repository/
	  security/
	  service/
	  websocket/
	src/main/resources/
	  application.properties
	  application-docker.properties
	data/app.db
  frontend/
	src/app/
	  components/
	  guards/
	  interceptors/
	  models/
	  services/
	src/environments/
	  environment.ts
	  environment.prod.ts
  docker-compose.yml
```

## Troubleshooting

### `docker compose up --build` fails on frontend Dockerfile
- Cause: `docker-compose.yml` references `Dockerfile.dev` but only `frontend/Dockerfile` exists.
- Fix: update compose to use `Dockerfile`, or create `Dockerfile.dev`.

### `401 Unauthorized` on protected API
- Confirm you are logged in.
- Confirm token is in `localStorage` as `token`.
- Confirm frontend sends `Authorization: Bearer ...` (handled by `auth.interceptor.ts`).

### CORS errors in browser
- Verify `app.cors.allowed-origins` includes your frontend URL.
- For local dev, default is `http://localhost:4200`.

### Chat not connecting
- Verify backend is running on `http://localhost:8080`.
- Verify WebSocket endpoint `/gs-guide-websocket` is reachable.
- Verify client subscribes/publishes with the same localisation key.

### Map/weather data missing
- Verify internet access.
- Verify `geoapifyApiKey` and `owmApiKey` are valid.

## Useful Commands

Frontend:

```bash
cd frontend
npm install
npm start
npm run build
npm run watch
```

Backend:

```bash
cd backend
./mvnw spring-boot:run
./mvnw clean package -DskipTests
./mvnw clean verify
```

Docker:

```bash
docker compose up --build
docker compose down
```