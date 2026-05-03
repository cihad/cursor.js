AWK_SCRIPT='
/## Plugins/ {
    skip = 1
    print "## Plugins\n"
    print "Cursor.js supports an extensible plugin system. Some plugins are built-in, while others are available in the Pro package.\n"
    print "- **Core Plugins**: ThemePlugin, IndicatorPlugin, RipplePlugin, ClickSoundPlugin, LoggingPlugin, SayPlugin, SpeechPlugin."
    print "- <span style=\"color: orange; font-weight: 500;\">TrailPlugin</span> <span title=\"Pro\" style=\"cursor: help;\">💎</span>: Adds a magical trail effect to the cursor (Pro)."
    print "- <span style=\"color: orange; font-weight: 500;\">GeminiTTSPlugin</span> <span title=\"Pro\" style=\"cursor: help;\">💎</span>: High-quality text-to-speech using Google Gemini (Pro).\n"
    next
}
skip && /## Architectural Overview/ { skip = 0; print }
skip { next }
!skip { print }
'
awk "$AWK_SCRIPT" D:/projects/cursor.js/README.md > D:/projects/cursor.js/README.md.tmp && mv D:/projects/cursor.js/README.md.tmp D:/projects/cursor.js/README.md
