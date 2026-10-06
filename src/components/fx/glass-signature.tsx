"use client";

import {
  Environment,
  Float,
  Lightformer,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Component, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { SignatureMark } from "@/components/ui/signature-mark";
import { usePrefersReducedMotion } from "@/lib/use-media";

/*
 * The brand's own glyph, the signature wave, cast in glass: a tube along
 * the wordmark's curve with the three dots of the pen lifting off, lit by
 * a studio of soft panels so the aurora behind it refracts through. It
 * turns slowly on its own and leans toward the pointer wherever it is on
 * the page. Nothing is fetched: the environment is rendered, not loaded.
 */

/* The wave's four cubic Béziers, in the wordmark's own coordinates. */
const SEGMENTS: [number, number][][] = [
  [
    [40, 65],
    [55, 30],
    [75, 30],
    [85, 55],
  ],
  [
    [85, 55],
    [95, 80],
    [110, 80],
    [120, 55],
  ],
  [
    [120, 55],
    [130, 30],
    [145, 25],
    [155, 50],
  ],
  [
    [155, 50],
    [162, 65],
    [168, 60],
    [172, 52],
  ],
];
const DOTS: [number, number, number][] = [
  [178, 47, 0.19],
  [186, 43, 0.145],
  [192, 41, 0.105],
];
/* The glyph's centre and the scale that fits it in the camera's view. */
const CX = 118;
const CY = 52;
const UNIT = 30;

const toScene = (x: number, y: number) =>
  new THREE.Vector3((x - CX) / UNIT, -(y - CY) / UNIT, 0);

function bezier(
  [p0, p1, p2, p3]: [number, number][],
  t: number,
): [number, number] {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
  ];
}

function detectWebGL() {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function GlassSignature() {
  const reduce = usePrefersReducedMotion();
  /* Only draw where WebGL exists; elsewhere the flat mark stands in. This
     component never renders on the server, so the check can run at once. */
  const [able] = useState(detectWebGL);

  if (!able) return <FlatMark />;

  return (
    <Boundary fallback={<FlatMark />}>
      <div aria-hidden className="absolute inset-0">
        {/* The light the object stands in. */}
        <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgb(138_151_240/0.28),transparent)] blur-3xl" />
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 9], fov: 34 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          frameloop={reduce ? "demand" : "always"}
          style={{ background: "transparent" }}
        >
          <Backlight />
          <Studio />
          <Rig still={reduce}>
            <Float
              speed={reduce ? 0 : 1.1}
              rotationIntensity={0.3}
              floatIntensity={0.7}
              floatingRange={[-0.12, 0.12]}
            >
              <Glyph still={reduce} />
            </Float>
          </Rig>
        </Canvas>
      </div>
    </Boundary>
  );
}

/** The wave as a glass tube, with the three dots as glass beads. */
function Glyph({ still }: { still: boolean }) {
  const group = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (const seg of SEGMENTS) {
      for (let i = 0; i < 28; i++) {
        const [x, y] = bezier(seg, i / 28);
        points.push(toScene(x, y));
      }
    }
    const [lx, ly] = SEGMENTS[SEGMENTS.length - 1][3];
    points.push(toScene(lx, ly));
    const curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
    const tube = new THREE.TubeGeometry(curve, 220, 0.27, 32, false);
    const beads = DOTS.map(([x, y, r]) => {
      const at = toScene(x, y);
      return new THREE.SphereGeometry(r, 32, 32).translate(at.x, at.y, 0);
    });
    /* One mesh, one material: the glass renders the scene behind it once
       per material, so the beads join the tube instead of each paying for
       their own pass. */
    const merged = mergeGeometries([tube, ...beads]);
    for (const b of beads) b.dispose();
    if (!merged) return tube;
    tube.dispose();
    return merged;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    if (!group.current || still) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.28) * 0.42;
    group.current.rotation.z = Math.sin(t * 0.21) * 0.06;
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <Glass />
      </mesh>
    </group>
  );
}

