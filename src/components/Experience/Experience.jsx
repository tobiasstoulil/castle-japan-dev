import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
import { Suspense, useRef } from "react";

export default function Experience() {
  console.log("experience r");

  return (
    <>
      <Canvas
        className="webgl"
        flat
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>

        {/* <OrbitControls makeDefault /> */}
      </Canvas>
    </>
  );
}
