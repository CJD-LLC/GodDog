GodDog Asset Specification + GenAI Prompts (Boss clarified, ISOMETRIC)
CRITICAL CAMERA / VIEW RULE
- IMPORTANT: THE GAME IS VIEWED AT AN ISOMETRIC ANGLE. MAKE ALL ART RELEVANT TO THAT RULE.
- Assume classic 2:1 isometric / 3⁄4 top-down view (objects rotated ~45°), with consistent top-left light.
GLOBAL SETTING / CONTEXT (baked into every prompt)
- Game: GodDog
- Factions: K9 (dogs) vs 9Lives (cats)
- Hero (Boss): a normal wolfhound hero; friendly, slightly dopey expression; intelligent eyes; approachable silhouette.
- Art style: production-ready pixel art; crisp readability at 64x64; no anti-aliasing; limited palette (16–32 colors); indexed-color feel.
- Palette guidance: Background dark grays (#1a1a1a, #2a2a2a); Player blues (#4a90e2, #6495ed); Enemies red/orange (#ff4444, #ff8844, #884444); UI white/yellow/green/red; Effects cyan/orange/yellow-orange.
- Output: PNG with transparency where applicable; horizontal sprite strips for animations.
- Negative prompt (append to all prompts unless UI-title-logo): no extra text, no letters, no watermark, no logo, no photorealism, no blur, no painterly rendering, no anti-aliasing.
---
1) PLAYER SPRITES (64x64 per frame; isometric)
1.1 Player Idle Animation
File: assets/sprites/player/idle.png | 256x64 (4×64) | 4 frames | 8 FPS | Loop: yes
Prompt: Pixel art sprite strip, 4 frames horizontal. A normal friendly wolfhound hero (Boss), slightly dopey but intelligent expression, standing idle in a 2:1 isometric / 3⁄4 top-down view. Subtle breathing/bobbing, tiny tail wag, small ear flick. Blue player palette, strong silhouette, top-left light. Transparent background.
1.2 Player Walk Animation
File: assets/sprites/player/walk.png | 512x64 (8×64) | 8 frames | 12 FPS | Loop: yes
Prompt: Pixel art walk cycle sprite strip, 8 frames horizontal. Boss (normal friendly wolfhound) walking energetically in 2:1 isometric view; clear leg cycle, body bounce, tail swing. Blue player palette, top-left light, strong readability. Transparent background.
1.3 Player Attack 1 (First Combo)
File: assets/sprites/player/attack_1.png | 256x64 (4×64) | 4 frames | Loop: no
Prompt: Pixel art attack combo #1 sprite strip, 4 frames horizontal, 2:1 isometric view. Boss does a quick bite/snap forward: anticipation → strike (clear impact frame) → follow-through. Exaggerated motion for isometric readability; blue palette; top-left light; transparent background.
1.4 Player Attack 2 (Second Combo)
File: assets/sprites/player/attack_2.png | 256x64 (4×64) | 4 frames | Loop: no
Prompt: Pixel art attack combo #2 sprite strip, 4 frames, 2:1 isometric view. Boss performs a side swipe / body-check style continuation of combo with clear arcs readable from isometric angle. Blue palette; top-left light; transparent background.
1.5 Player Attack 3 (Third Combo – Finisher)
File: assets/sprites/player/attack_3.png | 320x64 (5×64) | 5 frames | Loop: no
Prompt: Pixel art finisher combo sprite strip, 5 frames, 2:1 isometric view. Boss executes a heavy lunge or spin-finisher with strong anticipation and impactful keyframe; readable silhouette. Blue palette; top-left light; transparent background.
1.6 Player Dodge
File: assets/sprites/player/dodge.png | 384x64 (6×64) | 6 frames | 20 FPS | Loop: no
Prompt: Pixel art dodge sprite strip, 6 frames, 2:1 isometric view. Boss does a quick dash/roll with stretched smear frame or 1–2 afterimages; snappy timing. Blue palette; top-left light; transparent background.
1.7 Player Hurt
File: assets/sprites/player/hurt.png | 128x64 (2×64) | 2 frames | Loop: no
Prompt: Pixel art hurt/flinch sprite strip, 2 frames, 2:1 isometric view. Boss recoils with a brief impact pose; optionally a tiny flash cue. Blue palette; top-left light; transparent background.
1.8 Player Death
File: assets/sprites/player/death.png | 384x64 (6×64) | 6 frames | Loop: no
Prompt: Pixel art death sprite strip, 6 frames, 2:1 isometric view. Boss collapses/falls into a final pose; can slightly fade at end. Dramatic but clean. Blue palette; top-left light; transparent background.
---
2) ENEMY SPRITES (64x64 per frame; isometric; cats)
2.1 Basic Enemy
Basic Idle
File: assets/sprites/enemies/basic/idle.png | 256x64 (4×64)
Prompt: Pixel art cat enemy idle strip, 4 frames, 2:1 isometric view. Aggressive feline stance, subtle motion, simple readable silhouette. Enemy red palette (#ff4444); top-left light; transparent background.
Basic Walk
File: assets/sprites/enemies/basic/walk.png | 384x64 (6×64)
Prompt: Pixel art basic cat enemy walk cycle, 6 frames, 2:1 isometric view. Stiff/aggressive gait; readable steps. Red palette; top-left light; transparent background.
Basic Attack
File: assets/sprites/enemies/basic/attack.png | 320x64 (5×64)
Prompt: Pixel art basic cat enemy attack, 5 frames, 2:1 isometric view. Clear wind-up → lunge/bite/scratch → recoil. Red palette; top-left light; transparent background.
Basic Death
File: assets/sprites/enemies/basic/death.png | 256x64 (4×64)
Prompt: Pixel art basic cat enemy death, 4 frames, 2:1 isometric view. Quick collapse/fade; readable. Red palette; top-left light; transparent background.
2.2 Fast Enemy
Fast Idle
File: assets/sprites/enemies/fast/idle.png | 192x64 (3×64)
Prompt: Pixel art fast cat enemy idle, 3 frames, 2:1 isometric view. Smaller/leaner silhouette, twitchy motion. Orange palette (#ff8844); top-left light; transparent background.
Fast Walk
File: assets/sprites/enemies/fast/walk.png | 512x64 (8×64)
Prompt: Pixel art fast cat enemy walk/run cycle, 8 frames, 2:1 isometric view. Fluid fast movement; clear legs; energetic. Orange palette; top-left light; transparent background.
Fast Attack
File: assets/sprites/enemies/fast/attack.png | 256x64 (4×64)
Prompt: Pixel art fast cat enemy attack, 4 frames, 2:1 isometric view. Darting slash/leap; quick unpredictable strike. Orange palette; top-left light; transparent background.
Fast Death
File: assets/sprites/enemies/fast/death.png | 192x64 (3×64)
Prompt: Pixel art fast cat enemy death, 3 frames, 2:1 isometric view. Quick fall/fade. Orange palette; top-left light; transparent background.
2.3 Tank Enemy
Tank Idle
File: assets/sprites/enemies/tank/idle.png | 256x64 (4×64)
Prompt: Pixel art tank cat enemy idle, 4 frames, 2:1 isometric view. Large bulky silhouette, slow heavy breathing motion. Dark red palette (#884444); top-left light; transparent background.
Tank Walk
File: assets/sprites/enemies/tank/walk.png | 320x64 (5×64)
Prompt: Pixel art tank cat enemy walk, 5 frames, 2:1 isometric view. Heavy steps; weighty motion; readable. Dark red palette; top-left light; transparent background.
Tank Attack
File: assets/sprites/enemies/tank/attack.png | 384x64 (6×64)
Prompt: Pixel art tank cat enemy attack, 6 frames, 2:1 isometric view. Long wind-up then heavy slam/bite; strong impact keyframe. Dark red palette; top-left light; transparent background.
Tank Death
File: assets/sprites/enemies/tank/death.png | 320x64 (5×64)
Prompt: Pixel art tank cat enemy death, 5 frames, 2:1 isometric view. Slow dramatic collapse; can include small burst/dust. Dark red palette; top-left light; transparent background.
---
3) NPC / FOLLOWER SPRITES (32x32 per frame; isometric)
3.1 Follower Sprite Sheet
File: assets/sprites/npcs/follower.png | 192x32 (6×32) (2 idle + 4 walk)
Prompt: Pixel art companion dog sprite strip (2 idle frames then 4 walk frames), 2:1 isometric view scaled to 32x32. Friendly small dog companion silhouette, simple readable motion. Green palette accent (#44ff44); top-left light; transparent background.
---
4) EFFECT SPRITES
4.1 Attack Slash Effect
File: assets/effects/combat/attack_slash.png | 256x64 (4×64)
Prompt: Pixel art combat VFX slash strip, 4 frames. Bright arc slash + sparks, designed to read over isometric sprites; quick dissipate; can be semi-transparent. Warm/bright highlights; top-left light consistency.
4.2 Shield Aura
File: assets/effects/god_abilities/shield.png | 512x64 (8×64)
Prompt: Pixel art looping magical shield aura strip, 8 frames. Cyan (#00ffff) circular energy ring that wraps the player in isometric view; pulsing/rotating feel; subtle particles; semi-transparent interior; crisp edge glow.
---
5) UI ASSETS
5.1 Health Bar BG
File: assets/effects/ui/health_bar_bg.png | 200x20
Prompt: Pixel art UI frame for health bar, 200x20. Dark red/brown border, crisp corners, subtle bevel, transparent outside frame.
5.1 Health Bar Fill
File: assets/effects/ui/health_bar_fill.png | 200x20
Prompt: Pixel art bar fill, 200x20, stretches/tiles cleanly. Red gradient dark→bright, pixel-consistent, no banding. Transparent background.
5.2 Cooldown Bar
File: assets/effects/ui/cooldown_bar.png | 200x15
Prompt: Pixel art cooldown bar background, 200x15. Dark gray/black with border and subtle inner track; clean edges; transparent background.
5.3 Menu Background
File: assets/ui/menu_background.png | 1920x1080
Prompt: Pixel art / retro menu background (not a sprite), dark atmospheric. Subtle K9 vs 9Lives motifs, distant silhouettes, moody environment; keep large clear negative space for UI overlay. No text.
5.3 Title Logo
File: assets/ui/title_logo.png | 512x128
Prompt: Pixel art title logo reading “GodDog” (text included intentionally). Big readable letters, retro pixel type, subtle dog/cat motif (pawprint accents), strong contrast. Transparent background.
5.3 Menu Buttons (Idle/Hover/Pressed)
Files: assets/ui/button_idle.png, button_hover.png, button_pressed.png | 200x50 each
Prompt: Pixel art UI button set, 200x50. Three states: idle neutral, hover brighter highlight, pressed darker/inset. Consistent border and shape; subtle GodDog theme detail but no text. Transparent background.
---
6) TILE ASSETS (64x64 tiles unless noted; isometric-readability)
6.1 Level 1 – The Crossing
Ground Tile
File: assets/tiles/level1_crossing/ground.png | 64x64
Prompt: Pixel art seamless ground tile for “The Crossing” in an isometric game: dirt/stone/grass mix that still tiles seamlessly on the game grid; top-left light; readable texture.
Water Tiles (Animated)
File: assets/tiles/level1_crossing/water.png | 256x64 (4×64)
Prompt: Pixel art seamless animated water tile strip, 4 frames. Subtle ripples; edges must tile seamlessly; cool darker blues/teals; top-left light.
Bridge Tile
File: assets/tiles/level1_crossing/bridge.png | 64x64
Prompt: Pixel art bridge/platform tile for isometric world: wooden planks or stone slab, clear silhouette, connects cleanly to ground tile edges; top-left light.
Obstacles Sheet
File: assets/tiles/level1_crossing/obstacles.png | various
Prompt: Pixel art obstacle props sprite sheet (rocks, logs, broken signposts), designed to sit correctly in isometric view (top surfaces lit, side faces shaded). Transparent background.
6.2 Level 2 – Village of Bent Tails
Grass Tile
File: assets/tiles/level2_village/grass.png | 64x64
Prompt: Pixel art seamless grass tile with subtle variation cues (tiny flowers/patches), isometric-friendly shading; top-left light.
Path Tile
File: assets/tiles/level2_village/path.png | 64x64
Prompt: Pixel art seamless dirt/stone path tile, readable edges, designed to connect to itself and blend with grass; isometric-friendly shading; top-left light.
Building Wall Tile
File: assets/tiles/level2_village/building_wall.png | 64x64
Prompt: Pixel art building wall texture tile that works in isometric view (visible side face + subtle edge highlight), tiles vertically/horizontally; top-left light.
Building Roof Tile
File: assets/tiles/level2_village/building_roof.png | 64x64
Prompt: Pixel art roof tile texture for isometric buildings (top plane emphasized, consistent shading), tiles horizontally; top-left light.
Door
File: assets/tiles/level2_village/door.png | 32x64
Prompt: Pixel art door sprite (32x64) that fits an isometric building wall; readable frame, slight bevel; top-left light; transparent background.
6.3 Level 3 – The Scented Warrens
Dirt Tile
File: assets/tiles/level3_warrens/dirt.png | 64x64
Prompt: Pixel art seamless dark dirt/earth tile; underground feel; isometric-friendly shading; top-left light.
Tunnel Wall
File: assets/tiles/level3_warrens/tunnel_wall.png | 64x64
Prompt: Pixel art cave/tunnel wall tile for isometric view (darker side faces, lighter edges), tiles cleanly; top-left light.
Tunnel Ceiling
File: assets/tiles/level3_warrens/tunnel_ceiling.png | 64x64
Prompt: Pixel art ceiling tile with darker value and occasional roots/soil texture; isometric-friendly; top-left light.
Roots
File: assets/tiles/level3_warrens/roots.png | various
Prompt: Pixel art root decoration sprites (various sizes) that overlay tunnels in isometric view; twisted roots; top-left light; transparent background.
6.4 Level 4 – Trial of Divinity
Stone Floor
File: assets/tiles/level4_trial/stone_floor.png | 64x64
Prompt: Pixel art carved stone floor tile; ancient/sacred; subtle runes/etching ok; tiles seamlessly; isometric-friendly shading; top-left light.
Stone Wall
File: assets/tiles/level4_trial/stone_wall.png | 64x64
Prompt: Pixel art stone wall tile for an isometric temple; clean repeating blocks; darker side faces; tiles well; top-left light.
Altar
File: assets/tiles/level4_trial/altar.png | 128x128
Prompt: Pixel art altar prop (128x128) for isometric view: top plane + two visible side faces, sacred carvings, strong silhouette. Centerpiece. Top-left light; transparent background.
6.5 Level 5 – The Broken Throne
Corrupted Ground
File: assets/tiles/level5_throne/corrupted_ground.png | 64x64
Prompt: Pixel art seamless corrupted ground tile; dark with subtle purple/red tints; cracks/ooze; tiles seamlessly; isometric-friendly shading; top-left light.
Throne
File: assets/tiles/level5_throne/throne.png | 128x192
Prompt: Pixel art ruined throne prop (128x192) in isometric view: tall imposing silhouette, cracked stone/metal, corrupted accents; top plane + side faces; top-left light; transparent background.
Corruption Effect (Animated)
File: assets/tiles/level5_throne/corruption.png | 384x64 (6×64)
Prompt: Pixel art animated corruption VFX strip, 6 frames. Pulsing dark energy w/ purple-red highlights; designed to overlay isometric tiles; loopable; semi-transparent ok.
---
7) OPTIONAL / ADDITIONAL
7.1 Particle Effects (optional sheets)
Hit sparks 16x16 (4 frames): Pixel art sparks burst, very readable, warm highlights.
Blood particles 16x16 (3 frames): Pixel art droplets/splats, minimal but clear.
Dust particles 16x16 (4 frames): Pixel art dust puffs for isometric ground contact.
Magic particles 16x16 (6 frames): Pixel art twinkles/orbs, cyan/orange variants.
7.2 Boss Sprites (Future; larger)
Corrupted Watchdog / Pack Leader Zealot / Avatar of False Obedience / The Leashbearer: recommend 128x128+ frames; must also be 2:1 isometric view.

