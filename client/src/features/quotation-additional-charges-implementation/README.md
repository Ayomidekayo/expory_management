# Quotation custom/transport charge requests — implementation package

This package implements an extension to the existing quotation flow. It is designed to be merged into the existing project; it is not a new or independent quotation system.

## Intended workflow

1. The exporter calculates a quote and reviews the original service lines, selecting only the services required.
2. In the **Additional services and instructions** section, they choose Yes/No for customs-duty assistance and transportation pricing. If customs assistance is requested, they supply a commercial invoice value and invoice currency. They can enter an optional note (saved into the existing `QuoteSubmission.customerMessage`).
3. On **Continue with selected services**, a logged-in EXPORTER submits immediately and is navigated to their new quotation submission. A guest is sent to the existing exporter login flow with the full quote handoff preserved.
4. The submission request triggers the existing `quotation:submitted` Socket.IO event and creates persistent notifications for active admins/reviewers/charge managers.
5. An ADMIN or staff member with `MANAGE_QUOTE_CHARGES` can price the requested customs and/or transportation charges in the quotation detail page. These are saved as `QuoteSubmissionItem` rows with `itemType` `CUSTOMS_CHARGE` / `TRANSPORT_CHARGE`, next to the original `SERVICE` rows.
6. The backend recalculates subtotal, saved VAT policy, tax, and total transactionally. The exporter sees the new rows and updated amounts on their existing quotation details page; an admin message and exporter notification are also recorded.

**Tax policy:** the initial quote's VAT-enabled flag and percentage are copied to the submission. New operation-priced charges are included in the applicable subtotal and VAT is recomputed on the resulting subtotal using that saved policy. The client never supplies trusted prices or totals.

## File map

Use the `.add-on-charges` files as the implementation source. Copy each into the corresponding existing file while preserving the original path and filename:

| Package file | Merge/target in the project |
|---|---|
| `PublicQuotationPage.add-on-requests.tsx` | Existing public `PublicQuotationPage.tsx` (same feature/page directory) |
| `public-quotation-submit.api.ts` | New helper at the location used by the page import (`../api/public-quotation-submit.api.ts` from the `pages` directory) |
| `quotation.service.add-on-charges.ts` | Existing backend `quotation.service.ts` |
| `quotation.repository.add-on-charges.ts` | Existing backend `quotation.repository.ts` |
| `quotation.controller.add-on-charges.ts` | Existing backend `quotation.controller.ts` |
| `quotation.routes.add-on-charges.ts` | Existing backend `quotation.routes.ts` |
| `admin-quotations.api.add-on-charges.ts` | Existing frontend `api/admin-quotations.api.ts` used by admin quotation detail components |
| `AdminQuotationDetailsPage.add-on-charges.tsx` | Existing admin quotation detail component |
| `ExporterQuotationDetailsPage.add-on-charges.tsx` | Existing exporter quotation details component |
| `UserManagementDialog.add-on-charges-permission.tsx` | Existing `UserManagementDialog.tsx` |
| `Topbar.add-on-charges.tsx` | Existing `Topbar.tsx`; retains the existing socket listener and adds permission eligibility |

The backend service/repository/controllers are based on the quotation source files provided in the conversation. **If your live files contain newer project-specific code, merge the relevant methods/fields rather than blindly overwriting unrelated changes.** The repository implementation includes a rich `listAdminSubmissions` query for the admin quotation list/detail UI; preserve any local additions to that query.

## 1. Prisma schema (additive only)

Apply `schema.prisma.add-on-charges.patch.txt` to your existing `prisma/schema.prisma`. It adds:

- `QuoteSubmissionItemType` (`SERVICE`, `CUSTOMS_CHARGE`, `TRANSPORT_CHARGE`)
- `Permission.MANAGE_QUOTE_CHARGES`
- `QuoteAuditAction.CHARGES_UPDATED`
- request flags, invoice value/currency, and a frozen VAT policy on `QuoteSubmission`
- the `itemType` column on `QuoteSubmissionItem`

Do not replace the whole schema. Confirm `QuoteSubmissionItem.quoteItemId` is nullable; operation-added rows use `null` for that relation. Back up the database and use your normal migration workflow. The expected commands in a development database whose migration history is already in sync are:

```powershell
npx prisma format
npx prisma validate
npx prisma migrate dev --name quote_submission_additional_charges
npx prisma generate
```