/**
 * Indigo glass. The material refracts what it renders behind itself, and
 * the canvas is clear, so without a floor colour it would refract black
 * and read as rubber; the floor is the page's indigo wash, lifted, and
 * only ever seen through the glass.
 */
function Glass() {
  const floor = useMemo(() => new THREE.Color("#3a4490"), []);
  return (
    <MeshTransmissionMaterial
      background={floor}
      samples={6}
      resolution={384}
      thickness={0.55}
      roughness={0.08}
      ior={1.4}
      chromaticAberration={0.06}
      anisotropicBlur={0.2}
      distortion={0.14}
      distortionScale={0.4}
      temporalDistortion={0.08}
      color="#dde2ff"
      attenuationColor="#9aa6ff"
      attenuationDistance={3}
      envMapIntensity={1.6}
      clearcoat={1}
      clearcoatRoughness={0.12}
    />
  );
}

/**
 * Light behind the glass for it to refract: pools of the page's own
 * colours, painted once into a texture and hung well behind the glyph.
 * Where the texture is clear, the page shows through as before.
 */
function Backlight() {
  const texture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const g = canvas.getContext("2d");
    if (!g) return null;
    const pool = (x: number, y: number, r: number, color: string) => {
      const grad = g.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, color);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, size, size);
    };
    pool(180, 210, 260, "rgba(56,75,199,0.95)");
    pool(360, 300, 240, "rgba(107,92,231,0.85)");
    pool(270, 120, 200, "rgba(127,176,255,0.65)");
    pool(300, 400, 180, "rgba(255,200,160,0.4)");
    /* Fade to nothing well inside the edges, so the plane never shows. */
    const edge = g.createRadialGradient(256, 256, 40, 256, 256, 215);
    edge.addColorStop(0, "rgba(0,0,0,1)");
    edge.addColorStop(0.55, "rgba(0,0,0,0.75)");
    edge.addColorStop(1, "rgba(0,0,0,0)");
    g.globalCompositeOperation = "destination-in";
    g.fillStyle = edge;
    g.fillRect(0, 0, size, size);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  useEffect(() => () => texture?.dispose(), [texture]);

  if (!texture) return null;
  return (
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[10, 8]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

/** Leans the whole object toward the pointer, wherever it is on the page. */
function Rig({
  children,
  still,
}: {
  children: React.ReactNode;
  still: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (still) return;
    const onMove = (e: PointerEvent) => {
      target.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [still]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const { x, y } = target.current;
    ref.current.rotation.y = THREE.MathUtils.damp(
      ref.current.rotation.y,
      x * 0.38,
      3.5,
      delta,
    );
    ref.current.rotation.x = THREE.MathUtils.damp(
      ref.current.rotation.x,
      y * 0.22,
      3.5,
      delta,
    );
  });

  return <group ref={ref}>{children}</group>;
}

/** A small studio of soft panels: the only light the glass ever sees. */
function Studio() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} color="#eef0ff" />
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={4}
          color="#e4e8ff"
          position={[0, 4, 3]}
          scale={[8, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#8a97f0"
          position={[-5, -1, 2]}
          scale={[3, 6, 1]}
        />
        <Lightformer
          form="circle"
          intensity={2.6}
          color="#7fb0ff"
          position={[5, 2, -3]}
          scale={3}
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          color="#ffd9b8"
          position={[3, -4, 2]}
          scale={[4, 2, 1]}
        />
      </Environment>
    </>
  );
}

/** The mark drawn flat, for browsers and machines without WebGL. */
function FlatMark() {
  return (
    <div aria-hidden className="absolute inset-0 grid place-items-center">
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgb(138_151_240/0.22),transparent)] blur-3xl" />
      <SignatureMark size={360} strokeWidth={6} draw className="text-indigo" />
    </div>
  );
}

/** If the renderer fails for any reason, the flat mark stands in. */
class Boundary extends Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
