# GodDog Asset Specification

Complete list of all required assets for production, organized by category with technical specifications and creation guidelines.

## Color Palette Recommendations

**Primary Palette (16-32 colors):**
- Background: Dark grays (#1a1a1a, #2a2a2a)
- Player: Blue tones (#4a90e2, #6495ed)
- Enemies: Red/Orange tones (#ff4444, #ff8844, #884444)
- UI: White (#ffffff), Yellow (#ffff00), Green (#00ff00), Red (#ff0000)
- Effects: Cyan (#00ffff), Orange (#ffa500), Yellow-Orange (#ffd700)

**Technical Notes:**
- Use indexed color mode (8-bit) for retro feel
- Maintain consistent light source (top-left)
- No anti-aliasing on sprites
- Keep color count low for pixel art consistency
- Ensure good contrast for gameplay visibility

---

## 1. PLAYER SPRITES

**Base Size:** 64x64 pixels per frame  
**Format:** PNG with transparency  
**Layout:** Horizontal strips (left to right)

### 1.1 Player Idle Animation
- **File:** `assets/sprites/player/idle.png`
- **Dimensions:** 256x64 (4 frames × 64px)
- **Frames:** 4
- **Animation Speed:** 8 FPS (150ms per frame)
- **Loop:** Yes
- **Notes:** Subtle breathing/bobbing motion. Dog standing still, slight tail wag or ear movement.

### 1.2 Player Walk Animation
- **File:** `assets/sprites/player/walk.png`
- **Dimensions:** 512x64 (8 frames × 64px)
- **Frames:** 8
- **Animation Speed:** 12 FPS (100ms per frame)
- **Loop:** Yes
- **Notes:** Full walk cycle. Include leg movement, body bounce, tail swing. Should feel energetic.

### 1.3 Player Attack 1 (First Combo)
- **File:** `assets/sprites/player/attack_1.png`
- **Dimensions:** 256x64 (4 frames × 64px)
- **Frames:** 4
- **Animation Speed:** Variable (80ms, 60ms, 60ms, 100ms)
- **Loop:** No
- **Notes:** Quick bite/snap forward. Frame 2-3 should show impact/extended reach. Anticipation → strike → follow-through.

### 1.4 Player Attack 2 (Second Combo)
- **File:** `assets/sprites/player/attack_2.png`
- **Dimensions:** 256x64 (4 frames × 64px)
- **Frames:** 4
- **Animation Speed:** Variable (80ms, 60ms, 60ms, 100ms)
- **Loop:** No
- **Notes:** Side swipe or different angle attack. Should feel like continuation of combo.

### 1.5 Player Attack 3 (Third Combo - Finisher)
- **File:** `assets/sprites/player/attack_3.png`
- **Dimensions:** 320x64 (5 frames × 64px)
- **Frames:** 5
- **Animation Speed:** Variable (80ms, 60ms, 60ms, 60ms, 100ms)
- **Loop:** No
- **Notes:** Most powerful attack. Could be spinning attack or heavy lunge. Should feel impactful.

### 1.6 Player Dodge
- **File:** `assets/sprites/player/dodge.png`
- **Dimensions:** 384x64 (6 frames × 64px)
- **Frames:** 6
- **Animation Speed:** 20 FPS (50ms per frame)
- **Loop:** No
- **Notes:** Quick roll/dash. Should show motion blur effect (stretched sprite) or multiple afterimages. Fast and snappy.

### 1.7 Player Hurt
- **File:** `assets/sprites/player/hurt.png`
- **Dimensions:** 128x64 (2 frames × 64px)
- **Frames:** 2
- **Animation Speed:** 10 FPS (100ms per frame)
- **Loop:** No
- **Notes:** Flinch/recoil animation. Brief, shows impact. Can flash or show brief invulnerability effect.

### 1.8 Player Death
- **File:** `assets/sprites/player/death.png`
- **Dimensions:** 384x64 (6 frames × 64px)
- **Frames:** 6
- **Animation Speed:** 8 FPS (150ms per frame)
- **Loop:** No
- **Notes:** Fall down animation. Can fade out or show final pose. Should feel final and dramatic.

---

## 2. ENEMY SPRITES

**Base Size:** 64x64 pixels per frame  
**Format:** PNG with transparency  
**Layout:** Horizontal strips

### 2.1 Basic Enemy

#### Basic Idle
- **File:** `assets/sprites/enemies/basic/idle.png`
- **Dimensions:** 256x64 (4 frames × 64px)
- **Frames:** 4
- **Animation Speed:** 8 FPS (150ms per frame)
- **Color:** Red (#ff4444)
- **Notes:** Aggressive stance, slight movement. Should look menacing but not too complex.

#### Basic Walk
- **File:** `assets/sprites/enemies/basic/walk.png`
- **Dimensions:** 384x64 (6 frames × 64px)
- **Frames:** 6
- **Animation Speed:** 10 FPS (120ms per frame)
- **Notes:** Standard walk cycle. Should match player walk feel but more aggressive/stiff.

#### Basic Attack
- **File:** `assets/sprites/enemies/basic/attack.png`
- **Dimensions:** 320x64 (5 frames × 64px)
- **Frames:** 5
- **Animation Speed:** Variable (100ms, 80ms, 80ms, 80ms, 100ms)
- **Notes:** Lunge or bite attack. Clear wind-up and strike frames.

#### Basic Death
- **File:** `assets/sprites/enemies/basic/death.png`
- **Dimensions:** 256x64 (4 frames × 64px)
- **Frames:** 4
- **Animation Speed:** 8 FPS (150ms per frame)
- **Notes:** Quick death animation. Can fade or fall.

### 2.2 Fast Enemy

#### Fast Idle
- **File:** `assets/sprites/enemies/fast/idle.png`
- **Dimensions:** 192x64 (3 frames × 64px)
- **Frames:** 3
- **Animation Speed:** 8 FPS (150ms per frame)
- **Color:** Orange (#ff8844)
- **Notes:** Smaller, leaner silhouette. Quick, twitchy movements.

#### Fast Walk
- **File:** `assets/sprites/enemies/fast/walk.png`
- **Dimensions:** 512x64 (8 frames × 64px)
- **Frames:** 8
- **Animation Speed:** 15 FPS (80ms per frame)
- **Notes:** Fast, fluid movement. More frames for smoother animation.

#### Fast Attack
- **File:** `assets/sprites/enemies/fast/attack.png`
- **Dimensions:** 256x64 (4 frames × 64px)
- **Frames:** 4
- **Animation Speed:** Variable (80ms, 60ms, 60ms, 80ms)
- **Notes:** Quick, darting attack. Should feel fast and unpredictable.

#### Fast Death
- **File:** `assets/sprites/enemies/fast/death.png`
- **Dimensions:** 192x64 (3 frames × 64px)
- **Frames:** 3
- **Animation Speed:** 8 FPS (150ms per frame)
- **Notes:** Quick death, matches fast enemy feel.

### 2.3 Tank Enemy

#### Tank Idle
- **File:** `assets/sprites/enemies/tank/idle.png`
- **Dimensions:** 256x64 (4 frames × 64px)
- **Frames:** 4
- **Animation Speed:** 8 FPS (150ms per frame)
- **Color:** Dark Red (#884444)
- **Notes:** Larger, bulkier silhouette. Slow, heavy movements.

#### Tank Walk
- **File:** `assets/sprites/enemies/tank/walk.png`
- **Dimensions:** 320x64 (5 frames × 64px)
- **Frames:** 5
- **Animation Speed:** 8 FPS (150ms per frame)
- **Notes:** Slow, heavy walk. Each step should feel impactful.

#### Tank Attack
- **File:** `assets/sprites/enemies/tank/attack.png`
- **Dimensions:** 384x64 (6 frames × 64px)
- **Frames:** 6
- **Animation Speed:** Variable (120ms, 100ms, 100ms, 100ms, 100ms, 120ms)
- **Notes:** Powerful, slow attack. Long wind-up, heavy impact.

#### Tank Death
- **File:** `assets/sprites/enemies/tank/death.png`
- **Dimensions:** 320x64 (5 frames × 64px)
- **Frames:** 5
- **Animation Speed:** 6 FPS (200ms per frame)
- **Notes:** Slow, dramatic death. Can include collapse or explosion effect.

---

## 3. NPC/FOLLOWER SPRITES

**Base Size:** 32x32 pixels per frame  
**Format:** PNG with transparency  
**Layout:** Horizontal strip (shared file)

### 3.1 Follower Sprite Sheet
- **File:** `assets/sprites/npcs/follower.png`
- **Dimensions:** 192x32 (6 frames total: 2 idle + 4 walk × 32px)
- **Frames:** 6 (frames 1-2: idle, frames 3-6: walk)
- **Idle Animation:** 2 frames, 5 FPS (200ms per frame)
- **Walk Animation:** 4 frames, 10 FPS (120ms per frame)
- **Color:** Green (#44ff44)
- **Notes:** Smaller, friendly version of player. Simple animations. Should look like a companion dog.

---

## 4. EFFECT SPRITES

### 4.1 Combat Effects

#### Attack Slash Effect
- **File:** `assets/effects/combat/attack_slash.png`
- **Dimensions:** 256x64 (4 frames × 64px)
- **Frames:** 4
- **Animation Speed:** Fast (varies)
- **Notes:** Slash/impact effect. Should appear at attack point. Bright, flashy. Can be semi-transparent.

### 4.2 God Ability Effects

#### Shield Aura
- **File:** `assets/effects/god_abilities/shield.png`
- **Dimensions:** 512x64 (8 frames × 64px)
- **Frames:** 8
- **Animation Speed:** Smooth loop
- **Color:** Cyan (#00ffff)
- **Notes:** Circular shield effect around player. Should pulse or rotate. Glowing, magical appearance.

---

## 5. UI ASSETS

**Format:** PNG with transparency (where applicable)

### 5.1 Health Bar
- **File:** `assets/effects/ui/health_bar_bg.png`
- **Dimensions:** 200x20
- **Notes:** Background frame for health bar. Dark red/brown border.

- **File:** `assets/effects/ui/health_bar_fill.png`
- **Dimensions:** 200x20
- **Notes:** Red fill bar. Should tile or stretch horizontally. Gradient from dark red to bright red.

### 5.2 Cooldown Bar
- **File:** `assets/effects/ui/cooldown_bar.png`
- **Dimensions:** 200x15
- **Notes:** Background for ability cooldown. Dark gray/black with border.

### 5.3 Menu Assets

#### Menu Background
- **File:** `assets/ui/menu_background.png`
- **Dimensions:** 1920x1080 (or match game resolution)
- **Notes:** Main menu background. Can be static image or pattern. Dark, atmospheric.

#### Title Logo
- **File:** `assets/ui/title_logo.png`
- **Dimensions:** 512x128
- **Notes:** "GodDog" title text as pixel art logo. Should be prominent and readable.

#### Menu Buttons
- **File:** `assets/ui/button_idle.png`
- **Dimensions:** 200x50
- **Notes:** Default button state. Neutral appearance.

- **File:** `assets/ui/button_hover.png`
- **Dimensions:** 200x50
- **Notes:** Hovered/selected button. Brighter or highlighted.

- **File:** `assets/ui/button_pressed.png`
- **Dimensions:** 200x50
- **Notes:** Pressed button state. Darker or inset appearance.

---

## 6. TILE ASSETS

**Base Size:** 64x64 pixels per tile  
**Format:** PNG  
**Layout:** Can be single tiles or tile sets (grid)

### 6.1 Level 1 - The Crossing

#### Ground Tiles
- **File:** `assets/tiles/level1_crossing/ground.png`
- **Dimensions:** 64x64 (single tile) or larger tile set
- **Notes:** Basic ground texture. Can be dirt, stone, or grass. Should tile seamlessly.

#### Water Tiles (Animated)
- **File:** `assets/tiles/level1_crossing/water.png`
- **Dimensions:** 256x64 (4 frames × 64px) or 64x64 per frame
- **Frames:** 4
- **Notes:** Animated water. Subtle movement. Should loop smoothly.

#### Bridge Tiles
- **File:** `assets/tiles/level1_crossing/bridge.png`
- **Dimensions:** 64x64
- **Notes:** Bridge/platform tile. Should connect with ground tiles.

#### Obstacles
- **File:** `assets/tiles/level1_crossing/obstacles.png`
- **Dimensions:** Various (can be sprite sheet)
- **Notes:** Rocks, logs, or other obstacles. Various sizes.

### 6.2 Level 2 - Village of Bent Tails

#### Grass Tiles
- **File:** `assets/tiles/level2_village/grass.png`
- **Dimensions:** 64x64 or tile set
- **Notes:** Grass texture with variations for natural look.

#### Path Tiles
- **File:** `assets/tiles/level2_village/path.png`
- **Dimensions:** 64x64 or tile set
- **Notes:** Dirt/stone path. Should connect seamlessly.

#### Building Walls
- **File:** `assets/tiles/level2_village/building_wall.png`
- **Dimensions:** 64x64
- **Notes:** Wall texture for buildings. Should tile vertically and horizontally.

#### Building Roofs
- **File:** `assets/tiles/level2_village/building_roof.png`
- **Dimensions:** 64x64
- **Notes:** Roof tiles. Should tile horizontally.

#### Door
- **File:** `assets/tiles/level2_village/door.png`
- **Dimensions:** 32x64
- **Notes:** Door sprite. Taller than standard tile.

### 6.3 Level 3 - The Scented Warrens

#### Dirt Tiles
- **File:** `assets/tiles/level3_warrens/dirt.png`
- **Dimensions:** 64x64 or tile set
- **Notes:** Dark dirt/earth texture. Should feel underground.

#### Tunnel Walls
- **File:** `assets/tiles/level3_warrens/tunnel_wall.png`
- **Dimensions:** 64x64
- **Notes:** Cave/tunnel wall texture. Darker than surface.

#### Tunnel Ceiling
- **File:** `assets/tiles/level3_warrens/tunnel_ceiling.png`
- **Dimensions:** 64x64
- **Notes:** Ceiling texture. Can be darker or show roots.

#### Roots
- **File:** `assets/tiles/level3_warrens/roots.png`
- **Dimensions:** Various
- **Notes:** Root decorations. Various sizes for variety.

### 6.4 Level 4 - Trial of Divinity

#### Stone Floor
- **File:** `assets/tiles/level4_trial/stone_floor.png`
- **Dimensions:** 64x64 or tile set
- **Notes:** Carved stone floor. Should feel ancient/sacred.

#### Stone Walls
- **File:** `assets/tiles/level4_trial/stone_wall.png`
- **Dimensions:** 64x64
- **Notes:** Stone wall texture. Should tile well.

#### Altar
- **File:** `assets/tiles/level4_trial/altar.png`
- **Dimensions:** 128x128
- **Notes:** Large altar/prop. Centered piece.

### 6.5 Level 5 - The Broken Throne

#### Corrupted Ground
- **File:** `assets/tiles/level5_throne/corrupted_ground.png`
- **Dimensions:** 64x64 or tile set
- **Notes:** Dark, corrupted ground. Can have purple/red tints.

#### Throne
- **File:** `assets/tiles/level5_throne/throne.png`
- **Dimensions:** 128x192
- **Notes:** Large throne prop. Taller than wide.

#### Corruption Effect (Animated)
- **File:** `assets/tiles/level5_throne/corruption.png`
- **Dimensions:** 384x64 (6 frames × 64px)
- **Frames:** 6
- **Notes:** Animated corruption effect. Pulsing, dark energy.

---

## 7. OPTIONAL/ADDITIONAL ASSETS

### 7.1 Particle Effects (Programmatically Generated)
These are created by code, but you can provide sprite sheets:
- Hit sparks (16x16, 4 frames)
- Blood particles (16x16, 3 frames)
- Dust particles (16x16, 4 frames)
- Magic particles (16x16, 6 frames)

### 7.2 Boss Sprites (Future)
- Corrupted Watchdog (Level 1 boss)
- Pack Leader Zealot (Level 2 boss)
- Avatar of False Obedience (Level 4 boss)
- The Leashbearer (Level 5 boss)

**Recommended Size:** 128x128 or larger for bosses

---

## CREATION GUIDELINES

### Pixel Art Best Practices

1. **Consistency**
   - Use consistent pixel size (no anti-aliasing)
   - Maintain consistent light source (top-left)
   - Keep color count low (16-32 colors recommended)

2. **Animation Principles**
   - **Anticipation:** Brief wind-up before actions
   - **Follow-through:** Continue motion after impact
   - **Squash and Stretch:** Exaggerate for impact
   - **Clear Keyframes:** Make actions readable

3. **Technical Requirements**
   - Export as PNG with transparency
   - Use power-of-2 dimensions when possible
   - Keep file sizes reasonable (<500KB per sprite sheet)
   - Test at actual game resolution (64x64 for sprites)

4. **Color Guidelines**
   - Use dithering sparingly for gradients
   - Ensure good contrast for visibility
   - Maintain readable silhouettes
   - Use consistent palette across all assets

5. **Animation Timing**
   - Idle: 8-12 FPS (slow, subtle)
   - Walk: 12-16 FPS (smooth, readable)
   - Attack: 20-24 FPS (fast, impactful)
   - Death: 8-10 FPS (dramatic, clear)

### File Organization

```
assets/
├── sprites/
│   ├── player/          (8 files)
│   ├── enemies/
│   │   ├── basic/       (4 files)
│   │   ├── fast/        (4 files)
│   │   └── tank/        (4 files)
│   └── npcs/            (1 file)
├── effects/
│   ├── combat/          (1 file)
│   ├── god_abilities/   (1 file)
│   └── ui/              (3 files)
├── tiles/
│   ├── level1_crossing/ (4+ files)
│   ├── level2_village/  (5 files)
│   ├── level3_warrens/  (4 files)
│   ├── level4_trial/    (3 files)
│   └── level5_throne/   (3 files)
└── ui/                  (4 files)
```

### Priority Order for Creation

1. **High Priority** (Core gameplay):
   - Player sprites (all 8 animations)
   - Basic enemy sprites
   - Health bar UI
   - Basic ground tiles

2. **Medium Priority** (Enhanced gameplay):
   - Fast and Tank enemy sprites
   - Combat effects
   - Menu UI
   - Level-specific tiles

3. **Low Priority** (Polish):
   - Follower sprites
   - God ability effects
   - Advanced tile variations
   - Boss sprites

---

## TOTAL ASSET COUNT

- **Player Sprites:** 8 files
- **Enemy Sprites:** 12 files (4 per type × 3 types)
- **NPC/Follower Sprites:** 1 file
- **Effect Sprites:** 2 files
- **UI Assets:** 7 files
- **Tile Assets:** ~20+ files (varies by level detail)

**Total:** ~50+ individual asset files

---

## NOTES FOR ARTISTS

1. **Style Consistency:** All assets should feel like they belong to the same world
2. **Readability:** Sprites must be clear at game resolution (64x64)
3. **Performance:** Keep sprite sheets reasonable in size
4. **Modularity:** Tiles should tile seamlessly
5. **Animation Flow:** Ensure animations loop smoothly where needed
6. **Color Coding:** Use color to distinguish enemy types and game elements
7. **Silhouette:** Strong silhouettes help with gameplay clarity

This specification provides everything needed to create production-ready assets for GodDog!

