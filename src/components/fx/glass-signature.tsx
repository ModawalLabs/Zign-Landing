"use client";

import { MeshTransmissionMaterial } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { usePrefersReducedMotion } from "@/lib/use-media";
import { cn } from "@/lib/utils";

/*
 * The brand's own glyph, the signature wave, cast in glass: a tube along
 * the wordmark's curve with the three dots of the pen lifting off, lit by
 * a studio of soft panels so the aurora behind it refracts through. It
 * turns slowly on its own and leans toward the pointer wherever it is on
 * the page. Nothing is fetched: the environment is rendered, not loaded.
 *
 * The page shows a still of this scene from its first frame (the hero's
 * poster, rendered from this very scene at rest). This component brings
 * it to life, and says when its first frame is drawn so the two can trade
 * places. Its first frame is the poster's pose: every motion below is zero
 * at the start and eases in, so the swap cannot be seen.
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

/** 0 at the start, 1 after a couple of seconds, easing in and out. */
function wakeUp(t: number) {
  const x = Math.min(1, t / 2.5);
  return x * x * (3 - 2 * x);
}

function detectWebGL() {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    /* Hand the test context straight back: browsers allow only a few. */
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

export function GlassSignature({ onReady }: { onReady: () => void }) {
  const reduce = usePrefersReducedMotion();
  /* Only draw where WebGL exists; elsewhere the poster simply stays. This
     component never renders on the server, so the check can run at once. */
  const [able] = useState(detectWebGL);
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [shown, setShown] = useState(false);

  /* Rendering stops while the hero is off screen: the transmission pass
     is the costliest thing on the page, and no one is looking at it. */
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!able) return null;

  return (
    <Boundary>
      <div
        ref={wrap}
        aria-hidden
        className={cn(
          "absolute inset-0 transition-opacity duration-700 ease-(--ease-settle)",
          shown ? "opacity-100" : "opacity-0",
        )}
      >
        <Canvas
          dpr={[1, 1.5]}
          /* Measure the box's layout size, not its on-screen size: the
             hero's entrance scales the box, and a canvas sized mid-scale
             would stay a few percent off the poster it replaces. */
          resize={{ offsetSize: true }}
          camera={{ position: [0, 0, 9], fov: 34 }}
          gl={(defaults) => {
            const renderer = new THREE.WebGLRenderer({
              ...defaults,
              alpha: true,
              antialias: true,
              powerPreference: "high-performance",
            });
            /* Checking each shader's compile status makes the page wait
               for the GPU to finish compiling it. The shaders here are
               fixed and known good, so the page does not wait. */
            renderer.debug.checkShaderErrors = false;
            return renderer;
          }}
          frameloop={reduce || !visible ? "demand" : "always"}
          style={{ background: "transparent" }}
        >
          <Ready
            onReady={() => {
              setShown(true);
              onReady();
            }}
          />
          <Studio />
          <Rig still={reduce}>
            <Glyph still={reduce} />
          </Rig>
        </Canvas>
      </div>
    </Boundary>
  );
}

