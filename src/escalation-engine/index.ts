import { decide } from "./escalationEngine.js";
import { scenarios } from "./scenarios.js";

let failures = 0;

for (const scenario of scenarios) {
  const result = await decide(scenario.history);
  const pass =
    result.escalate === scenario.expected.escalate &&
    result.trigger === scenario.expected.trigger;

  if (!pass) failures++;

  console.log(`${pass ? "PASS" : "FAIL"} — ${scenario.name}`);
  console.log(
    `  expected: escalate=${scenario.expected.escalate} trigger=${scenario.expected.trigger}`,
  );
  console.log(`  actual:   escalate=${result.escalate} trigger=${result.trigger}`);
  console.log(`  response_to_user: ${result.response_to_user}`);
  console.log("");
}

const passed = scenarios.length - failures;
console.log(`${passed}/${scenarios.length} scenarios passed`);

if (failures > 0) {
  process.exit(1);
}
