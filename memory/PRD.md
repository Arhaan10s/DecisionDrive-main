# PRD - Neon Tunnel Runner

## Original Problem Statement
Create a tunnel runner type of game in which we have to avoid obstacles by moving our ship left and right in a tunnel and also introduce level systems in the game. Also include vs mode option in the game in which we can play using split screen where one user control its ship using A,D keys and other using arrow keys. Generate a 3d game with good graphics.

## User Choices
- 3D Library: Three.js with React Three Fiber
- Theme: Neon Cyberpunk
- Level Progression: Speed increases per level + more obstacle density
- Scoring: Just score + lives system
- Persistence: Local storage (no backend)

## Architecture
- **Frontend Only**: React 19 + React Router 7
- **3D**: three @0.166 + @react-three/fiber + @react-three/drei
- **Styling**: Tailwind + Shadcn UI tokens, custom neon CSS
- **State**: In-component (refs + useState) — no backend required
- **Persistence**: localStorage (`tunnel_runner_scores_solo`, `tunnel_runner_scores_vs`)

## What's Been Implemented (Feb 2026)
- Main Menu (`/`) — title, system status, primary nav (Play, VS, How To Play, High Scores)
- Solo Game (`/play`) — 3D tunnel, ship, obstacles, lives, score, pause/resume, game over screen
- VS Mode (`/vs`) — split-screen, P1 (A/D) vs P2 (←/→), independent state, winner declaration
- How To Play (`/how-to-play`) — controls + level progression cards + tips
- High Scores (`/scores`) — tabs for Solo/VS, top 10, clear option
- Level System — 6 levels (Genesis → Transcend), thresholds at 800/2K/4K/7K/11K, increasing speed & density, color shifts
- Cyberpunk styling — Unbounded + JetBrains Mono fonts, sharp 0-radius panels, neon glows, scanlines, vignette
- 3D scene — animated tunnel rings, lane lines, star field, glowing ship, emissive obstacles
- Patched node_modules/@emergentbase/visual-edits babel plugin to skip injecting `x-line-number` props onto R3F three.js elements (was breaking R3F applyProps).

## Known Trade-offs / Deferred
- Post-processing (Bloom / ChromaticAberration) disabled due to compatibility issue between `@react-three/postprocessing@2.16` and three.js 0.166 (`instance.current.objects` undefined). Visual glow achieved via emissive materials + CSS text-shadows instead.
- No online leaderboard (user chose local-only).
- No sound effects (not requested).

## Backlog / P1
- Add bloom-like screen-space glow via CSS or alternate post-FX library
- Sound design (engine hum, hit, level-up chime)
- Touch/mobile controls
- Power-ups (shield, slow-mo, magnet)

## P2
- Online leaderboard via backend
- Custom ship skins
- Daily challenge seed
