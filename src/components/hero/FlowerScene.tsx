import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { Suspense, useEffect, useLayoutEffect, useRef } from "react"
import * as THREE from "three"

useGLTF.preload("/models/flower.glb")

/** Cheap synthetic studio IBL so the model's PBR materials don't render flat/dark. */
function StudioEnvironment() {
  const { gl, scene } = useThree()

  useEffect(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 64
    canvas.height = 32
    const ctx = canvas.getContext("2d")!
    const gradient = ctx.createLinearGradient(0, 0, 0, 32)
    gradient.addColorStop(0, "#ffffff")
    gradient.addColorStop(0.5, "#f3ece2")
    gradient.addColorStop(1, "#cbbfae")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 32)

    const tex = new THREE.CanvasTexture(canvas)
    tex.mapping = THREE.EquirectangularReflectionMapping
    tex.colorSpace = THREE.SRGBColorSpace

    const pmrem = new THREE.PMREMGenerator(gl)
    pmrem.compileEquirectangularShader()
    const envMap = pmrem.fromEquirectangular(tex).texture
    scene.environment = envMap

    tex.dispose()
    pmrem.dispose()

    return () => {
      envMap.dispose()
      scene.environment = null
    }
  }, [gl, scene])

  return null
}

type FlowerModelProps = {
  progressRef: React.RefObject<number>
}

/** Rotation/position/scale are a pure function of scroll progress (0 when unset, e.g. reduced motion) — no ambient idle animation. */
function FlowerModel({ progressRef }: FlowerModelProps) {
  const { scene } = useGLTF("/models/flower.glb")
  const wrapperRef = useRef<THREE.Group>(null)

  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    box.getSize(size)
    const center = new THREE.Vector3()
    box.getCenter(center)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const scale = 2.4 / maxDim
    scene.scale.setScalar(scale)
    scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
  }, [scene])

  useFrame(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const p = progressRef.current
    wrapper.rotation.y = p * Math.PI * 2.2
    wrapper.position.y = -p * 1.3
    wrapper.scale.setScalar(1 - p * 0.4)
  })

  return (
    <group ref={wrapperRef}>
      <primitive object={scene} />
    </group>
  )
}

type FlowerSceneProps = {
  progressRef: React.RefObject<number>
}

/** Full-bleed transparent canvas rendering the flower model, driven entirely by scroll progress. */
export function FlowerScene({ progressRef }: FlowerSceneProps) {
  return (
    <Canvas
      className="!absolute inset-0"
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 5], fov: 38 }}
      dpr={[1, 2]}
    >
      <StudioEnvironment />
      <hemisphereLight args={[0xffffff, 0xd9c4ad, 0.55]} />
      <directionalLight color={0xffffff} intensity={1.1} position={[-3, 5, 10]} />
      <directionalLight color={0xffb56b} intensity={0.28} position={[5, -1, 4]} />
      <Suspense fallback={null}>
        <FlowerModel progressRef={progressRef} />
      </Suspense>
    </Canvas>
  )
}
