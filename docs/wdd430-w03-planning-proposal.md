# WDD 430 W03 Planning Proposal — Small Business Manager

**Status: Individual proposal; pending team review and approval.**
This document records a draft data model and design direction based on the current repository specification. It does not claim that the team has approved these decisions.

## Evidence reviewed

- Project repository and team roster: [Small Business Manager](https://github.com/Kelvingonzalezm/small-business-manager)
- Existing project specification: [`specs/001-small-business-manager/spec.md`](../specs/001-small-business-manager/spec.md)
- Existing project constitution: [`.specify/memory/constitution.md`](../.specify/memory/constitution.md)
- Existing work items: [Issues #5–#11 and #14](https://github.com/Kelvingonzalezm/small-business-manager/issues)

The specification identifies account access, product management, inventory and pricing, supplier information, and a basic business dashboard. The constitution emphasizes data integrity, traceability, testable changes, simple architecture, and security. The repository currently contains only the initial Next.js starter page; the database technology and visual design system are not recorded as approved decisions.

## Candidate data model

The following four entities are a draft interpretation of the existing specification. The exact fields, ownership rules, and persistence design require team confirmation.

| Entity | Candidate key fields supported by current scope | Draft relationship |
| --- | --- | --- |
| **User** | account identifier, email, password hash | A user owns or is authorized to access business records. The specification requires authenticated, user-scoped access; the precise tenancy model is undecided. |
| **Product** | product identifier, name, description, price, quantity, optional supplier reference | A product may refer to a Supplier. Product price and quantity are managed as part of product/inventory workflows. |
| **Supplier** | supplier identifier, name, basic contact details | A supplier may be associated with multiple Products; whether the relationship is one-to-many and whether suppliers are user-scoped need confirmation. |
| **Inventory Record** | inventory record identifier, product reference, quantity, stock status, observation time | A Product may have inventory records over time. This follows the specification's description of quantity and stock status at a point in time; whether history is required or only current stock is stored remains undecided. |

**Relationship sketch (proposal):**

```text
User 1 ── owns/accesses ── many Products
User 1 ── owns/accesses ── many Suppliers
Supplier 1 ── may supply ── many Products
Product 1 ── has ── many Inventory Records
```

The user-to-business-record relationships express the specification's access-control requirement, not a confirmed schema. If the team chooses a single-business deployment, the user relationship may instead be represented through a Business entity; no Business entity is added here because it is not presently listed in the specification.

## Database decision

**Not documented as approved or implemented.** The Week 03 activity asks the team to select a database. No database connection, ORM, database dependency, or approved database choice appears in the current `main` branch. The team should select the database before implementation and record the choice in the specification and project instructions. This proposal intentionally does not choose PostgreSQL, MongoDB, or another database for the team.

## Draft component and page structure

The current repository has only the default App Router home page. The following hierarchy is a planning suggestion derived from the specified workflows, not an approved architecture:

```text
App shell
├── Header / primary navigation
├── Auth pages (register, sign in)
├── Dashboard (business summary)
├── Products (list, create, update, details)
├── Inventory and pricing (product quantity and price)
└── Suppliers (list, create, update, details)
```

The team should agree on route names, shared form/table components, authorization boundaries, and which page is the Week 04 MVP before implementation.

## Draft visual direction — pending approval

No approved palette, typeface, spacing scale, shared UI library, or responsive breakpoints were found in the repository. A possible direction for team discussion is:

- **Palette:** navy `#16324F` for navigation and primary actions, teal `#168C8C` for positive operational states, off-white `#F7F8FA` for page backgrounds, white surfaces, and slate `#344054` for body text. Status colors should also use labels/icons so meaning does not depend on color alone.
- **Typography:** a readable sans-serif system stack for interface text; use a single consistent type scale and reserve heavier weights for headings and totals.
- **Layout and spacing:** a consistent header and content container, clear page titles, a small spacing scale, and card/table layouts for dashboard metrics and product records.
- **Responsive behavior:** stack navigation and summary cards on narrow screens, keep forms usable without horizontal scrolling, and allow wide data tables to scroll or adapt to compact cards.
- **Component library:** continue with the existing Next.js, TypeScript, and Tailwind CSS stack; decide as a team whether Tailwind utility components alone are sufficient or whether to adopt a shared component library.

These are starting points only and should be revised to match team feedback and accessibility checks before becoming project standards.

## Current implementation and coordination observations

- `main` is a public Next.js App Router scaffold using TypeScript and Tailwind CSS. It has `dev`, `build`, and `lint` scripts, but no test or type-check script is defined in `package.json`.
- The README lists Kelvin Gonzalez, Virginia Rocha Guzman, Kenneth Duron, and Danson Nganga. A README roster does not establish meeting attendance, team numbering, or assigned responsibilities.
- The public [Small Business Manager Projects v2 board](https://github.com/users/Kelvingonzalezm/projects/2) currently contains eight open repository Issues: #5–#11 and #14. It has Status and Priority fields. Issues #5, #6, #7, #10, and #11 are marked P1; #8 and #9 are P2. Product issues #6 and #10/#11 overlap in scope, so the team should clarify whether #10/#11 are child tasks or separate work before implementation.
- The existing [Week 04 milestone](https://github.com/Kelvingonzalezm/small-business-manager/milestone/1) now contains six open Issues: #5, #6, #7, #10, #11, and #14. All five P1 issues are included. Issues #8 and #9 remain outside this milestone. The project board and milestone were verified through GitHub's API on November 13, 2026.
- No task owners are proposed or assigned by this document.

## Questions for team confirmation

1. Which database and data-access approach will the team use?
2. Is the application single-business or multi-user/multi-business, and how should data ownership work?
3. Should inventory be a current quantity on Product, a time-stamped Inventory Record history, or both?
4. Is the optional Supplier-to-Product relationship one supplier per product or many-to-many?
5. Which MVP pages, component conventions, palette, typography, spacing, and responsive behavior should become shared standards?
6. Which existing issues belong in the Week 04 milestone, and who volunteers for each task?
7. What is the URL of the team's current GitHub Projects v2 board, if one exists?