/** The wave as a glass tube, with the three dots as glass beads. */
function Glyph({ still }: { still: boolean }) {
  const group = useRef<THREE.Group>(null);
  const invalidate = useThree((s) => s.invalidate);

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

  /* Holding still draws one more frame, at rest. */
  useEffect(() => invalidate(), [still, invalidate]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    if (still) {
      g.rotation.set(0, 0, 0);
      g.position.y = 0;
      return;
    }
    const t = state.clock.elapsedTime;
    const k = wakeUp(t);
    g.rotation.y = Math.sin(t * 0.28) * 0.42 * k;
    g.rotation.x = Math.sin(t * 0.27) * 0.04 * k;
    g.rotation.z = Math.sin(t * 0.21) * 0.06 * k;
    g.position.y = Math.sin(t * 0.36) * 0.09 * k;
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
 * Clear crystal with the faintest cool cast. Glass has no colour of its
 * own: it is what it bends and what it reflects. It reflects the studio's
 * white panels, and it bends a backdrop only it can see (the sweep below):
 * light falling from above into shadow, with one quiet wash of indigo. So
 * the glyph is lit like an object on a set, and the page around it gets
 * no haze, no halo and no colour it did not already have.
 */
function Glass() {
  const sweep = useMemo(() => paintSweep(), []);
  useEffect(() => () => sweep?.dispose(), [sweep]);
  return (
    <MeshTransmissionMaterial
      background={sweep ?? undefined}
      samples={5}
      resolution={320}
      thickness={1.6}
      roughness={0.03}
      ior={1.5}
      chromaticAberration={0.03}
      anisotropicBlur={0.1}
      distortion={0.05}
      distortionScale={0.3}
      temporalDistortion={0.02}
      color="#ffffff"
      attenuationColor="#c4c9f0"
      attenuationDistance={3}
      envMapIntensity={1.4}
      clearcoat={1}
      clearcoatRoughness={0.06}
    />
  );
}

/**
 * The backdrop the glass bends, as a photographer's set: near black, with
 * two long soft strip lights across it, a white one through the glyph's
 * upper curves and a cool indigo one below. Bent by the tube, the strips
 * become the lines of light that make glass read as glass. Painted once;
 * it is drawn only into the glass's own view of the scene.
 */
function paintSweep() {
  const w = 256;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext("2d");
  if (!g) return null;
  const fall = g.createLinearGradient(0, 0, 0, h);
  fall.addColorStop(0, "#474b60");
  fall.addColorStop(0.5, "#262836");
  fall.addColorStop(1, "#14151c");
  g.fillStyle = fall;
  g.fillRect(0, 0, w, h);
  const strip = (y: number, size: number, color: string) => {
    const grad = g.createLinearGradient(0, y - size, 0, y + size);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(0.5, color);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(0, y - size, w, size * 2);
  };
  strip(h * 0.24, 14, "rgba(226,230,246,0.4)");
  strip(h * 0.41, 42, "rgba(214,219,240,0.62)");
  strip(h * 0.61, 30, "rgba(140,152,232,0.7)");
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/**
 * Leans the whole object toward the pointer, wherever it is on the page.
 * The lean wakes up gradually, so the glass leaves the poster's pose
 * slowly rather than snapping toward wherever the pointer already is.
 */
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

  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    if (still) {
      g.rotation.set(0, 0, 0);
      return;
    }
    const k = wakeUp(state.clock.elapsedTime);
    const { x, y } = target.current;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, x * 0.38 * k, 3.5, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, y * 0.22 * k, 3.5, delta);
  });

  return <group ref={ref}>{children}</group>;
}

/* The studio's panels, lit the way a product is photographed: a white
   softbox overhead, a tall white strip at the side for one crisp line of
   light along the tube, a white rim from behind to draw the edges, and a
   low indigo fill, the only colour in the room. Colour, brightness, where
   each hangs and how big it is; each faces the glyph. */
const PANELS: {
  color: string;
  intensity: number;
  position: [number, number, number];
  scale: [number, number, number];
}[] = [
  {
    color: "#ffffff",
    intensity: 3.2,
    position: [0, 4, 3],
    scale: [8, 2.4, 1],
  },
  {
    color: "#ffffff",
    intensity: 1.5,
    position: [-5, 0.5, 2.5],
    scale: [1.2, 6, 1],
  },
  {
    color: "#ffffff",
    intensity: 1.3,
    position: [3, 3, -4],
    scale: [6, 1.2, 1],
  },
  {
    color: "#9aa5f2",
    intensity: 1,
    position: [4.5, -2, 2],
    scale: [3, 4, 1],
  },
];

/**
 * A small studio of soft panels: the only light the glass ever sees. The
 * panels are rendered once into the scene's environment map and thrown
 * away. Built by hand rather than with drei's Environment, which would
 * bring HDR and EXR file loaders this page never uses.
 */
function Studio() {
  const get = useThree((s) => s.get);

  useEffect(() => {
    const { gl, scene } = get();
    const studio = new THREE.Scene();
    const parts: { dispose(): void }[] = [];
    for (const p of PANELS) {
      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(p.color).multiplyScalar(p.intensity),
        side: THREE.DoubleSide,
        toneMapped: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...p.position);
      mesh.scale.set(...p.scale);
      mesh.lookAt(0, 0, 0);
      studio.add(mesh);
      parts.push(geometry, material);
    }
    const pmrem = new THREE.PMREMGenerator(gl);
    /* The panels are large and soft, so a small map reflects them just as
       well and costs a quarter of the default. */
    const env = pmrem.fromScene(studio, 0, 0.1, 100, { size: 128 });
    scene.environment = env.texture;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
      for (const part of parts) part.dispose();
    };
  }, [get]);

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 5, 4]} intensity={1} color="#ffffff" />
    </>
  );
}

/** Calls back once the first frame has been drawn. */
function Ready({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    /* After this tick, so the first render (and its shader compile) is
       behind us when the glass starts to appear. */
    window.setTimeout(onReady, 0);
  });
  return null;
}

/** If the renderer fails for any reason, the poster simply stays. */
class Boundary extends Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
