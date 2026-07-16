Audit the current project for the following categories. Report findings as a prioritized list (Critical → High → Medium → Low).

Categories to check:
1. **Security** — hardcoded secrets, unsafe shell interpolation, missing input validation, exposed credentials in config files.
2. **Permissions** — overly broad `allow` rules in `.claude/settings.json`, hooks that run arbitrary user-supplied input.
3. **Hook safety** — hooks that could be injected via prompt content, missing `matcher` specificity.
4. **CLAUDE.md completeness** — missing rules for commit hygiene, testing, or destructive operations.
5. **Dead config** — commands defined but never referenced, hooks that echo only (no real action).

For each finding include: file path, line or section, severity, and a one-line fix recommendation.

$ARGUMENTS
