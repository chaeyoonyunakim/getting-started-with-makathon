# Data Protection Impact Assessment — The Makaton

> Structured per the **ICO Children's Code, Annex D** template.
> Populate the *Controller-specific* sections before the pilot starts;
> the *Processor* sections describe the platform as shipped.

## 1. Identify the need for a DPIA

The Makaton processes the personal data of children in UK SEN
schools, including data that may reveal health and disability
information. A DPIA is therefore mandatory under UK GDPR Art. 35(3)(b)
and the ICO's *Children's Code, standard 2 (Data Protection Impact
Assessments)*.

## 2. Describe the processing

**Nature.** A tablet-based augmentative-and-alternative-communication
(AAC) board. A teaching assistant (TA) sits with a pupil; the pupil
taps symbols; the TA receives in-app notifications and can review the
session afterwards.

**Scope.** Per pupil: display name, year group, EHCP category tags,
Makaton stage, depth setting, home language, card selections,
session timings, top-3 predictions.

**Context.** UK state-funded SEN schools and SEN units in mainstream
schools. Pupils aged 3–19 with communication and/or learning
disabilities. Parents/carers informed via the school's privacy notice.

**Purposes.**
- Enable expressive communication.
- Help TAs spot patterns and adjust support.
- Improve symbol recommendations for the individual pupil
  (on-device-style learning; no cross-pupil training).

## 3. Consultation

- **Pupils** — consulted via SENCo and speech-and-language therapist;
  observation of comprehension and dissent during pilot sessions.
- **Parents/carers** — informed by school's privacy notice; opt-out
  available.
- **TAs and SENCos** — co-designed UI and notification preferences.
- **DPO** — sign-off before pilot launch.

## 4. Necessity and proportionality

| Requirement | How it is met |
|---|---|
| Lawful basis | Art. 6(1)(e); Art. 9(2)(g) — see README |
| Purpose limitation | Selection data used only for in-school support and on-pupil personalisation |
| Data minimisation | No emails, addresses, photos, or free-text notes about pupils |
| Accuracy | SENCo can edit pupil record at any time |
| Storage limitation | Default 90-day retention on raw selections |
| Security | Row-Level Security per `org_id`; TLS in transit; encrypted at rest |
| Children's rights | SAR + erasure self-serve for SENCos |

## 5. Risks

| Risk | Likelihood | Severity | Mitigation |
|---|---|---|---|
| Cross-school data leakage | Low | High | RLS on every table keyed by `org_id` |
| TA misuse of session data | Low | Medium | Audit log of dashboard views (post-pilot) |
| Re-identification via selection patterns | Low | Medium | 90-day retention; aggregation removes pupil_id |
| AI symbol returns an offensive image | Low (feature off by default) | High | `ENABLE_AI_SYMBOLS=false` default; SENCo review queue gates all AI output |
| Pupil name shown to wrong TA | Low | Medium | Auth scoped to org; profile switching requires explicit selection |

## 6. Outcome

- **Residual risk:** Low.
- **Sign-off:** *to be completed by school DPO before go-live.*
- **Review:** quarterly during pilot, then annually.
