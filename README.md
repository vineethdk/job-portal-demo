# JobPortal Demo

A minimal Naukri-like job portal with two roles — **HR Admin** and **Candidate** — built with Spring Boot and React.

## Features

### Candidate
- Register/Login
- Create and edit profile (skills, experience, salary, location)
- Search jobs with filters (skill, experience, salary, location)
- Apply to jobs
- View applied jobs with status tracking

### HR Admin
- Register/Login
- Post new jobs
- View applications for posted jobs
- Update application status (Applied → Shortlisted → Hired / Rejected)
- Search and filter candidates

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.2.5, Java 17 |
| Frontend | React 18, Vite 5 |
| Database | H2 (in-memory) |
| HTTP Client | Axios |
| Routing | React Router v6 |
| State | React Context API |

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 18+

### Run Backend
```bash
cd backend
mvn spring-boot:run
```
Starts on **http://localhost:8080**

### Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Starts on **http://localhost:5173**

### Demo Credentials

| Role | Username | Password | Company |
|------|----------|----------|---------|
| HR Admin | hr1 | password | TechCorp |
| HR Admin | hr2 | password | DataSoft |
| Candidate | candidate1 | password | — |
| Candidate | candidate2 | password | — |
| Candidate | candidate3 | password | — |

The database comes pre-loaded with 5 sample jobs and 5 sample applications.

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login

### Candidate
- `GET /api/candidate/profile/{userId}` — Get profile
- `PUT /api/candidate/profile/{userId}` — Create/update profile
- `GET /api/jobs/search?skill=&minExperience=&maxSalary=&location=` — Search jobs
- `POST /api/candidate/apply` — Apply to a job
- `GET /api/candidate/applications/{userId}` — View applied jobs

### HR Admin
- `POST /api/hr/jobs` — Post a job
- `GET /api/hr/jobs/{userId}` — List posted jobs
- `GET /api/hr/jobs/{jobId}/applications` — View applications for a job
- `PUT /api/hr/applications/{applicationId}/status` — Update application status
- `GET /api/hr/candidates/search?skill=&minExperience=&maxSalary=&location=` — Search candidates

## Database

H2 in-memory database — data resets on every restart. Access the H2 console at **http://localhost:8080/h2-console**:
- JDBC URL: `jdbc:h2:mem:jobportaldb`
- Username: `sa`
- Password: *(leave blank)*

## Project Structure

```
├── backend/
│   └── src/main/java/com/jobportal/
│       ├── config/          # CORS, seed data
│       ├── controller/      # REST endpoints
│       ├── dto/             # Request objects
│       ├── entity/          # JPA entities
│       ├── enums/           # Role, ApplicationStatus
│       ├── exception/       # Global error handling
│       ├── repository/      # JPA repositories
│       └── service/         # Business logic
├── frontend/
│   └── src/
│       ├── api/             # Axios API client
│       ├── components/      # Navbar, ProtectedRoute
│       ├── context/         # AuthContext
│       └── pages/           # Home, Login, Register, candidate/, hr/
```
