import 'dotenv/config';
import dotenv from 'dotenv';
import Anthropic from "@anthropic-ai/sdk";
import { ContentBlock, MessageParam, Tool, ToolResultBlockParam } from '@anthropic-ai/sdk/resources';

dotenv.config({ path: '.env.local' });

const client = new Anthropic();
const tools: Tool[] = [
    {
        "name": "get_weather",
        "description": "Get the current weather for a city.",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "The city to get weather for",
                }
            },
            "required": ["city"],
        },
    }
]
const messages: MessageParam[] = [
    { content: "What should I wear in Austin today?", role: "user" }
]

// run_tool is just a hardcoded lookup.
// In a real app, this would hit your database, an API, whatever.
const run_tool = (name: string, tool_input: unknown) => {
    if (name == "get_weather") {
        const { city } = tool_input as { city: string }
        return `Weather in ${city}: 95F, sunny`
    }

    throw Error(`Unknown tool: ${name}`)
}


// The agent loop. Each iteration sends messages to Claude
// and switches on the response's stop reason.
while (true) {
    const tool_results: ToolResultBlockParam[] = []
    const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages: messages,
        tools: tools
    })

    if (response.stop_reason == "end_turn") {
        // Claude is done. Print the final text and break.
        response.content.forEach((block) => {
            if (block.type == "text") {
                console.log(block.text)
            }

        })
        break
    }

    if (response.stop_reason == "tool_use") {
        // Find the tool use blocks in the response and run each one.

        response.content.forEach((block: ContentBlock) => {
            if (block.type == "tool_use") {
                const result = run_tool(block.name, block.input)
                tool_results.push(
                    {
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    })
            }
        })

        // Push the assistant's response and our tool results
        // back into messages, then loop again so Claude can answer.
        messages.push({ "role": "assistant", "content": response.content })
        messages.push({ "role": "user", "content": tool_results })
    }
}







