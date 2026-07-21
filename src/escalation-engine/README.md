# Escalation Decision Engine

A worked example of an "escalation decision engine": given a support conversation, the
model decides whether to hand off to a human, and if so, why.

## What this demonstrates

- **Three valid escalation triggers** — `EXPLICIT_REQUEST`, `POLICY_GAP`, `STUCK` — each
  requiring the model to name the specific condition, not just gut-check "should I escalate?"
- **Two explicitly excluded triggers** — customer tone/frustration and the model's own
  confidence level are named in the policy as *not* valid reasons to escalate on their own.
- **Frustration vs. explicit request** — a customer can be angry *and* ask for a human; the
  policy requires citing the request as the trigger, not the anger, so escalation reasoning
  stays auditable.
- **Ambiguous-identity handling** — when the model can't uniquely resolve which customer
  account it's dealing with, the policy requires asking for one more identifier rather than
  guessing or escalating.
- **Few-shot-anchored system prompt** — the policy text ends with worked examples so the
  model has concrete precedent for each rule, not just the abstract statement of it.

## Files

| File | Purpose |
|---|---|
| `types.ts` | `DecisionResult` — the structured output shape (`escalate`, `trigger`, `reasoning`, `response_to_user`) |
| `systemPrompt.ts` | The escalation policy text, including the few-shot examples |
| `client.ts` | Anthropic client init (dotenv + `.env.local`, same pattern as `src/api-call-test.ts`) |
| `escalationEngine.ts` | `decide()` — calls the API with `output_config.format` (raw JSON schema) to force structured output |
| `scenarios.ts` | Six test conversations, each with an expected `{escalate, trigger}` |
| `index.ts` | Runs every scenario through `decide()`, prints PASS/FAIL, exits 1 on any failure |

## Run it

From the repo root:

```
npx tsx src/escalation-engine/index.ts
```

Requires `ANTHROPIC_API_KEY` in `.env.local` at the repo root (see the top-level README).
