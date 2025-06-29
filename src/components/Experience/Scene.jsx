import { useFrame, useThree } from "@react-three/fiber";
import Model from "./components/Model";

import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import {
  Environment,
  KeyboardControls,
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
  PivotControls,
  useTexture,
} from "@react-three/drei";
import useStats from "../../stores/useStats";

import WiggleFigure from "./components/WiggleFigure";
import PropsModel from "./components/PropsModel";
import { Physics } from "@react-three/rapier";
import Colliders from "./components/Colliders";
import WaterProps from "./components/WaterProps";
import Leaves from "./components/Leaves";
import { Leva, useControls } from "leva";

import gsap from "gsap";

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
    const fac = 0.2; //18

    cameraRef.current.position.set(
      cameraPosition.x + lerpedPosition.current.x * fac,
      cameraPosition.y + lerpedPosition.current.y * fac,
      cameraPosition.z + lerpedPosition.current.z * fac
    );

    cameraRef.current.lookAt(
      lerpedPosition.current.x * fac,
      (lerpedPosition.current.y + 32) * fac,
      lerpedPosition.current.z * fac
    );
  });

  const { progress } = useControls("Pr", {
    progress: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.01,
      onChange: (v) => {
        // console.log(shaderTransitionMaterial);

        shaderTransitionMaterial.uniforms.uProgress.value = v;
      },
    },
  });

  const shaderTransitionRef = useRef();

  const noiseTexture = useTexture("/textures/clouds.jpg");
  noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;
  noiseTexture.encoding = THREE.NoColorSpace;

  const shaderTransitionMaterial = useMemo(() => {
    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
     
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform sampler2D uNoiseTexture;
        uniform float uProgress;
        uniform float uAspect;

        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          uv -= 0.5;
          uv.x *= uAspect;
          uv += 0.5;

          float time = uTime * 0.025;

          float noise = texture2D(uNoiseTexture, uv).r;
          noise = pow(noise * 3., 2.);

          float fac = uv.y + 1.;
          fac = pow(fac, 0.5);
          fac = fac - uProgress * (1.44);
          fac = fac + fac * noise;

          gl_FragColor = vec4(vec3(1.), fac);
        }
      `,
      uniforms: {
        uTime: new THREE.Uniform(0),
        uProgress: new THREE.Uniform(0),
        uAspect: new THREE.Uniform(window.innerWidth / window.innerHeight),
        uNoiseTexture: new THREE.Uniform(noiseTexture),
      },
      depthTest: false,
      depthWrite: false,
      transparent: true,
    });

    return shaderMaterial;
  }, [noiseTexture]);

  useEffect(() => {
    shaderTransitionRef.current.material = shaderTransitionMaterial;

    const unsubscribe = useStats.subscribe(
      (state) => state.scopeAnim,
      (value, prevValue) => {
        // console.log(value);
        if (value === true) {
          // console.log("animate");
          gsap.to(shaderTransitionMaterial.uniforms.uProgress, {
            value: 1,
            duration: 6,
            delay: 0.25,
            ease: "power3.out",
          });
        }
      }
    );

    return () => unsubscribe();
  }, [shaderTransitionMaterial]);

  return (
    <>
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

      <mesh ref={shaderTransitionRef} renderOrder={1}>
        <planeGeometry args={[2, 2]} />
      </mesh>

      {/* <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshNormalMaterial />
      </mesh> */}

      {/* <OrbitControls /> */}

      {/* <Environment preset="sunset" /> */}

      <color attach="background" args={["#000000"]} />
      {/* <PivotControls scale={10} /> */}
    </>
  );
}