Deploy generated migrations to staging/production with your normal release process (typically `npx prisma migrate deploy`). If Prisma detects drift or requests a reset, **stop and reconcile the migration history first**. Do not run `migrate reset` on a database with existing data as a shortcut.

## 2. Backend request type

Merge `quotation.types.add-on-charges.patch.txt` into the existing `SubmitQuoteInput` definition. Keep all existing fields, including `selectedQuoteItemIds` and `customerMessage`.

The `submit()` service validates the request flags, validates the invoice amount/currency when customs assistance is selected, validates the optional note, recalculates selected original services server-side, and persists the request context. It does not accept price totals from the browser.

## 3. Backend routes, permissions, and repository

The route addition is:

```text
PATCH /admin/quotations/submissions/:submissionId/charges
```

It is protected by `Permission.MANAGE_QUOTE_CHARGES`. The controller rechecks the permission; the repository validates that a charge was requested, writes/updates the operation charge line item, recalculates subtotal/VAT/total, writes an audit event and message, and notifies the exporter.

The administrator list query must include these relations/fields so the admin page can show the quote, exporter, items (`itemType` included), messages and attachments. Keep the rich `listAdminSubmissions` query in the package or merge the `itemType: true` and necessary relations into your current richer query.

### Grant access

In User Management, grant the staff member both:

- `VIEW_ALL_QUOTES` — to enter the quotation list/detail pages (also satisfies any UI route permission guard).
- `MANAGE_QUOTE_CHARGES` — to add customs/transport amounts.

The new permission must also exist in your Prisma `Permission` enum and be regenerated before compiling. The user-management dialog adds it to its Quotation Access & Review permission section.

## 4. Exporter API types

Merge the additions from `exporter-quotations.api.add-on-charges.patch.txt` into the existing `ExporterSubmission` and `ExporterSubmissionItem` types. Do not replace the entire API module. Ensure the backend exporter list query selects `taxAmount`, request flags/invoice values/VAT policy/customer note, and each item's `itemType`; the detail query's `include: { items: true }` returns the scalar item type after the migration.

## 5. Logged-in vs guest flow

- If the current `useAuthStore()` user has role `EXPORTER`, the public page posts directly to `POST /quotations/:quoteId/submissions` and navigates to `/exporter/quotations/:submissionId`. It does not send that user to login again.
- For a guest, the complete request is passed through `location.state.quoteHandoff` or the supplied `onRequireLogin` callback.
- Merge `login-handoff.patch.txt` into the existing login page's post-authentication handoff handler so that it submits every additional field after sign-in. Otherwise the note and customs/transport choices could be lost during login.

## 6. Real-time notification

`Topbar.add-on-charges.tsx` includes `MANAGE_QUOTE_CHARGES` in the permission check for the existing `quotation:submitted` toast. The service emits the existing event with customs/transport and invoice context. The repository creates persistent `QuoteNotification` records for active reviewers and charge managers. Review `realtime-notification.patch.txt`; if `emitToQuotationReviewers` filters its recipients, add `MANAGE_QUOTE_CHARGES` to its eligibility list too.

## 7. Validate and manually test

Run the backend and frontend builds from their respective project roots after applying all schema/type changes:

```powershell
# backend
npm run build

# frontend
npm run build
```

Recommended scenarios:

1. Guest: calculate quote, deselect a service, choose both extra-charge options, enter invoice value and note, continue, sign in, and confirm all values appear in the saved request.
2. Already logged-in exporter: repeat the flow and verify submission happens directly without a login redirect.
3. Staff with `VIEW_ALL_QUOTES` + `MANAGE_QUOTE_CHARGES`: open the submitted quote, see invoice context, enter customs and transport prices, and save.
4. Verify both extra charge rows appear alongside selected original services, subtotal includes them, VAT uses the saved quote VAT rate, and total equals subtotal + VAT.
5. Verify the exporter sees the revised itemized rows/totals and receives a notification/message.
6. Staff without `MANAGE_QUOTE_CHARGES` receives 403 from the charge endpoint; a staff member without `VIEW_ALL_QUOTES` cannot use the UI list/detail permission guard.

## Validation boundary

The package files were checked for TypeScript/TSX syntax transpilation errors. A full typecheck/build against the actual repository and a live Prisma migration could not be run from this environment. Apply the schema/types first, then run your project's build and test the scenarios above before deploying.
