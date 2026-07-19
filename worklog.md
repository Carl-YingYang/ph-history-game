---
Task ID: 1
Agent: Main Agent
Task: Complete rebuild of Project Noor as Pokémon-style RPG

Work Log:
- Analyzed 28 sprite sheet images (all 988x1024) to determine pixel grid structure
- Detected background color (63,97,124) and used it for proper transparency extraction
- Found sprite sheet structure: header area (rows 21-279) with portrait, then 10 animation rows (idle, walk, run, jump, attack, hurt, dead, fall, climb, jumpattack) with ~10 frames each
- Extracted 1,557 individual sprite frames from 15 character/NPC sheets with proper transparent backgrounds
- Extracted building, nature, interior, animal, furniture, collectible, and UI assets from asset sheets
- Rebuilt the entire project as a Pokémon-style 2D RPG:
  - Removed all dashboard/LMS/web UI components (HUD, Codex, Journal, Quiz)
  - Created full-screen game canvas with no React overlays
  - Built Pokémon-style TitleScene with "Press Start" prompt
  - Created SanDiegoScene with 40x30 tile map (church, library, town hall, forest, river, plaza)
  - Implemented 4-directional player movement with walk animations
  - Camera follows player with smooth lerp
  - 4 NPCs with proximity detection and interaction (Z key)
  - Pokémon-style dialogue system with typewriter effect (all in Phaser, no React)
  - Quest system: Talk to Mang Tenyo → Accept quest → Find 3 items → Return → Chapter 1 complete
  - Minimal HUD showing only current objective
  - Intro cutscene with typewriter text
  - Chapter completion with fade out

Stage Summary:
- Game compiles and runs successfully (GET / 200, 27603 bytes)
- Clean project structure: 4 scene files + 1 config + 1 component + page
- ESLint passes with no errors
- Sprite assets properly extracted with transparent backgrounds
- Game flow: Title → Intro → Explore → Talk → Quest → Collect → Complete
