# WDD 430 W03 Team Project - Canvas Submission Draft

**Status: partial.** The repository, public Project Board, milestone, data-model/design proposal, and prior code review are verified. A screenshot showing the local browser or VS Code terminal and confirmation of synchronous meeting details are still needed.

## 1. Team Meeting Summary - PARTIAL

The team selected **Small Business Manager**, according to the team's prior Microsoft Teams coordination. The repository README currently lists Kelvin Gonzalez, Virginia Rocha Guzman, Kenneth Duron, and Danson Nganga. I could not retrieve the Teams meeting record in this review, so I cannot verify whether a synchronous meeting occurred, who attended it, who led it, or which responsibilities the team formally assigned. I will not present those details as confirmed.

The repository describes a web application for small-business owners to manage products, inventory, prices, and supplier information, with account access and a basic business dashboard in the project specification. The current repository evidence does not establish a specific project-selection rationale beyond the stated scope.

## 2. GitHub Repository - COMPLETE

- Public team repository: [Kelvingonzalezm/small-business-manager](https://github.com/Kelvingonzalezm/small-business-manager)
- Current README roster: Kelvin Gonzalez, Virginia Rocha Guzman, Kenneth Duron, and Danson Nganga.
- My account `kennethduron` has write permission.
- `main` is protected. I did not change `main`.
- My documentation PR is [PR #13](https://github.com/Kelvingonzalezm/small-business-manager/pull/13), open as a **Draft** from `docs/wdd430-w03-planning-evidence` to `main`. It has not been merged.

## 3. Local Development Screenshot - PARTIAL

The local application is responding at [http://localhost:3000](http://localhost:3000) with HTTP 200. The existing [PNG screenshot](https://raw.githubusercontent.com/Kelvingonzalezm/small-business-manager/docs/wdd430-w03-planning-evidence/docs/evidence/local-development.png) is a genuine headless-browser capture of the page, but it does not show the browser address bar or the VS Code terminal. The desktop capture integration was unavailable during this verification, so I could not create the requested stronger screenshot.

To capture the remaining evidence, keep the existing development server running, open `http://localhost:3000` in a browser, and use **Win + Shift + S** to capture the browser with the address bar visible, or capture VS Code with the project and the terminal's `npm run dev` ready output. Save the unedited PNG as `docs/evidence/local-development.png`.

## 4. GitHub Project Board - COMPLETE

The public GitHub Projects v2 board is [Small Business Manager](https://github.com/users/Kelvingonzalezm/projects/2). GitHub's API verified that it is public and contains all eight open repository Issues:

- [#5 - Implement user registration and login](https://github.com/Kelvingonzalezm/small-business-manager/issues/5) - P1, In progress, Week 04.
- [#6 - Implement product management](https://github.com/Kelvingonzalezm/small-business-manager/issues/6) - P1, Backlog, Week 04.
- [#7 - Manage inventory and product prices](https://github.com/Kelvingonzalezm/small-business-manager/issues/7) - P1, Backlog, Week 04.
- [#8 - Implement supplier management](https://github.com/Kelvingonzalezm/small-business-manager/issues/8) - P2, Backlog.
- [#9 - Create business dashboard](https://github.com/Kelvingonzalezm/small-business-manager/issues/9) - P2, Backlog.
- [#10 - Build product creation and listing](https://github.com/Kelvingonzalezm/small-business-manager/issues/10) - P1, Backlog, Week 04.
- [#11 - Build product update and deletion](https://github.com/Kelvingonzalezm/small-business-manager/issues/11) - P1, Backlog, Week 04.
- [#14 - Decide and document the database and data ownership model](https://github.com/Kelvingonzalezm/small-business-manager/issues/14) - Backlog, Week 04.

The [Week 04 milestone](https://github.com/Kelvingonzalezm/small-business-manager/milestone/1) is open and contains six issues: #5, #6, #7, #10, #11, and #14. During this verification, I associated the two existing P1 issues #10 and #11 with the existing milestone; I did not create or duplicate issues. The milestone currently shows six open issues and zero closed issues. The board also has Status and Priority fields, and all five P1 issues are assigned to Week 04.

## 5. Data Model - PARTIAL

The repository specification describes the project's account, product, supplier, inventory, and dashboard scope. My [planning proposal](wdd430-w03-planning-proposal.md) outlines four candidate entities - User, Product, Supplier, and Inventory Record - with candidate primary keys (`userId`, `productId`, `supplierId`, and `inventoryRecordId`) and foreign keys (`userId`, `supplierId`, and `productId`) connecting owners, products, suppliers, and inventory records. It describes one-to-many relationships while marking tenancy, nullability, and key enforcement for team confirmation. The repository does not record an approved or implemented database technology, so this proposal does not claim one.

## 6. Design Planning - PARTIAL

I found no team-approved palette, typeface, spacing scale, component library, or responsive rules in the repository. The planning proposal offers a navy, teal, off-white, and slate palette; the scaffold's configured Geist/Geist Mono fonts; a 4-pixel spacing base; and responsive navigation, forms, cards, and tables. These are individual proposals awaiting team approval, not established team decisions.

## 7. W03 Team: Code Review Report - COMPLETE

I submitted a `COMMENTED` review as `kennethduron` on Kelvin Gonzalez's Week 02 Sacrament Meeting Planner [Pull Request #1](https://github.com/Kelvingonzalezm/sacrament-meetings/pull/1#pullrequestreview-5899521998). It contains an inline suggestion on `app/meetings/current/page.tsx` about matching the current Sunday exactly before falling back to `/meetings`. This is a real code comment, not an approval; I did not repeat or replace the review during this W03 project work.

## Verification evidence

- `npm install` completed; npm reported eight moderate advisories. I did not run an automatic dependency fix.
- `npm run lint` passed.
- `npx tsc --noEmit` passed.
- `npm run build` passed; the current application is the Next.js starter page.
- `npm run dev` had previously started successfully. In this review, the existing server reported that it was already running (PID 31448), and an HTTP request to `http://localhost:3000/` returned 200.
- GitHub CLI authentication is active for `kennethduron` with `read:project`; the repository grants write access.
- The public Projects v2 board contains eight real Issues. The five P1 items (#5, #6, #7, #10, #11) are associated with the Week 04 milestone.
- PR #13 remains open as Draft; `main` was not changed.
- `.env` is ignored by Git. No secrets were added to the submission documents.

## Remaining evidence before submission

1. Capture a genuine screenshot that visibly includes either the browser's `localhost:3000` address or the VS Code terminal running the development server.
2. Confirm whether a synchronous team meeting occurred and, if it did, its actual attendees and leader. If there was no synchronous meeting, ask the instructor how to satisfy or report that criterion.
3. Obtain team confirmation of the candidate data model, database choice, design direction, and work ownership. The current model and design are proposals only.
