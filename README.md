# Fullstack App - Spring Boot + Angular + SQLite + Docker

## Architecture
- **Backend**: Spring Boot 3.2 + Spring Security + JWT + SQLite
- **Frontend**: Angular 17 + Bootstrap 5
- **Database**: SQLite
- **Containerization**: Docker + Docker Compose

## Démarrage rapide

### Avec Docker (recommandé)
```bash
docker compose up --build
```
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080

### Sans Docker

#### Backend
```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
ng serve
```

## API Endpoints
| Méthode | URL                    | Description          | Auth |
|---------|------------------------|----------------------|------|
| POST    | /api/auth/register     | Inscription          | Non  |
| POST    | /api/auth/login        | Connexion            | Non  |
| GET     | /api/auth/me           | Profil utilisateur   | Oui  |
| GET     | /api/home/public       | Message public       | Non  |
| GET     | /api/home/protected    | Message protégé      | Oui  |
