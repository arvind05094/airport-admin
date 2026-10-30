# Airport Admin

Airport Admin is a full-stack workforce management system designed for airport ground operations. It automates shift scheduling by matching staffing requests with eligible employees while enforcing business constraints like job roles, approved leave, availability, and working-hour limits.

**Links:**

* **Live Demo:** [airport-admin-640.pages.dev](https://airport-admin-640.pages.dev)
* **API Documentation:** [Render Scalar Docs](https://airport-admin-vjxb.onrender.com/scalar/#description/introduction)

**Demo Credentials:**

* **Username:** `admin@airportadmin.com`
* **Password:** `Admin123!` (Admin access)

*Note: The backend is hosted on a free cloud tier that sleeps when idle; the initial request may take approximately 10 seconds to process.*

## Core Features

* **Automated Roster Generation:** An intelligent constraint engine processes staffing requests and assigns eligible staff, balancing workloads and respecting daily and weekly hour limits.
* **Leave & Availability Management:** Staff can submit leave requests and mark specific dates as unavailable, which the scheduling engine automatically bypasses.
* **Role-Based Access Control:** Distinct views and permission boundaries exist for Admins (organization-wide management), Supervisors, and Crew members (self-service data only).
* **Shift Coverage:** The system includes integrated workflows for requesting and approving shift cover.

## Technology Stack

* **Backend:** .NET 9, ASP.NET Core Web API
* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Radix UI / shadcn/ui
* **Database & ORM:** PostgreSQL, Entity Framework Core 9 (Code-first migrations)
* **Security:** JWT Bearer tokens, BCrypt password hashing
* **Infrastructure:** Render (Backend API), Cloudflare Pages (Frontend), Neon (Serverless Database)

## Engineering Highlights

* **Algorithmic Scheduling:** The core engine evaluates multiple variables, including role matches, leave, availability, and hour constraints, to generate optimized schedules rather than relying on naive data insertion.
* **Strict Architectural Boundaries:** API controllers are explicitly divided into organizational and self-service domains, ensuring data privacy and secure authorization at the structural level.
* **Test-Driven Logic:** Business logic and scheduling algorithms are fully isolated and verified by xUnit testing suites.
* **Clean Architecture:** The application follows a structured, layered pattern, separating HTTP routing from core business logic and data access.

## Local Development

Prerequisites for local deployment include Docker, the .NET 9 SDK, and Node 20+.

```bash
# Configure and run the backend
cd AirportAdmin.API
cp .env.example .env # Fill in your local credentials here
dotnet ef database update
dotnet run

# Configure and run the frontend
cd frontend
cp .env.example .env # Fill in your local credentials here
npm install
npm run dev

```

## Project Structure Overview

* `Controllers/`: API endpoints categorized by access level.
* `Services/`: Isolated business logic implementations.
* `Data/` & `Entities/`: Database context and object-relational mapping models.
* `Helpers/`: Scheduling constraint engine and security utilities.
* `AirportAdmin.API.Tests/`: Unit testing suite.
* `frontend/`: React client application directory.

## Contact

Arvind Chauhan

* **LinkedIn:** [linkedin.com/in/arvind-chauhan-dev](https://www.linkedin.com/in/arvind-chauhan-dev/)
* **Email:** [arvind05094@gmail.com](https://www.google.com/search?q=mailto%3Aarvind05094%40gmail.com)