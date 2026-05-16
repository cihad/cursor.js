---
"@cursor.js/core": patch
---

fix: clean up speech plugin listeners when toggling docs demo plugins

SpeechPlugin now unsubscribes from `speech_requested` when removed so repeated toggles do not stack duplicate speech handlers. The docs settings demo also keeps mutually exclusive speech and interaction plugin variants in sync.
