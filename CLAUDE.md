# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Naukri-like job portal demo with two roles (HR Admin, Candidate). Monorepo with Spring Boot backend and React (Vite) frontend communicating via REST APIs.

## Build & Run Commands

### Backend (Spring Boot 3.2.5, Java 17, Maven)
```bash
cd backend
mvn spring-boot:run          # Runs on http://localhost:8080
mvn clean package             # Build JAR
```
H2 console: http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:jobportaldb`, user: `sa`, no password)

### Frontend (React 18, Vite 5)
```bash
cd frontend
npm install
npm run dev                   # Runs on http://localhost:5173
npm run build                 # Production build to dist/
```

**Both must run simultaneously.** Backend serves APIs, frontend proxies nothing—it calls `http://localhost:8080/api` directly via axios.

## Architecture

### Backend (`backend/src/main/java/com/jobportal/`)

Layered architecture: Controller → Service → Repository → Entity.

- **Entities:** `User`, `CandidateProfile` (1:1 with User), `Job` (many:1 with User via postedBy), `Application` (links candidate User to Job with status)
- **Enums:** `Role` (CANDIDATE, HR_ADMIN), `ApplicationStatus` (APPLIED, SHORTLISTED, REJECTED, HIRED)
- **DTOs:** Request objects with Jakarta validation (`LoginRequest`, `RegisterRequest`, `JobRequest`, `ApplicationRequest`, `StatusUpdateRequest`)
- **Config:** `CorsConfig` allows `localhost:5173`, `DataSeeder` (CommandLineRunner) loads seed data on startup

### Frontend (`frontend/src/`)

- **Auth:** React Context API (`AuthContext`) stores user in state + localStorage (key: `jobportal_user`). No tokens—just the user object returned from login.
- **Routing:** React Router with `ProtectedRoute` component that checks `user.role` for access control
- **API layer:** Single axios instance in `api/api.js` with all endpoint functions
- **Pages:** Split into `candidate/` and `hr/` directories under `pages/`

### API Endpoints (all under `/api`)

| Auth | Candidate | HR Admin |
|------|-----------|----------|
| POST /auth/register | GET /candidate/profile/{userId} | POST /hr/jobs |
| POST /auth/login | PUT /candidate/profile/{userId} | GET /hr/jobs/{userId} |
| | GET /jobs/search?skill&minExperience&maxSalary&location | GET /hr/jobs/{jobId}/applications |
| | POST /candidate/apply | PUT /hr/applications/{appId}/status |
| | GET /candidate/applications/{userId} | GET /hr/candidates/search?skill&minExperience&maxSalary&location |

## Key Design Decisions

- **No Spring Security:** Auth is plain username/password comparison. Login returns the full User entity. Passwords stored as plain text. Demo only.
- **H2 in-memory DB:** Schema recreated on every restart (`create-drop`). All data is ephemeral.
- **Skills stored as comma-separated strings** in both `CandidateProfile.skills` and `Job.requiredSkills`—search uses LIKE queries, not normalized tables.
- **Seed data always loads:** 2 HR admins (`hr1/password`, `hr2/password`), 3 candidates (`candidate1-3/password`), 5 jobs, 5 applications.
- **Controllers return entities directly** in most cases (not response DTOs), so passwords are exposed in API responses.

## CORS

Backend allows `http://localhost:5173` on all `/api/**` paths (GET, POST, PUT, DELETE). If you change the frontend port, update `CorsConfig.java`.
