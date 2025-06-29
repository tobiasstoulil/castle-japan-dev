import { useFrame, useThree } from "@react-three/fiber";
import Model from "./components/Model";

import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import {
  Cloud,
  Environment,
  KeyboardControls,
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
  PivotControls,
} from "@react-three/drei";
import useStats from "../../stores/useStats";

import gsap from "gsap";
import { useScreenCursor } from "./utils/useScreenCursor";
import { Bloom, EffectComposer, SSAO } from "@react-three/postprocessing";
import WiggleFigure from "./components/WiggleFigure";
import PropsModel from "./components/PropsModel";
import { Physics } from "@react-three/rapier";
import Colliders from "./components/Colliders";
import WaterCollider from "./components/WaterCollider";
import WaterProps from "./components/WaterProps";
import Leaves from "./components/Leaves";
import { Leva } from "leva";

// const keyboardMap = [
//   { name: "forward", keys: ["KeyW", "ArrowUp"] },
//   { name: "backward", keys: ["KeyS", "ArrowDown"] },
//   { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
//   { name: "rightward", keys: ["KeyD", "ArrowRight"] },
//   { name: "run", keys: ["Shift"] },
//   { name: "jump", keys: ["Space"] },
// ]

export default function Scene() {
  console.log("scene r");

  const cameraRef = useRef();
  const cameraPosition = useMemo(
    () => new THREE.Vector3(30.6086, 33.6588, 30.6086),
    []
  );

  const lerpedPosition = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    const charPosition = useStats.getState().charPosition;

    // console.log(charPosition);

    lerpedPosition.current.lerp(charPosition, 1 - Math.pow(0.175, delta));

    // const fac = 0.33;
    const fac = 0.33; //18

    cameraRef.current.position.set(
      cameraPosition.x + lerpedPosition.current.x * fac,
      cameraPosition.y + lerpedPosition.current.y * fac,
      cameraPosition.z + lerpedPosition.current.z * fac
    );

    cameraRef.current.lookAt(
      lerpedPosition.current.x * fac,
      (lerpedPosition.current.y + 18) * fac,
      lerpedPosition.current.z * fac
    );
  });

  return (
    <>
      {/* <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        near={0.1}
        far={1000}
        rotation={[
          THREE.MathUtils.degToRad(60 - 90),
          THREE.MathUtils.degToRad(45),
          0,
          "YXZ",
        ]}
        // position={[cameraPosition.x, cameraPosition.y, cameraPosition.z]}
      /> */}
      <OrthographicCamera
        ref={cameraRef}
        makeDefault
        near={0.1}
        far={1000}
        position={[cameraPosition.x, cameraPosition.y, cameraPosition.z]}
        // zoom={24.5}
        zoom={20}
      />
      <group position={[0, 0, 0]}>
        <Model />
        <Leaves />
        <PropsModel />
        <WaterProps />
      </group>

      <Leva hidden />

      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "leftward", keys: ["ArrowLeft", "a", "A"] },
          { name: "rightward", keys: ["ArrowRight", "d", "D"] },
          { name: "jump", keys: ["Space"] },
          { name: "run", keys: ["ShiftLeft", "ShiftRight"] },
        ]}
      >
        <Physics debug={false}>
          <group position={[0, 5, 0]}>
            <WiggleFigure />
          </group>
          <group position={[0, 0, 0]}>
            <Colliders />
          </group>
        </Physics>
      </KeyboardControls>

      {/* <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshNormalMaterial />
      </mesh> */}

      {/* <OrbitControls /> */}

      {/* <EffectComposer> */}
      {/* <SSAO
          samples={20}
          rings={8}
          distanceThreshold={1}
          distanceFalloff={2}
          rangeThreshold={1}
          rangeFalloff={0}
          radius={5}
          luminanceInfluence={0.5}
          intensity={40}
          scale={2}
          bias={0.125}
          color="black"
        /> */}
      {/* <Bloom
          luminanceThreshold={1}
          luminanceSmoothing={0.5}
          intensity={0.5}
        /> */}
      {/* </EffectComposer> */}

      {/* <Environment preset="sunset" /> */}

      <color attach="background" args={["#000000"]} />
      {/* <PivotControls scale={10} /> */}
    </>
  );
}
