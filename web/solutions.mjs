const header = '#include <stdio.h>\n\n';
const program = body => `${header}int main(void) {\n${body}\n    return 0;\n}`;

export const solutions = [
  program('    printf("Hello, Adventurer!\\n");'),
  program('    printf("Dawn Bell\\nAlarm Bell\\nHarbor Closed\\n");'),
  program('    printf("1) Enter\\n2) Ask\\n3) Leave\\n");'),
  program('    printf("The bard said, \\"Run!\\"\\n");'),
  program(String.raw`    printf("C:\\AshKing\\map.txt\n");`),
  program('    printf("The crown was broken.\\n\\nSeven runes remain.\\n");'),
  program('    printf("+---+\\n");\n    printf("|[] |\\n");\n    printf("| + |\\n");\n    printf("+---+\\n");'),
  program('    int level = 1;\n    printf("Adventurer Level: %d\\n", level);'),
  program('    int gold = 1;\n    printf("Gold: %d\\n", gold);\n    gold = 5;\n    printf("Gold: %d\\n", gold);'),
  program("    int atk = 7;\n    char rank = 'D';\n    printf(\"ATK: %d\\nRank: %c\\n\", atk, rank);"),
  program('    int x = 3, y = 8;\n    printf("Rune detected at (%d, %d)\\n", x, y);'),
  program('    int hp = 27;\n    int max_hp = 40;\n    printf("Raven HP: %d/%d\\n", hp, max_hp);'),
  program('    printf("Seal Charge: 85%%\\n");'),
  program('    float potion = 12.5f;\n    printf("Potion: %.1f ml\\n", potion);'),
  program('    printf("#");\n    printf("#");\n    printf("#\\n");'),
  program('    printf("Guard A: Who goes there? ");\n    printf("Guard B: Friend.\\nAster\\n");'),
  `/*
 * Day 1 - Fog Harbor
 */\n${header}int main(void) {\n    // Restore the captain's record\n    printf("Log restored.\\n");\n    return 0;\n}`,
  program("    char initial = 'A';\n    int level = 1, hp = 27, gold = 5;\n    printf(\"=====\\n\");\n    printf(\"Name: %c\\n\", initial);\n    printf(\"Level: %d\\n\", level);\n    printf(\"HP: %d Gold: %d\\n\", hp, gold);\n    printf(\"=====\\n\");"),
  program('    int runes = 1;\n    printf("The sea glows.\\nThe chest shakes.\\nThe rune rises!\\nRunes: %d\\n", runes);'),
  program("    char rank = 'D';\n    int level = 1, hp = 27, gold = 5;\n    printf(\"+------------+\\n\");\n    printf(\"| Ash Crown  |\\n\");\n    printf(\"| Welcome    |\\n\");\n    printf(\"| Level: %d   |\\n\", level);\n    printf(\"| HP: %d      |\\n\", hp);\n    printf(\"| Gold: %d    |\\n\", gold);\n    printf(\"| Rank: %c    |\\n\", rank);\n    printf(\"| Press Start|\\n\");\n    printf(\"+------------+\\n\");")
];
