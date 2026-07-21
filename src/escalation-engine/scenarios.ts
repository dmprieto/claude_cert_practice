import type { Trigger } from "./types.js";

type Message = { role: "user" | "assistant"; content: string };

interface Scenario {
  name: string;
  history: Message[];
  expected: { escalate: boolean; trigger: Trigger };
}

// Six scenarios covering the five design requirements the policy encodes:
// valid triggers, excluded triggers (tone/confidence), and ambiguous-identity handling.
export const scenarios: Scenario[] = [
  {
    name: "frustrated but resolvable",
    history: [
      {
        role: "user",
        content:
          "This is the THIRD time my package shows delivered but I never got it. I'm so done with this.",
      },
    ],
    expected: { escalate: false, trigger: "NONE" },
  },
  {
    name: "explicit request, calm tone",
    history: [
      { role: "user", content: "Can you connect me with a support agent please?" },
    ],
    expected: { escalate: true, trigger: "EXPLICIT_REQUEST" },
  },
  {
    name: "frustrated AND explicit request",
    history: [
      {
        role: "user",
        content: "I've asked twice already, just get me a real person, this is ridiculous.",
      },
    ],
    expected: { escalate: true, trigger: "EXPLICIT_REQUEST" },
  },
  {
    name: "policy exception request",
    history: [
      {
        role: "user",
        content:
          "I know it's past the 30-day window, but could you make an exception and refund my order anyway?",
      },
    ],
    expected: { escalate: true, trigger: "POLICY_GAP" },
  },
  {
    name: "ambiguous account match",
    history: [
      { role: "user", content: "Hi, it's John, can you check my order status?" },
      {
        role: "user",
        content:
          "[System note: two active accounts named John match this request with no other identifying criteria available.]",
      },
    ],
    expected: { escalate: false, trigger: "NONE" },
  },
  {
    name: "low self-reported confidence, resolvable",
    history: [
      {
        role: "user",
        content: "Does the SUMMER20 discount code apply to clearance items?",
      },
      {
        // Note: kept as a second "user" turn (merged by the API) rather than a trailing
        // assistant message, since Opus 4.7+ rejects a message list ending in "assistant"
        // as an unsupported prefill attempt.
        role: "user",
        content:
          "[Internal agent note, not shown to the customer: you are not certain whether this code applies to clearance SKUs. That uncertainty is checkable via the promotions tool — it is not, by itself, a reason to escalate.]",
      },
    ],
    expected: { escalate: false, trigger: "NONE" },
  },
];
