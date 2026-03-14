# JobPortal Demo

A minimal Naukri-like job portal with two roles — **HR Admin** and **Candidate** — built with Spring Boot and React.

## Features

### Candidate
- Register/Login
- Create and edit profile (skills, experience, salary, location)
- Upload PDF resume
- Search jobs with filters (skill, experience, salary, location)
- Apply to jobs
- View applied jobs with status tracking

### HR Admin
- Register/Login
- Post new jobs
- View applications for posted jobs
- Update application status (Applied → Shortlisted → Hired / Rejected)
- Search and filter candidates
- View candidate profiles and download resumes

### Security & Validation
- BCrypt password encryption
- Passwords hidden from API responses
- Input validation on all forms (frontend + backend)
- Jakarta Bean Validation on all DTOs

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.2.5, Java 17 |
| Frontend | React 18, Vite 5 |
| Database | H2 (in-memory) |
| HTTP Client | Axios |
| Routing | React Router v6 |
| State | React Context API |
| Password Hashing | BCrypt (spring-security-crypto) |
| Testing (Backend) | JUnit 5, Mockito, MockMvc |
| Testing (Frontend) | Vitest, React Testing Library |
| Deployment | Docker Compose |

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.9+ (or use the included `mvnw` wrapper)
- Node.js 18+

### Option 1: Docker Compose (Recommended)

```bash
docker-compose up --build
```

App runs at **http://localhost:3000**. Backend on 8080, frontend served via nginx on 3000 with API proxying.

### Option 2: Run Locally

**Backend:**
```bash
cd backend
./mvnw spring-boot:run    # or: mvn spring-boot:run
```
Starts on **http://localhost:8080**

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Starts on **http://localhost:5173**

Both must run simultaneously.

### Demo Credentials

| Role | Username | Password | Company |
|------|----------|----------|---------|
| HR Admin | hr1 | password | TechCorp |
| HR Admin | hr2 | password | DataSoft |
| Candidate | candidate1 | password | — |
| Candidate | candidate2 | password | — |
| Candidate | candidate3 | password | — |

The database comes pre-loaded with 5 sample jobs and 5 sample applications.

## Running Tests

### Backend (39 tests)
```bash
cd backend
./mvnw test
```

### Frontend (59 tests)
```bash
cd frontend
npm install
npm test
```

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login

### Candidate
- `GET /api/candidate/profile/{userId}` — Get profile
- `PUT /api/candidate/profile/{userId}` — Create/update profile
- `POST /api/candidate/profile/{userId}/resume` — Upload resume (PDF, max 5MB)
- `GET /api/candidate/profile/{userId}/resume` — Download resume
- `DELETE /api/candidate/profile/{userId}/resume` — Delete resume
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
│   └── src/
│       ├── main/java/com/jobportal/
│       │   ├── config/          # CORS, password encoder, seed data
│       │   ├── controller/      # REST endpoints
│       │   ├── dto/             # Request objects with validation
│       │   ├── entity/          # JPA entities
│       │   ├── enums/           # Role, ApplicationStatus
│       │   ├── exception/       # Global error handling
│       │   ├── repository/      # JPA repositories
│       │   └── service/         # Business logic
│       └── test/java/com/jobportal/
│           ├── controller/      # MockMvc integration tests
│           └── service/         # Unit tests with Mockito
├── frontend/
│   └── src/
│       ├── api/                 # Axios API client + tests
│       ├── components/          # Navbar, ProtectedRoute + tests
│       ├── context/             # AuthContext + tests
│       ├── pages/               # Home, Login, Register, candidate/, hr/ + tests
│       └── test/                # Test setup
├── docker-compose.yml
└── CLAUDE.md
```
