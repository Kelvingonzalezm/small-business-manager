# Copilot Instructions — Small Business Manager

## 1. Project Overview

Small Business Manager is a web application designed to help small business owners manage products, inventory, prices, and supplier information.

The application is developed as a team project for BYU-Idaho WDD430.

When assisting with this project:
- Follow the existing project structure and coding conventions.
- Prefer simple, readable, maintainable solutions appropriate for the current project.
- Do not introduce unnecessary dependencies or architectural complexity.
- Do not modify unrelated files or existing functionality without a clear reason.

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

Do not replace these technologies or install additional packages unless the task requires it.

## 3. Current Project Structure

The application currently uses this structure:

- `app/`: Next.js application.
- `app/api/`: API route handlers.
- `app/api/auth/`: registration, login, logout, and current-user endpoints.
- `app/lib/auth.ts`: authentication and session functions.
- `app/lib/db.ts`: PostgreSQL connection.
- `app/login/`: login page.
- `app/register/`: registration page.
- `database/schema.sql`: initial database schema.
- `scripts/`: project scripts.
- `docs/`: project documentation.
- `specs/`: project specifications.
- `.specify/memory/constitution.md`: project constitution.
- `.github/agents/` and `.github/prompts/`: Spec Kit agents and prompts.

Follow this structure when adding features. Do not assume that a separate components directory or product and supplier modules already exist.

## 4. Data Model

The team's accepted data model contains four entities:

### User
- `id`
- `name`
- `email`
- `password_hash`
- `created_at`

### Product
- `id`
- `user_id`
- `name`
- `description`
- `price`
- `quantity`
- `supplier_id`
- `created_at`
- `updated_at`

### Supplier
- `id`
- `user_id`
- `name`
- `email`
- `phone`
- `created_at`
- `updated_at`

### Inventory Record
Represents the history of inventory quantity changes associated with a product.

**Implementation status:** The current database schema contains `users`, `suppliers`, and `products`. The Inventory Record table has not yet been implemented. Do not assume it exists or create it unless the task requires it and the team agrees.

### Relationships and ownership

- One user can have many products.
- One user can have many suppliers.
- A supplier can be associated with multiple products.
- A product can have multiple inventory records when inventory history is implemented.
- A product's supplier association is optional.
- Users must only access and modify their own data.

Respect the existing foreign keys, constraints, and indexes in `database/schema.sql`.

## 5. TypeScript and Next.js Conventions

- Use TypeScript and explicit types for function parameters and return values.
- Respect strict TypeScript settings.
- Use the `@/` import alias for project imports.
- Follow the Next.js App Router conventions.
- Use Server Components by default.
- Add `"use client"` only when client-side interaction or React state is required.
- Keep API handlers in `route.ts` files.
- Use asynchronous functions where database operations require them.
- Keep code readable and avoid unnecessary abstractions.

## 6. Database Access

Use the existing database connection:

`app/lib/db.ts`

Import it with:

`import { sql } from "@/app/lib/db";`

Database configuration comes from the `DATABASE_URL` environment variable.

Rules:
- Never hardcode database credentials.
- Never expose environment variables or secrets in client-side code.
- Use parameterized SQL queries through the Neon `sql` template.
- Reuse the existing connection instead of creating unnecessary database clients.
- Handle database errors appropriately.
- Preserve existing database constraints and relationships.

## 7. Authentication and Security

Authentication logic is located in `app/lib/auth.ts`.

Reuse the existing functions when appropriate:
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
- Validate input received from forms and API requests.

## 8. Validation and Data Integrity

Validate required information before saving data.

For products:
- Name is required and cannot be empty.
- Price is required and cannot be negative.
- Quantity is required and cannot be negative.
- Description is optional.
- Supplier association is optional.

For suppliers:
- Name is required.
- At least one contact method (email or phone) is required.

Do not rely only on client-side validation. Validate data on the server and preserve database constraints.

## 9. UI and Styling

- Use Tailwind CSS 4 and the existing global styles.
- Follow a consistent, responsive layout.
- Prefer reusable components when they provide a clear benefit.
- Keep interfaces simple and easy for small business owners to understand.

The team's proposed visual direction is:
- Navy: `#16324F`
- Teal: `#168C8C`
- Background: `#F7F8FA`
- Slate text: `#344054`

Treat this palette as the team's design proposal and maintain consistency when implementing the approved design.

## 10. Project Constitution and Team Workflow

Follow the principles in `.specify/memory/constitution.md`, especially:

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

After implementing changes:
- Run the relevant checks, including linting and production build when appropriate.
- Report what was changed and any remaining issues.
- Do not claim that tests or checks passed unless they were actually executed successfully.