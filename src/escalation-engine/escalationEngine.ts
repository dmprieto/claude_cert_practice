import { client } from "./client.js";
import { SYSTEM_PROMPT } from "./systemPrompt.js";
import type { DecisionResult } from "./types.js";

type Message = { role: "user" | "assistant"; content: string };

// Raw JSON schema (not zod) per project convention — output_config.format guarantees
// the first content block is text containing valid JSON matching this shape.
export async function decide(history: Message[]): Promise<DecisionResult> {
  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: history,
    output_config: {
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            escalate: { type: "boolean" },
            trigger: {
              type: "string",
              enum: ["EXPLICIT_REQUEST", "POLICY_GAP", "STUCK", "NONE"],
            },
            reasoning: { type: "string" },
            response_to_user: { type: "string" },
          },
          required: ["escalate", "trigger", "reasoning", "response_to_user"],
          additionalProperties: false,
        },
      },
    },
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("decide(): no text content block found in the model response");
  }

  return JSON.parse(textBlock.text) as DecisionResult;
}
