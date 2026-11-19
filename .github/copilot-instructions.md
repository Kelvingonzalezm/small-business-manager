# Copilot Instructions — Small Business Manager

## 1. Project Overview

Small Business Manager is a web application designed to help small business owners manage products, inventory, prices, suppliers, and basic business operations.

The application is developed as a team project for BYU-Idaho WDD430.

When assisting with this project:

- Follow the existing project structure and coding conventions.
- Prefer simple, readable, maintainable solutions.
- Do not introduce unnecessary dependencies or architectural complexity.
- Do not modify unrelated files or existing functionality without a clear reason.
- Review existing implementations before adding or duplicating features.
- Distinguish between implemented functionality and planned functionality.

## 2. Technology Stack

Use the technologies already configured in the project:

- Next.js 16.4.5 with App Router.
- React 19.3.0.
- TypeScript with strict mode enabled.
- Tailwind CSS 4.
- PostgreSQL hosted on Neon.
- `@neondatabase/serverless` for database access.
- `bcryptjs` for password hashing.
- ESLint and Prettier for code quality and formatting.

Do not replace these technologies or install additional packages unless the task requires it and the change is justified.

## 3. Current Project Structure

The application currently uses this structure:

- `app/`: Next.js application and routes.
- `app/api/auth/`: registration, login, logout, and current-user endpoints.
- `app/api/products/`: product listing, creation, update, and deletion endpoints.
- `app/api/db-test/`: database connectivity test endpoint.
- `app/components/dashboard/`: dashboard components, including `MetricCard.tsx`.
- `app/components/products/`: product management components, including `ProductsManager.tsx`.
- `app/lib/auth.ts`: authentication and session functions.
- `app/lib/dashboard.ts`: dashboard data retrieval.
- `app/lib/dashboard-metrics.ts`: dashboard metric validation and formatting.
- `app/lib/db.ts`: PostgreSQL connection.
- `app/lib/products.ts`: product data types and database operations.
- `app/login/`: login page.
- `app/register/`: registration page.
- `app/products/`: product management page and product detail route.
- `database/schema.sql`: PostgreSQL database schema.
- `scripts/`: project scripts.
- `docs/`: project documentation.
- `specs/`: project specifications.
- `.specify/memory/constitution.md`: project constitution.
- `.github/agents/` and `.github/prompts/`: Spec Kit agents and prompts.

The structure may evolve as features are implemented. Inspect the current code before assuming that a module, route, component, or service exists.

## 4. Implementation Status

### Implemented

- User registration and login.
- Session management and logout.
- User-specific product listing.
- Product creation, editing, and deletion.
- Product price and quantity management.
- Dashboard metrics for product count, inventory units, inventory value, and supplier count.
- PostgreSQL database connection through Neon.

### Planned or not yet implemented

- Supplier management interface and CRUD workflows.
- Inventory change history through an Inventory Record table.
- Additional business management features defined in the project specifications.

Do not claim that a planned feature is implemented. Before implementing one, review its specification and existing code, and coordinate architectural or data model changes with the team when needed.

## 5. Data Model

The current database schema in `database/schema.sql` contains three tables.

### User

- `id`: UUID primary key.
- `name`: required name.
- `email`: required email, unique regardless of letter case.
- `password_hash`: required password hash.
- `created_at`: creation timestamp.

### Supplier

- `id`: UUID primary key.
- `user_id`: owner of the supplier.
- `name`: required supplier name.
- `email`: optional email.
- `phone`: optional phone.
- `created_at` and `updated_at`: timestamps.

A supplier must have at least one contact method: email or phone.

### Product

- `id`: UUID primary key.
- `user_id`: owner of the product.
- `name`: required product name.
- `description`: optional description.
- `price`: `NUMERIC(10, 2)`, non-negative.
- `quantity`: integer, non-negative, default 0.
- `supplier_id`: optional supplier relationship.
- `created_at` and `updated_at`: timestamps.

### Inventory Record

An inventory history table is planned but does not currently exist in the database schema. Do not assume that inventory history is available or create this table without an agreed requirement and team approval.

### Relationships and ownership

- One user can have many products.
- One user can have many suppliers.
- A supplier can be associated with multiple products.
- A product can optionally reference one supplier.
- A product's supplier must belong to the same user.
- Users must only access and modify their own data.

Respect the existing foreign keys, constraints, and indexes in `database/schema.sql`. Do not change the schema without reviewing the impact and coordinating with the team.

