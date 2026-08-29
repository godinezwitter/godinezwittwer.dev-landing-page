import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useInView, useReducedMotion } from "framer-motion"
import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react"
import { Color, type Mesh, type ShaderMaterial } from "three"

/* Adapted from React Bits "Silk" — a flowing silk shader on a full-viewport plane.
   Kept faithful to the original GLSL; used here only as a faint, desaturated-wine
   ambient wash behind the closing sections. */

function hexToNormalizedRGB(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255]
}

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  float grain = rnd / 15.0 * uNoiseIntensity;
  vec3 result = uColor * pattern - vec3(grain);

  gl_FragColor = vec4(clamp(result, 0.0, 1.0), 1.0);
}
`

type Uniforms = {
  uSpeed: { value: number }
  uScale: { value: number }
  uNoiseIntensity: { value: number }
  uColor: { value: Color }
  uRotation: { value: number }
  uTime: { value: number }
}

const SilkPlane = forwardRef<Mesh, { uniforms: Uniforms }>(function SilkPlane({ uniforms }, ref) {
  const { viewport } = useThree()
  const meshRef = ref as RefObject<Mesh>

  useLayoutEffect(() => {
    if (meshRef.current) meshRef.current.scale.set(viewport.width, viewport.height, 1)
  }, [meshRef, viewport])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return
    ;(mesh.material as ShaderMaterial).uniforms.uTime.value += 0.1 * delta
  })

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
    </mesh>
  )
})

type SilkProps = {
  speed?: number
  scale?: number
  color?: string
  noiseIntensity?: number
  rotation?: number
}

function Silk({ speed = 5, scale = 1, color = "#7B7481", noiseIntensity = 1.5, rotation = 0 }: SilkProps) {
  const meshRef = useRef<Mesh>(null)

  const uniforms = useMemo<Uniforms>(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...hexToNormalizedRGB(color)) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    }),
    // uniforms object is created once; values are synced below
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    uniforms.uSpeed.value = speed
    uniforms.uScale.value = scale
    uniforms.uNoiseIntensity.value = noiseIntensity
    uniforms.uColor.value.setRGB(...hexToNormalizedRGB(color))
    uniforms.uRotation.value = rotation
  }, [speed, scale, noiseIntensity, color, rotation, uniforms])

  return (
    <Canvas dpr={[1, 1.5]} frameloop="always">
      <SilkPlane ref={meshRef} uniforms={uniforms} />
    </Canvas>
  )
}

/**
 * Positioned, restrained wrapper for the closing sections: a faint desaturated-wine
 * silk that multiplies into the paper for ambient depth. The WebGL canvas mounts
 * only while the section is on screen, and reduced-motion users get a static wash.
 */
export function SilkBackground() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: "200px 0px" })

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        opacity: 0.12,
        mixBlendMode: "multiply",
        maskImage: "linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)",
      }}
    >
      {!reduce && inView ? (
        <Silk color="#a35d70" speed={2.4} scale={1} noiseIntensity={1.1} rotation={0.12} />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(120% 80% at 80% 0%, rgba(184,48,92,0.06), transparent 62%)" }}
        />
      )}
    </div>
  )
}

export default Silk
