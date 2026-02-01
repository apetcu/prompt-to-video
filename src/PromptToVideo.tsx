import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing
} from "remotion";

// SVG Icon Components
const ClockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ChartIcon: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const MailIcon: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LightningIcon: React.FC<{ size?: number; color?: string }> = ({ size = 80, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const CheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const TrendingIcon: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const TargetIcon: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

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
  const gradientRotation = interpolate(frame, [0, 540], [0, 360]);
  const hue1 = interpolate(frame, [0, 540], [120, 160]); // Green hues
  const hue2 = interpolate(frame, [0, 540], [100, 140]); // Green hues

  // Scene 1: "Type a Prompt" (frames 0-75) - Extended +15 frames
  const scene1Opacity = interpolate(frame, [0, 25], [0, 1]);
  const scene1Exit = interpolate(frame, [60, 75], [1, 0]);
  const scene1FinalOpacity = Math.min(scene1Opacity, scene1Exit);

  const promptSpring = spring({
    frame: frame - 15,
    fps,
    config: {
      damping: 120,
      mass: 0.6,
    },
  });

  const promptScale = interpolate(promptSpring, [0, 1], [0.5, 1]);

  // Typing cursor blink
  const cursorBlink = Math.floor(frame / 15) % 2;

  // Scene 2: Problem Statement (frames 75-150) - Extended +15 frames
  const scene2Opacity = interpolate(frame, [70, 95], [0, 1]);
  const scene2Exit = interpolate(frame, [135, 150], [1, 0]);
  const scene2FinalOpacity = Math.min(scene2Opacity, scene2Exit);

  const problemSpring = spring({
    frame: frame - 80,
    fps,
    config: {
      damping: 50,
      stiffness: 100,
    },
  });

  const problemSlideX = interpolate(problemSpring, [0, 1], [-200, 0], {
    easing: Easing.out(Easing.ease),
  });

  // Scene 3: Transformation effect (frames 150-225) - Extended +15 frames
  const scene3Opacity = interpolate(frame, [145, 170], [0, 1]);
  const scene3Exit = interpolate(frame, [210, 225], [1, 0]);
  const scene3FinalOpacity = Math.min(scene3Opacity, scene3Exit);

  const burstFrame = 160;
  const showBurst = frame >= burstFrame && frame < burstFrame + 60;

  const lightningRotate = interpolate(frame, [145, 170], [360, 0], {
    easing: Easing.out(Easing.back(1.5)),
  });

  const lightningScale = spring({
    frame: frame - 150,
    fps,
    config: {
      damping: 30,
      stiffness: 200,
      mass: 0.5,
    },
  });

  // Scene 4: Feature breakdown (frames 225-330) - Extended +15 frames
  const scene4Opacity = interpolate(frame, [220, 245], [0, 1]);
  const scene4Exit = interpolate(frame, [315, 330], [1, 0]);
  const scene4FinalOpacity = Math.min(scene4Opacity, scene4Exit);

  const featureSpring = spring({
    frame: frame - 230,
    fps,
    config: {
      damping: 40,
      stiffness: 80,
    },
  });

  const featureSlideX = interpolate(featureSpring, [0, 1], [200, 0], {
    easing: Easing.out(Easing.ease),
  });

  // Stagger animations for feature items - slide in from right individually
  const feature1Spring = spring({
    frame: frame - 240,
    fps,
    config: { damping: 50, stiffness: 100 },
  });
  const feature1SlideX = interpolate(feature1Spring, [0, 1], [100, 0]);
  const feature1Opacity = interpolate(frame, [240, 260], [0, 1]);

  const feature2Spring = spring({
    frame: frame - 260,
    fps,
    config: { damping: 50, stiffness: 100 },
  });
  const feature2SlideX = interpolate(feature2Spring, [0, 1], [100, 0]);
  const feature2Opacity = interpolate(frame, [260, 280], [0, 1]);

  const feature3Spring = spring({
    frame: frame - 280,
    fps,
    config: { damping: 50, stiffness: 100 },
  });
  const feature3SlideX = interpolate(feature3Spring, [0, 1], [100, 0]);
  const feature3Opacity = interpolate(frame, [280, 300], [0, 1]);

  // Scene 5: Benefits (frames 330-435) - Extended +15 frames
  const scene5Opacity = interpolate(frame, [325, 350], [0, 1]);
  const scene5Exit = interpolate(frame, [420, 435], [1, 0]);
  const scene5FinalOpacity = Math.min(scene5Opacity, scene5Exit);

  const benefitSpring = spring({
    frame: frame - 335,
    fps,
    config: {
      damping: 15,
      stiffness: 200,
      mass: 1,
    },
  });

  const benefitScale = interpolate(benefitSpring, [0, 1], [0, 1]);

  // Add subtle bounce to the percentage
  const percentBounce = spring({
    frame: frame - 350,
    fps,
    config: {
      damping: 10,
      stiffness: 300,
    },
  });

  const percentScale = interpolate(percentBounce, [0, 1], [0.5, 1]);

  // Scene 6: Final reveal (frames 435-540) - Extended +15 frames
  const scene6Opacity = interpolate(frame, [430, 460], [0, 1]);

  const videoSpring = spring({
    frame: frame - 435,
    fps,
    config: {
      damping: 60,
      mass: 1.2,
      stiffness: 100,
    },
  });

  const videoScale = interpolate(videoSpring, [0, 1], [0.2, 1], {
    easing: Easing.out(Easing.back(1.2)),
  });
  const videoRotateY = interpolate(videoSpring, [0, 1], [360, 0], {
    easing: Easing.out(Easing.ease),
  });

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
      <GlowOrb x={width * 0.2} y={height * 0.3} size={300} color="#10b981" delay={0} />
      <GlowOrb x={width * 0.8} y={height * 0.7} size={350} color="#34d399" delay={15} />
      <GlowOrb x={width * 0.5} y={height * 0.5} size={400} color="#059669" delay={30} />

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
              fontSize: 52,
              color: "rgba(255, 255, 255, 0.8)",
              marginBottom: 30,
              fontWeight: "400",
            }}
          >
            Scrum Master Daily Tasks
          </div>
          <div
            style={{
              fontSize: 70,
              fontWeight: "bold",
              color: "white",
              padding: "25px 50px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
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

      {/* Scene 2: Problem Statement */}
      <AbsoluteFill
        style={{
          opacity: scene2FinalOpacity,
          justifyContent: "center",
          alignItems: "center",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            transform: `translateX(${problemSlideX}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontWeight: "800",
              color: "#34d399",
              marginBottom: 40,
            }}
          >
            The Challenge
          </div>
          <div
            style={{
              fontSize: 36,
              color: "rgba(255, 255, 255, 0.9)",
              lineHeight: 1.8,
              fontWeight: "400",
              background: "rgba(255, 255, 255, 0.08)",
              padding: "40px 50px",
              borderRadius: "20px",
              backdropFilter: "blur(20px)",
              border: "2px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            Manual sprint review prep takes hours
            <br />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px", marginTop: "25px" }}>
              <ClockIcon size={36} color="#34d399" />
              <span>Gathering updates from team</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px", marginTop: "20px" }}>
              <ChartIcon size={36} color="#34d399" />
              <span>Compiling progress reports</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px", marginTop: "20px" }}>
              <MailIcon size={36} color="#34d399" />
              <span>Coordinating stakeholders</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Scene 3: Transformation burst */}
      <AbsoluteFill
        style={{
          opacity: scene3FinalOpacity,
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
            display: "flex",
            alignItems: "center",
            gap: "30px",
            transform: `scale(${lightningScale}) rotate(${lightningRotate}deg)`,
          }}
        >
          <LightningIcon size={90} color="#10b981" />
          <div
            style={{
              fontSize: 110,
              fontWeight: "900",
              background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #34d399 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 80px rgba(16, 185, 129, 0.8)",
            }}
          >
            AUTOMATE
          </div>
          <LightningIcon size={90} color="#10b981" />
        </div>
      </AbsoluteFill>

      {/* Scene 4: Feature Breakdown */}
      <AbsoluteFill
        style={{
          opacity: scene4FinalOpacity,
          justifyContent: "center",
          alignItems: "center",
          padding: "0 60px",
        }}
      >
        <div
          style={{
            transform: `translateX(${featureSlideX}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: "800",
              background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 50,
            }}
          >
            Automation Features
          </div>
          <div style={{ textAlign: "left", maxWidth: "900px" }}>
            <div
              style={{
                opacity: feature1Opacity,
                transform: `translateX(${feature1SlideX}px)`,
                fontSize: 34,
                color: "white",
                marginBottom: 30,
                padding: "20px 30px",
                background: "rgba(16, 185, 129, 0.15)",
                borderRadius: "16px",
                border: "2px solid rgba(16, 185, 129, 0.3)",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <CheckIcon size={36} color="#10b981" />
              <span>Auto-collect team updates</span>
            </div>
            <div
              style={{
                opacity: feature2Opacity,
                transform: `translateX(${feature2SlideX}px)`,
                fontSize: 34,
                color: "white",
                marginBottom: 30,
                padding: "20px 30px",
                background: "rgba(16, 185, 129, 0.15)",
                borderRadius: "16px",
                border: "2px solid rgba(16, 185, 129, 0.3)",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <TrendingIcon size={36} color="#10b981" />
              <span>Generate progress metrics</span>
            </div>
            <div
              style={{
                opacity: feature3Opacity,
                transform: `translateX(${feature3SlideX}px)`,
                fontSize: 34,
                color: "white",
                padding: "20px 30px",
                background: "rgba(16, 185, 129, 0.15)",
                borderRadius: "16px",
                border: "2px solid rgba(16, 185, 129, 0.3)",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <TargetIcon size={36} color="#10b981" />
              <span>Smart stakeholder alerts</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Scene 5: Benefits */}
      <AbsoluteFill
        style={{
          opacity: scene5FinalOpacity,
          justifyContent: "center",
          alignItems: "center",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            transform: `scale(${benefitScale})`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: "900",
              background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 50,
            }}
          >
            The Result
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: "900",
              color: "#10b981",
              marginBottom: 30,
              transform: `scale(${percentScale})`,
            }}
          >
            80% Time Saved
          </div>
          <div
            style={{
              fontSize: 38,
              color: "rgba(255, 255, 255, 0.9)",
              lineHeight: 1.5,
              fontWeight: "400",
            }}
          >
            From hours of prep
            <br />
            to minutes of review
          </div>
        </div>
      </AbsoluteFill>

      {/* Scene 6: Final reveal */}
      <AbsoluteFill
        style={{
          opacity: scene6Opacity,
          justifyContent: "center",
          alignItems: "center",
          perspective: "1000px",
        }}
      >
        <div
          style={{
            transform: `scale(${videoScale}) rotateY(${videoRotateY}deg)`,
            position: "relative",
            transformStyle: "preserve-3d",
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
              padding: "50px 60px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "24px",
              backdropFilter: "blur(40px)",
              border: "3px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 30px 90px rgba(0, 0, 0, 0.4)",
            }}
          >
            <div
              style={{
                fontSize: 80,
                fontWeight: "900",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: 25,
                textAlign: "center",
              }}
            >
              AUTOMATED
            </div>
            <div
              style={{
                fontSize: 44,
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
              marginTop: 50,
              fontSize: 38,
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
