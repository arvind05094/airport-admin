# Airport Admin

A full-stack staff scheduling and workforce management system for airport ground operations — built to demonstrate a production-style .NET API alongside a modern React frontend.

## Overview

Airport Admin lets ground staff and administrators manage rosters, leave requests, shift cover swaps, and staffing requirements across multiple airport locations and job roles. Admins can generate weekly rosters automatically based on staffing demand, employee availability, approved leave, and configurable scheduling constraints (e.g. max hours per day/week, max consecutive days).

This project was built to demonstrate practical ASP.NET Core API design — authentication, EF Core modelling/migrations, a layered service architecture, and a non-trivial scheduling algorithm — paired with a modern React + TypeScript frontend consuming that API.

## Tech Stack

**Backend**

- .NET 9 / ASP.NET Core Web API
- Entity Framework Core 9 + PostgreSQL (Npgsql)
- JWT Bearer authentication
- Layered architecture: Controllers → Services → EF Core DbContext

**Frontend**

- React 19 + TypeScript + Vite
- Tailwind CSS, Radix UI, shadcn/ui
- React Router, React Hook Form, Axios

## Key Features

- **Authentication & Roles** — JWT-based auth with Admin / Crew role separation, password hashing via BCrypt
- **Roster Generation Engine** — automatically assigns staff to open shifts based on:
  - Job role match between staff and staffing request
  - Approved leave (staff on leave are skipped)
  - Marked unavailability
  - Constraint profiles (max hours/day, max hours/week, max consecutive days)
  - Fair distribution — staff with fewer hours already scheduled that week are prioritized first
  - Each staffing request ends up **Fulfilled**, **Partially Filled**, or **Pending** depending on how many of the required positions could be filled
- **Staffing Requests** — admins define required coverage by location, job role, date, shift time, and headcount
- **Leave Management** — staff submit leave requests; admins review and approve/reject
- **Shift Cover** — staff can request cover for assigned shifts; admins manage approvals
- **Availability** — staff mark unavailable dates, factored into roster generation
- **Constraint Profiles** — reusable, configurable scheduling rules assigned per employee
- **Locations & Job Roles** — admin-managed reference data for scheduling
- **My\* vs Admin\* endpoints** — clear separation between self-service endpoints (staff viewing/managing their own roster, leave, availability, cover requests) and admin management endpoints

## API Overview

| Area                          | Routes                                                                                              | Description                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------- |
| Auth                          | `POST /api/auth/register`, `POST /api/auth/login`                                                   | Account creation and JWT login    |
| Users (admin)                 | `/api/admin/users`                                                                                  | CRUD for staff accounts           |
| Locations / Job Roles (admin) | `/api/admin/locations`, `/api/admin/job-roles`                                                      | Reference data management         |
| Constraint Profiles (admin)   | `/api/admin/constraint-profiles`                                                                    | Define scheduling rule sets       |
| Staffing Requests (admin)     | `/api/admin/staffing-requests`                                                                      | View/manage required coverage     |
| Staffing Requests (self)      | `/api/my/staffing-requests`                                                                         | Create requests, bulk create      |
| Staffing Request Detail       | `/api/staffing-requests/{id}`                                                                       | Detail view shared by admin/staff |
| Leave (admin)                 | `/api/admin/leaves`                                                                                 | Approve/reject leave requests     |
| Leave (self)                  | `/api/my/leaves`                                                                                    | Apply for / view / cancel leave   |
| Shift Cover (admin)           | `/api/admin/shift-cover`                                                                            | Approve/reject cover requests     |
| Shift Cover (self)            | `/api/my/shift-cover`                                                                               | Apply for / view / cancel cover   |
| Availability (admin)          | `/api/admin/availability`                                                                           | View staff availability           |
| Availability (self)           | `/api/my/availability`                                                                              | Mark unavailable dates            |
| Roster (admin)                | `/api/admin/roster`, `/api/admin/roster/generate`, `/api/admin/roster/generate/{staffingRequestId}` | Generate and manage rosters       |
| Roster (self)                 | `/api/my/roster`                                                                                    | View own assigned shifts          |

All routes except `/api/auth/*` require a valid JWT bearer token; admin routes additionally require the `Admin` role.

## Architecture

```
AirportAdmin.API/
├── Controllers/      # API endpoints (Admin*, My*, and shared resources)
├── Services/         # Business logic (RosterService, LeaveService, etc.)
├── Entities/          # EF Core entities
├── DTOs/              # Request/response contracts
├── Data/              # AppDbContext, migrations
├── Helpers/           # JWT helper, etc.
└── Middleware/

frontend/
├── src/
│   ├── pages/
│   ├── components/
│   └── ...
```

## Getting Started

### Prerequisites

- .NET 9 SDK
- Node.js 20+
- PostgreSQL

### Backend

```bash
cd AirportAdmin.API
```

Create a `.env` file in `AirportAdmin.API/`:

```
DB_CONNECTION=Host=localhost;Port=5432;Database=airportadmin;Username=postgres;Password=postgres
JWT_SECRET=your-secret-key
JWT_EXPIRY_HOURS=24
```

Then run:

```bash
dotnet ef database update
dotnet run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Testing

Unit tests for the roster generation constraint logic live in `AirportAdmin.API.Tests` (xUnit). Run with:

```bash
dotnet test
```

## Future Improvements

- Drag-and-drop manual roster editing in the admin UI
- Notifications for leave/cover approvals
- Broader test coverage (services, controllers)
- Pagination and filtering on list endpoints
- Audit log for admin actions

## License

MIT
