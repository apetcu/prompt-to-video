# Prompt to Video

A visually stunning 10-second video demonstrating how you can generate videos from text prompts, built with Remotion.

## Features

This video showcases advanced animation techniques inspired by GitHub Unwrapped:

- **Particle burst effects** - Explosive transformation animations
- **Animated gradients** - Dynamic, rotating gradient backgrounds
- **Spring physics** - Natural, bouncy entrance animations
- **Glow orbs** - Layered ambient lighting effects
- **Shine borders** - Rotating gradient borders for emphasis
- **Multi-scene composition** - Smooth transitions between three scenes:
  1. "Type a prompt" with blinking cursor
  2. Transformation burst effect
  3. Final video reveal with 3D rotation

## Getting Started

### Development

Start the Remotion Studio to preview and edit the video:

```bash
npm start
```

This will open the Remotion Studio in your browser where you can:
- Preview the video in real-time
- Scrub through the timeline
- Adjust composition settings
- See your changes instantly

### Rendering

Render the final video to a file:

```bash
npm run build -- PromptToVideo --output=output.mp4
```

Optional rendering parameters:
```bash
# Render specific frame range
npm run build -- PromptToVideo --output=output.mp4 --frames=0-299

# Render with different quality
npm run build -- PromptToVideo --output=output.mp4 --quality=100

# Render as image sequence
npm run build -- PromptToVideo --output=output --sequence
```

## Project Structure

```
src/
├── Root.tsx           # Remotion composition registration
└── PromptToVideo.tsx  # Main video component with animations

remotion.config.ts     # Remotion configuration
tsconfig.json          # TypeScript configuration
package.json           # Dependencies and scripts
```

## Video Specifications

- **Duration**: 10 seconds (300 frames)
- **Frame rate**: 30 fps
- **Resolution**: 1920x1080 (Full HD)

## Technologies

- [Remotion](https://remotion.dev) - React-based video creation framework
- React - UI component library
- TypeScript - Type-safe JavaScript
- Spring animations for natural motion
- Gradient and particle effects

## Customization

Edit `src/PromptToVideo.tsx` to customize:
- Text content and messaging
- Colors and gradients
- Animation timing and easing
- Particle effects and glow orbs
- Scene transitions

The video uses spring physics and interpolation functions to create smooth, professional animations.
