import useSpline from "@splinetool/r3f-spline";
import { OrthographicCamera } from "@react-three/drei";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Scene({ ...props }) {
  const { nodes, materials } = useSpline(
    "https://prod.spline.design/wdGgjXPevqAJbWdg/scene.splinecode"
  );

  return (
    <>
      <group {...props} dispose={null} position={[0, 0, 0]}>
        <scene name="Scene">
          <mesh
            name="Sphere"
            geometry={nodes.Sphere.geometry}
            material={materials["Sphere Material"]}
            castShadow
            receiveShadow
            position={[0, 0, 0]}
            rotation={[Math.PI, -1.1, Math.PI]}
            scale={1}
          />
          <directionalLight
            name="Directional Light"
            castShadow
            intensity={2}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={-10000}
            shadow-camera-far={100000}
            shadow-camera-left={-1250}
            shadow-camera-right={1250}
            shadow-camera-top={1250}
            shadow-camera-bottom={-1250}
            position={[0, 0, 1000]}
          />
          <OrthographicCamera
            name="1"
            makeDefault={true}
            far={10000}
            near={-50000}
            zoom={0.5}
            position={[0, 0, 10]}
          />
          <hemisphereLight
            name="Default Ambient Light"
            intensity={0.75}
            color="#eaeaea"
          />
        </scene>
      </group>
    </>
  );
}

export default function Globe() {
  return (
    <Suspense fallback={null}>
      <Canvas flat linear>
        <Scene />
        <OrbitControls
          enablePan={false}
          enableRotate={true}
          enableZoom={false}
          minPolarAngle={Math.PI / 2 - 0.3}
          maxPolarAngle={Math.PI / 2 + 0.3}
          rotateSpeed={0.1}
          autoRotate={true}
        />
      </Canvas>
    </Suspense>
  );
}