## 6. TypeScript and Next.js Conventions

- Use TypeScript and explicit types for function parameters and return values.
- Respect strict TypeScript settings.
- Use the `@/` import alias for project imports.
- Follow Next.js App Router conventions.
- Use Server Components by default.
- Add `"use client"` only when client-side interaction or React state is required.
- Keep API handlers in `route.ts` files.
- Use asynchronous functions for database operations.
- Keep components, data access, and business logic separated where appropriate.
- Avoid unnecessary abstractions and duplicated logic.

## 7. Database Access

Use the existing database connection:

`app/lib/db.ts`

Import it with:

`import { sql } from "@/app/lib/db";`

Database configuration uses the `DATABASE_URL` environment variable.

Rules:

- Never hardcode database credentials.
- Never expose environment variables or secrets in client-side code.
- Use parameterized SQL queries through the Neon `sql` template.
- Reuse the existing database connection.
- Handle database errors appropriately.
- Preserve existing database constraints and relationships.
- Scope business data queries by the authenticated user's ID.

## 8. Authentication and Security

Authentication logic is located in `app/lib/auth.ts`.

Reuse existing functions when appropriate:

- `hashPassword()`
- `verifyPassword()`
- `createSession()`
- `getCurrentUser()`
- `deleteSession()`

Security requirements:

- Protect private pages and API routes.
- Verify the authenticated user before accessing private information.
- Filter product and supplier queries by the authenticated user's `user_id`.
- Never allow one user to view, update, or delete another user's records.
- Never store plain-text passwords.
- Never return password hashes or session tokens in API responses.
- Keep server-only logic out of client components.
- Validate all input received from forms and API requests.
- Keep credentials and environment-specific configuration out of source control.

## 9. Validation and Data Integrity

Validate required information on the server before saving data.

For products:

- Name is required and cannot be empty.
- Price is required and cannot be negative.
- Price must respect the database precision of `NUMERIC(10, 2)`.
- Quantity is required and cannot be negative.
- Quantity must be a valid integer.
- Description is optional.
- Supplier association is optional and must belong to the authenticated user.

For suppliers:

- Name is required and cannot be empty.
- At least one contact method (email or phone) is required.

Do not rely only on client-side validation. Preserve database constraints and return clear validation errors.

For monetary calculations:

- Respect the decimal precision of PostgreSQL `NUMERIC`.
- Avoid unnecessary JavaScript floating-point conversions for monetary values.
- Preserve precision when calculating and displaying inventory totals.
- Do not assume a currency or perform currency conversion unless explicitly required.

## 10. Dashboard and UI

The dashboard currently displays:

- Product count.
- Total inventory units.
- Inventory value calculated from product price multiplied by quantity.
- Supplier count.

Dashboard metrics must be based on the authenticated user's saved records. Do not use sample or hardcoded business metrics.

UI requirements:

- Use Tailwind CSS 4 and existing global styles.
- Maintain a consistent, responsive layout.
- Prefer reusable components when they provide a clear benefit.
- Keep interfaces simple and understandable for small business owners.
- Provide clear validation, loading, success, and error feedback where appropriate.

The team's proposed visual direction is:

- Navy: `#16324F`
- Teal: `#168C8C`
- Background: `#F7F8FA`
- Slate text: `#344054`

Maintain consistency with the approved design.

## 11. Project Constitution and Team Workflow

Follow the principles in `.specify/memory/constitution.md`:

1. Product-First Value Delivery.
2. Data Integrity and Traceability.
3. Quality Through Testable Change.
4. Simple, Maintainable Architecture.
5. Security and Privacy by Default.

Before implementing a feature:

- Review the relevant specification and existing code.
- Respect the agreed team data model and architecture.
- Avoid duplicating work already completed by another team member.
- Keep changes focused on the assigned task.
- Do not invent requirements or make unapproved architectural decisions.
- Coordinate database or architecture changes with the team.

After implementing changes:

- Run relevant automated tests.
- Run linting and production build when appropriate.
- Verify the affected functionality.
- Report what changed and any remaining issues.
- Do not claim that tests or checks passed unless they were actually executed successfully.

Follow the team's Git workflow:

- Work on an appropriate feature branch.
- Do not push directly to protected `main`.
- Submit changes through pull requests.
- Keep pull requests focused and provide a clear summary and validation results.
- Do not merge a pull request without the required team approval.
