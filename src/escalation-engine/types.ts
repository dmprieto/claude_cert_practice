// Shape of the structured output the model must return — mirrors the JSON schema passed to output_config.

export const TRIGGERS = ["EXPLICIT_REQUEST", "POLICY_GAP", "STUCK", "NONE"] as const;
export type Trigger = typeof TRIGGERS[number];

export interface DecisionResult {
  escalate: boolean;
  trigger: Trigger;          // "NONE" when escalate is false
  reasoning: string;         // internal — not shown to the customer
  response_to_user: string;  // what actually gets sent
}
