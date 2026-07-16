import 'dotenv/config';
import dotenv from 'dotenv';
import Anthropic from "@anthropic-ai/sdk";

dotenv.config({ path: '.env.local' });

const client = new Anthropic();

const buggyCode = `
function add(a, b) {
  return a - b;
}
`;

const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: "You are a terse senior code reviewer. Give feedback in one paragraph.",
    messages: [
        { role: "user", content: `Review this code:\n${buggyCode}` },
    ],
});

for (const block of response.content) {
    if (block.type === "text") {
        console.log(block.text);
    }
}