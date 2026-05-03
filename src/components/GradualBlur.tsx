import React, { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import "./GradualBlur.css";

type Position = "top" | "bottom" | "left" | "right";
type Curve = "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";

interface GradualBlurProps {
  position?: Position;
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  zIndex?: number;
  animated?: boolean | "scroll";
  duration?: string;
  easing?: string;
  opacity?: number;
  curve?: Curve;
  responsive?: boolean;
  target?: "parent" | "page";
  className?: string;
  style?: CSSProperties;
  preset?: keyof typeof PRESETS;
  hoverIntensity?: number;
  onAnimationComplete?: () => void;
}

const DEFAULT_CONFIG: Required<Omit<GradualBlurProps, "preset" | "hoverIntensity" | "onAnimationComplete" | "width">> & { width?: string } = {
  position: "bottom",
  strength: 2,
  height: "6rem",
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false,
  duration: "0.3s",
  easing: "ease-out",
  opacity: 1,
  curve: "linear",
  responsive: false,
  target: "parent",
  className: "",
  style: {},
};

const PRESETS = {
  top: { position: "top" as Position, height: "6rem" },
  bottom: { position: "bottom" as Position, height: "6rem" },
  subtle: { height: "4rem", strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: "10rem", strength: 4, divCount: 8, exponential: true },
  smooth: { height: "8rem", curve: "bezier" as Curve, divCount: 10 },
  "page-header": { position: "top" as Position, height: "10rem", target: "page" as const, strength: 3 },
  "page-footer": { position: "bottom" as Position, height: "10rem", target: "page" as const, strength: 3 },
};

const CURVE_FUNCTIONS: Record<Curve, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

const getGradientDirection = (position: Position) =>
  ({ top: "to top", bottom: "to bottom", left: "to left", right: "to right" }[position]);

const GradualBlur: React.FC<GradualBlurProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const config = useMemo(() => {
    const presetConfig = (props.preset && PRESETS[props.preset]) || {};
    return { ...DEFAULT_CONFIG, ...presetConfig, ...props } as typeof DEFAULT_CONFIG & GradualBlurProps;
  }, [props]);

  const [isVisible, setIsVisible] = useState(config.animated !== "scroll");
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    if (config.animated !== "scroll" || !containerRef.current) return;
    const obs = new IntersectionObserver(([e]) => setIsVisible(e.isIntersecting), { threshold: 0.1 });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [config.animated]);

  // Detect scroll to bottom for page-footer preset
  useEffect(() => {
    if (config.preset !== "page-footer" || config.position !== "bottom") return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const threshold = 50; // pixels from bottom
      
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - threshold);
    };

    handleScroll(); // Check initial state
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [config.preset, config.position]);

  const blurDivs = useMemo(() => {
    const divs: JSX.Element[] = [];
    const increment = 100 / config.divCount;
    const currentStrength =
      isHovered && config.hoverIntensity ? config.strength * config.hoverIntensity : config.strength;
    const curveFunc = CURVE_FUNCTIONS[config.curve] || CURVE_FUNCTIONS.linear;

    for (let i = 1; i <= config.divCount; i++) {
      const progress = curveFunc(i / config.divCount);
      const blurValue = config.exponential
        ? Math.pow(2, progress * 4) * 0.0625 * currentStrength
        : 0.0625 * (progress * config.divCount + 1) * currentStrength;

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const direction = getGradientDirection(config.position);
      divs.push(
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            maskImage: `linear-gradient(${direction}, ${gradient})`,
            WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
            backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            opacity: config.opacity,
          }}
        />
      );
    }
    return divs;
  }, [config, isHovered]);

  const containerStyle = useMemo<CSSProperties>(() => {
    const isVertical = ["top", "bottom"].includes(config.position);
    const isPageTarget = config.target === "page";
    const shouldHide = isAtBottom && config.preset === "page-footer";
    const base: CSSProperties = {
      position: isPageTarget ? "fixed" : "absolute",
      pointerEvents: config.hoverIntensity ? "auto" : "none",
      opacity: shouldHide ? 0 : (isVisible ? 1 : 0),
      transition: config.animated ? `opacity ${config.duration} ${config.easing}` : "opacity 0.3s ease-out",
      zIndex: isPageTarget ? config.zIndex + 100 : config.zIndex,
      ...config.style,
    };
    if (isVertical) {
      base.height = config.height;
      base.width = config.width || "100%";
      (base as Record<string, unknown>)[config.position] = 0;
      base.left = 0;
      base.right = 0;
    } else {
      base.width = config.width || config.height;
      base.height = "100%";
      (base as Record<string, unknown>)[config.position] = 0;
      base.top = 0;
      base.bottom = 0;
    }
    return base;
  }, [config, isVisible, isAtBottom]);

  return (
    <div
      ref={containerRef}
      className={`gradual-blur ${config.target === "page" ? "gradual-blur-page" : "gradual-blur-parent"} ${config.className}`}
      style={containerStyle}
      onMouseEnter={config.hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={config.hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div className="gradual-blur-inner" style={{ position: "relative", width: "100%", height: "100%" }}>
        {blurDivs}
      </div>
    </div>
  );
};

export default React.memo(GradualBlur);
