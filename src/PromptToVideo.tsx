import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing
} from "remotion";

// Particle component for burst effect
const Particle: React.FC<{
  x: number;
  y: number;
  delay: number;
  color: string;
  angle: number;
}> = ({ x, y, delay, color, angle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const particleProgress = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 100,
      mass: 0.5,
    },
  });

  const distance = interpolate(particleProgress, [0, 1], [0, 300]);
  const opacity = interpolate(particleProgress, [0, 0.5, 1], [0, 1, 0]);
  const scale = interpolate(particleProgress, [0, 1], [0, 1]);

  const offsetX = Math.cos(angle) * distance;
  const offsetY = Math.sin(angle) * distance;

  return (
    <div
      style={{
        position: "absolute",
        left: x + offsetX,
        top: y + offsetY,
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: color,
        opacity,
        transform: `scale(${scale})`,
        filter: "blur(2px)",
      }}
    />
  );
};

// Glow effect component
const GlowOrb: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}> = ({ x, y, size, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glowSpring = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 200,
    },
  });

  const scale = interpolate(glowSpring, [0, 1], [0, 1]);
  const opacity = interpolate(glowSpring, [0, 1], [0, 0.6]);

  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        opacity,
        transform: `scale(${scale})`,
        filter: `blur(${size / 3}px)`,
      }}
    />
  );
};

export const PromptToVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Green gradient background (as specified in requirements)
  const gradientRotation = interpolate(frame, [0, 300], [0, 360]);
  const hue1 = interpolate(frame, [0, 300], [120, 160]); // Green hues
  const hue2 = interpolate(frame, [0, 300], [100, 140]); // Green hues

  // Scene 1: "Type a Prompt" (frames 0-90)
  const scene1Opacity = interpolate(frame, [0, 20], [0, 1]);
  const scene1Exit = interpolate(frame, [70, 90], [1, 0]);
  const scene1FinalOpacity = Math.min(scene1Opacity, scene1Exit);

  const promptSpring = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 100,
      mass: 0.5,
    },
  });

  const promptScale = interpolate(promptSpring, [0, 1], [0.5, 1]);

  // Typing cursor blink
  const cursorBlink = Math.floor(frame / 15) % 2;

  // Scene 2: Transformation effect (frames 90-150)
  const scene2Opacity = interpolate(frame, [85, 105], [0, 1]);
  const scene2Exit = interpolate(frame, [140, 160], [1, 0]);
  const scene2FinalOpacity = Math.min(scene2Opacity, scene2Exit);

  const burstFrame = 95;
  const showBurst = frame >= burstFrame && frame < burstFrame + 60;

  // Scene 3: Final reveal (frames 160-300)
  const scene3Opacity = interpolate(frame, [150, 180], [0, 1]);

  const videoSpring = spring({
    frame: frame - 160,
    fps,
    config: {
      damping: 80,
      mass: 0.8,
    },
  });

  const videoScale = interpolate(videoSpring, [0, 1], [0.3, 1]);
  const videoRotate = interpolate(videoSpring, [0, 1], [180, 0]);

  // Shine effect rotation
  const shineRotation = (frame * 2) % 360;

  // Generate particles for burst
  const particles = Array.from({ length: 24 }, (_, i) => ({
    angle: (i / 24) * Math.PI * 2,
    color: `hsl(${(i / 24) * 360}, 80%, 60%)`,
  }));

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientRotation}deg, hsl(${hue1}, 60%, 15%), hsl(${hue2}, 70%, 25%))`,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow orbs - green theme */}
      <GlowOrb x={width * 0.2} y={height * 0.3} size={400} color="#10b981" delay={0} />
      <GlowOrb x={width * 0.8} y={height * 0.7} size={500} color="#34d399" delay={15} />
      <GlowOrb x={width * 0.5} y={height * 0.5} size={600} color="#059669" delay={30} />

      {/* Scene 1: Type a prompt */}
      <AbsoluteFill
        style={{
          opacity: scene1FinalOpacity,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${promptScale})`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 72,
              color: "rgba(255, 255, 255, 0.8)",
              marginBottom: 40,
              fontWeight: "400",
            }}
          >
            Scrum Master Daily Tasks
          </div>
          <div
            style={{
              fontSize: 90,
              fontWeight: "bold",
              color: "white",
              padding: "30px 60px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              backdropFilter: "blur(20px)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            "Sprint Review Prep"
            <span style={{ opacity: cursorBlink }}>|</span>
          </div>
        </div>
      </AbsoluteFill>

      {/* Scene 2: Transformation burst */}
      <AbsoluteFill
        style={{
          opacity: scene2FinalOpacity,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {showBurst && (
          <>
            {particles.map((particle, i) => (
              <Particle
                key={i}
                x={width / 2}
                y={height / 2}
                delay={burstFrame + i * 1.5}
                color={particle.color}
                angle={particle.angle}
              />
            ))}
          </>
        )}
        <div
          style={{
            fontSize: 140,
            fontWeight: "900",
            background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #34d399 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 0 80px rgba(16, 185, 129, 0.8)",
          }}
        >
          ⚡ AUTOMATE ⚡
        </div>
      </AbsoluteFill>

      {/* Scene 3: Video result */}
      <AbsoluteFill
        style={{
          opacity: scene3Opacity,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${videoScale}) rotate(${videoRotate}deg)`,
            position: "relative",
          }}
        >
          {/* Animated shine border */}
          <div
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: "32px",
              background: `conic-gradient(from ${shineRotation}deg, transparent 0deg, rgba(255, 255, 255, 0.4) 20deg, transparent 40deg, transparent)`,
              opacity: 0.6,
            }}
          />

          {/* Video frame */}
          <div
            style={{
              position: "relative",
              padding: "60px 80px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "24px",
              backdropFilter: "blur(40px)",
              border: "3px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 30px 90px rgba(0, 0, 0, 0.4)",
            }}
          >
            <div
              style={{
                fontSize: 100,
                fontWeight: "900",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: 30,
                textAlign: "center",
              }}
            >
              AUTOMATED
            </div>
            <div
              style={{
                fontSize: 56,
                color: "rgba(255, 255, 255, 0.9)",
                textAlign: "center",
                fontWeight: "400",
                lineHeight: 1.4,
              }}
            >
              Sprint Review Workflow
            </div>
          </div>

          {/* Bottom tagline */}
          <div
            style={{
              marginTop: 60,
              fontSize: 48,
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.8)",
              fontWeight: "500",
            }}
          >
            Clear Feedback. Visible Decisions.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
