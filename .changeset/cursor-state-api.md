---
"@cursor.js/core": minor
---

feat(core): introduce `.setState()` and `onStateChange` for dynamic plugin responsiveness

Added the `.setState()` method to the Cursor queue and introduced the `onStateChange` lifecycle hook in `CursorPlugin`. This allows state changes (like cursor size or colors) to be sequenced properly and enables plugins (like `RipplePlugin`) to dynamically react to state modifications mid-animation.
