---
"@cursor.js/core": minor
---

feat: let core plugins use an optional floating provider

SayPlugin and PromptPlugin can now resolve their positioners from an installed
floating plugin provider while keeping the existing built-in positioning
behavior when no provider is present.
