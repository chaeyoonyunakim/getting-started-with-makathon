# Changelog

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0-pilot.1] — 2026-05-23

### Added
- Pilot-hardening pass: WCAG 2.2 AA + AAA contrast on default theme;
  `prefers-reduced-motion` support and in-app Reduce motion toggle.
- `react-i18next` scaffolding with `en-GB` as default locale.
- `pupils.home_language` column and SENCo profile editor field.
- Compliance docs: `docs/DPIA.md`, `docs/DPA.md`,
  `docs/pilot-smoke-test.md`, README section on lawful basis,
  retention, sub-processors, and SAR/erasure procedures.
- Observability: `/health` and `/version` Edge Functions; shared
  structured logger (`supabase/functions/_shared/logger.ts`).

### Changed
- High-contrast theme tuned to ≈19.5:1 contrast (black-on-yellow).

## [0.0.x] — pre-pilot iterations

- Session-bounded interaction model with golden-sign reward.
- License-aware symbol resolver: ARASAAC → Mulberry → Sclera → (AI).
- Next-card prediction (Markov + Thompson sampling bandit blend).
- Configurable-depth interaction tree (depth 1/2/3).
- TA in-app notifications via Realtime (replaced Slack webhook).
