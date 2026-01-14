# GodDog MVP

A top-down action roguelite web game where players control a dog channeling divine powers.

## Features

- **5 Levels**: Each with unique challenges and boss encounters
- **3 Playable Gods**: 
  - The Loyal One (Tank/Defense)
  - The Swift One (Speed/Mobility)
  - The All-Nose (Detection/Debuff)
- **Combat System**: Fast-paced action with combo attacks and dodging
- **Base Hub**: "The Kennel of Balance" - upgrade and prepare between levels
- **Follower System**: Rescue dogs and build your following

## Controls

- **WASD / Arrow Keys**: Move
- **Space / Left Click**: Attack
- **Shift**: Dodge/Roll
- **Q**: Use God Ability
- **E**: Interact (in base)
- **Enter**: Confirm/Select

## Development

### Setup

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

## Tech Stack

- HTML5 Canvas 2D
- JavaScript (ES6+)
- Vite
- Howler.js (for audio)

## Project Structure

```
GodDog/
├── src/
│   ├── core/           # Game engine core
│   ├── entities/       # Game entities (player, enemies, NPCs)
│   ├── gods/           # God system and abilities
│   ├── levels/         # Level definitions
│   ├── base/           # Hub/base systems
│   ├── ui/             # UI components
│   ├── utils/          # Utilities
│   └── states/         # Game states
├── assets/              # Game assets
└── public/              # Public files
```

## MVP Status

This is an MVP implementation with placeholder graphics and basic systems. All core gameplay systems are functional.

