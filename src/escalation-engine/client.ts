// Mirrors the dotenv/client-init pattern in src/api-call-test.ts for consistency across examples.
import 'dotenv/config';
import dotenv from 'dotenv';
import Anthropic from "@anthropic-ai/sdk";

dotenv.config({ path: '.env.local' });

export const client = new Anthropic();
