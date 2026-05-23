# Choice Board — UK SEND Pilot

A digital choice board for non-verbal and emerging-verbal pupils in UK
SEN schools. Built mobile-first and tablet-optimised (iPad 10.2"
primary). Symbol artwork is fetched from licensed sources with a
fallback chain that respects per-school licensing.

This README focuses on **pilot-readiness**: lawful basis, retention,
sub-processors, and how to handle Subject Access Requests (SARs) and
Right-to-Erasure requests. Engineering setup is documented inline.

---

## Lawful basis (UK GDPR)

Children's personal data processed by Choice Board (pupil names,
selections, predictions, session metadata) is processed under:

- **Article 6(1)(e)** — *processing is necessary for the performance
  of a task carried out in the public interest or in the exercise of
  official authority vested in the controller.* The controller is the
  pilot school (or MAT); Choice Board acts as **processor**.
- **Article 9(2)(g)** — *processing is necessary for reasons of
  substantial public interest, on the basis of UK domestic law*
  (Children and Families Act 2014; Education Act 1996) — where
  selection patterns may reveal health information (e.g. distress
  expressed via the "feelings" scene).

The Data Protection Impact Assessment in
[`docs/DPIA.md`](DPIA.md) documents the necessity and proportionality
analysis. A draft Article 28 processor agreement is in
[`docs/DPA.md`](DPA.md).

## Retention

| Data class | Default retention | Configurable per-school? |
|---|---|---|
| Raw `card_selections` rows (with `dwell_ms`, `predicted_in_top3`) | 90 days | Yes — `org_settings.retention_days` |
| Aggregated `mv_pupil_transitions` counts (no individual selection rows) | Indefinite (anonymous to the pupil) | No |
| `sessions` summary rows | 90 days | Yes |
| `predictions_log` (Top-3 + chosen) | 90 days | Yes |
| `ta_notifications` | 30 days | Hard-coded |
| AI-generated symbols pending review (`symbol_review_queue`) | Until approved/rejected | n/a |

The `purgeOldSelections` Edge Function runs nightly. Setting
`retention_days` to `0` disables retention beyond aggregation.

## Sub-processors

| Sub-processor | Purpose | UK/EU adequacy | Data shared |
|---|---|---|---|
| **Supabase Inc.** (eu-west-2) | Managed Postgres, auth, edge functions, object storage | EU data residency configured | All pupil and session data |
| **ARASAAC CDN** (Aragón Government, ES) | Static symbol artwork | EU | Free-text label only (e.g. "apple") — no pupil identifiers |
| **Mulberry Symbols CDN** | Static symbol artwork | UK origin, served via CDN | Label only |
| **Lovable AI Gateway → Nano Banana** | AI symbol synthesis (feature-flagged behind `ENABLE_AI_SYMBOLS`, default OFF) | Subject to gateway terms | Label only — disabled by default |

No selection or pupil data is ever sent to a third party.

## SAR and Right-to-Erasure procedure

1. SENCo verifies the requester's identity (parent/carer with parental
   responsibility, or pupil if competent).
2. SENCo signs in and navigates to **Settings → Pupils**.
3. **SAR**: click "Export data" — calls the `exportPupilData` Edge
   Function and downloads a JSON archive of every row referencing that
   pupil. Deliver to requester via the school's standard SAR channel
   within **one calendar month** (UK GDPR Art. 12(3)).
4. **Erasure**: click "Delete pupil" — calls the `deletePupil` Edge
   Function. Hard-deletes the pupil row and cascades to selections,
   sessions, predictions, and notifications. Aggregated counts in
   `mv_pupil_transitions` are also removed.
5. SENCo records the request in the school's information-rights
   register.

Both endpoints require a valid SENCo JWT and are scoped by `org_id`
RLS — a SENCo at one school cannot export or delete pupils at another.

## Accessibility

- WCAG 2.2 AA targeted; AAA contrast (≥ 7:1) on default theme.
- Tap targets ≥ 64 × 64 px (exceeds the 44 px WCAG floor).
- High-contrast yellow-on-black theme (≈ 19.5:1) for low-vision users.
- `prefers-reduced-motion` respected; in-app **Reduce motion** toggle.
- Screen-reader tested with VoiceOver (iPadOS) and NVDA (Windows).
- Full keyboard navigation; visible focus rings on every interactive
  element (`focus:ring-4 focus:ring-ring/50`).

## Internationalisation

UI strings are wired through `react-i18next` with **en-GB** as the
default and only currently-shipping locale. The `pupils.home_language`
column captures a pupil's home language for SENCo reference; it does
not change the interface yet.

## Observability

- `GET /functions/v1/health` — liveness probe.
- `GET /functions/v1/version` — semantic version + commit.
- Every Edge Function emits structured JSON logs via
  `supabase/functions/_shared/logger.ts`. Logs contain UUIDs and
  counts only — no pupil names, free text, or selection labels.

## Engineering

- `bun install`
- `bun run dev`
- `bun test` — Vitest
- See `CHANGELOG.md` for release history.
