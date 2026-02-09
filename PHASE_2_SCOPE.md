Phase-2 Execution Adapters — STRICT SCOPE

Allowed:
- Gig / delivery adapters
- Order ↔ gig state sync
- Evidence logging calls
- SQL migrations
- Tests and refactoring

Forbidden:
- Any Phase-1 protocol logic changes
- Evidence hashing or replay logic
- Ranking, optimisation, persuasion
- Payments, escrow, settlement
- Deployment without approval

Any ambiguity must be raised before coding.
