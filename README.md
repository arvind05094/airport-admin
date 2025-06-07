# Airport Admin

A staff scheduling and workforce management system, built around how airport ground operations actually work — multiple locations, multiple job roles, staffing requirements that change day to day, and a roster that needs to respect leave, availability, and working-hour limits.

This is a personal project I built to get hands-on with a "real" ASP.NET Core backend (auth, EF Core, layered services, a non-trivial scheduling algorithm) paired with a React/TypeScript frontend that actually consumes it.

🔗 **Live demo:** [airport-admin.pages.dev](https://airport-admin.pages.dev/)
🔗 **API:** [airport-admin.onrender.com](https://airport-admin.onrender.com)

> The API runs on Render's free tier, so the first request after a period of inactivity can take 20–30 seconds to wake up. Everything after that is normal speed.

### Try it out

```
Email:    admin@airportadmin.com
Password: Admin123!
```

This account has the Admin role, so you can see the full picture — managing users, locations, job roles, staffing requests, leave/cover approvals, and generating rosters.

![Admin dashboard](docs/screenshot-dashboard.png)

## What it does

The core idea: admins (or supervisors) raise **staffing requests** — e.g. "Terminal-1 needs 5 Security staff on 13 Jun, 14:22–19:22" — and the system can then generate a roster that fills those requests with eligible staff.

![Staffing request detail with generated roster](docs/screenshot-generate-roster.png)

A few things that make the roster generation non-trivial:

- **Job role matching** — staff are only assigned to requests matching their job role
- **Leave-aware** — anyone with approved leave on that date is skipped
- **Availability-aware** — staff can mark themselves unavailable on specific dates
- **Constraint profiles** — configurable rules per employee (max hours/day, max hours/week, max consecutive working days), so the algorithm won't schedule someone into overtime or back-to-back weeks
- **Fair-ish distribution** — when choosing between multiple eligible staff, it prefers whoever has fewer hours scheduled that week already
- Each staffing request ends up marked **Fulfilled**, **Partially Filled**, or **Pending**, depending on how many spots could actually be filled — in the screenshot above, 2 of 5 required staff were assigned

Once a roster is generated, staff can see their own upcoming shifts:

![Crew member's roster view](docs/screenshot-my-roster.png)

And supervisors can raise staffing requests for their own team without needing admin access:

![Supervisor's staffing requests view](docs/screenshot-my-staffing-requests.png)

On top of that, there's the usual stuff you'd expect from an internal admin tool: leave requests with approval workflow, shift cover swaps, and role-based access (Admin / Supervisor / Crew, with separate "My X" self-service views vs "Admin X" management views).

## Tech Stack

**Backend**

- .NET 9 / ASP.NET Core Web API
- Entity Framework Core 9 + PostgreSQL (Npgsql)
- JWT Bearer authentication, BCrypt password hashing
- Layered architecture: Controllers → Services → EF Core DbContext

**Frontend**

- React 19 + TypeScript + Vite
- Tailwind CSS, Radix UI, shadcn/ui components
- React Router, React Hook Form, Axios

**Hosting**

- API on [Render](https://render.com) (Docker)
- Database on [Neon](https://neon.tech) (serverless Postgres)
- Frontend on [Cloudflare Pages](https://pages.cloudflare.com)

## Architecture

```
AirportAdmin.API/
├── Controllers/       # API endpoints — Admin*, My*, and shared resources
├── Services/          # Business logic (RosterService, LeaveService, etc.)
├── Entities/           # EF Core entities
├── DTOs/               # Request/response contracts
├── Data/               # AppDbContext, migrations
├── Helpers/            # JWT helper, roster constraint logic
└── Middleware/

AirportAdmin.API.Tests/ # xUnit tests for roster constraint logic

frontend/
└── src/
    ├── pages/          # Route-level pages (admin/, my/, auth)
    ├── components/      # Shared UI components, layout
    ├── hooks/           # useAuth, useFetch
    └── lib/             # API client, formatting helpers
```

The split between `Admin*` and `My*` controllers/pages mirrors the actual permission boundary in the app — admins manage org-wide data, while staff and supervisors have a self-service view scoped to their own records.

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

Everything except `/api/auth/*` requires a JWT bearer token, and admin routes require the `Admin` role.

## Running it locally

### Prerequisites

- .NET 9 SDK
- Node.js 20+
- PostgreSQL

### Backend

Create a `.env` file in `AirportAdmin.API/`:

```
DB_CONNECTION=Host=localhost;Port=5432;Database=airportadmin;Username=postgres;Password=postgres
JWT_SECRET=your-secret-key
JWT_EXPIRY_HOURS=24
```

Then:

```bash
cd AirportAdmin.API
dotnet ef database update
dotnet run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

By default the frontend points at `http://localhost:5196`. To point it at a different API, set `VITE_API_URL`.

## Testing

The roster constraint logic (`RosterHelper`) is covered by unit tests in `AirportAdmin.API.Tests`:

```bash
dotnet test
```

## What I'd add next

- Drag-and-drop manual roster editing
- Notifications for leave/cover approvals
- More test coverage — services and controllers, not just the roster helper
- Pagination/filtering on list endpoints
- An audit log for admin actions

## License

MIT
