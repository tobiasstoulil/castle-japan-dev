import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import useStats from "../../../stores/useStats";
import gsap from "gsap";

import jcastleVertexShader from "../shaders/jcastle/vertex.glsl";
import jcastleFragmentShader from "../shaders/jcastle/fragment.glsl";

import windowVertexShader from "../shaders/window/vertex.glsl";
import windowFragmentShader from "../shaders/window/fragment.glsl";

const Model = () => {
  const gltf = useGLTF("/models/japan-castle.glb");

  const noiseTexture = useTexture("/textures/noise.png");
  noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;
  noiseTexture.encoding = THREE.NoColorSpace;

  const bakedNeutralTexture = useTexture("/textures/bakeNeutral2.webp");
  bakedNeutralTexture.flipY = false;
  bakedNeutralTexture.encoding = THREE.sRGBEncoding;

  const bakedFirstStepTexture = useTexture("/textures/bakeFirstStep.jpg");
  bakedFirstStepTexture.flipY = false;
  bakedFirstStepTexture.encoding = THREE.sRGBEncoding;

  const bakedSecondStepTexture = useTexture("/textures/bakeSecondStep.jpg");
  bakedSecondStepTexture.flipY = false;
  bakedSecondStepTexture.encoding = THREE.sRGBEncoding;

  const bakedThirdStepTexture = useTexture("/textures/bakeThirdStep.jpg");
  bakedThirdStepTexture.flipY = false;
  bakedThirdStepTexture.encoding = THREE.sRGBEncoding;

  const bakedNeutralMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: new THREE.Uniform(0),
          // uProgress: new THREE.Uniform(0),
          uFirstProgress: new THREE.Uniform(0),
          uSecondProgress: new THREE.Uniform(0),
          uThirdProgress: new THREE.Uniform(0),
          uNeutralTexture: new THREE.Uniform(bakedNeutralTexture),
          uNoiseTexture: new THREE.Uniform(noiseTexture),
          uBakedFirstStepTexture: new THREE.Uniform(bakedFirstStepTexture),
          uBakedSecondtStepTexture: new THREE.Uniform(bakedSecondStepTexture),
          uBakedThirdStepTexture: new THREE.Uniform(bakedThirdStepTexture),
        },
        transparent: true,
        vertexShader: jcastleVertexShader,
        fragmentShader: jcastleFragmentShader,
      }),
    []
  );

  const windowMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uNoiseTexture: new THREE.Uniform(noiseTexture),
        },
        transparent: true,
        vertexShader: windowVertexShader,
        fragmentShader: windowFragmentShader,
      }),
    []
  );

  useEffect(() => {
    gltf.scene.traverse((child) => {
      // console.log(child.name);

      if (child.material) {
        child.material.dispose();
        // child.material = null;
      }
      //
      if (child.isMesh) {
        // console.log(child.name);
        if (child.name.includes("custom")) {
          child.material = windowMaterial;
        } else {
          child.material = bakedNeutralMaterial;
          // console.log(child.name);
          if (child.name === "Plane106") {
            child.position.y -= 1;
          }
        }
      }
    });

    return () => {};
  }, [gltf]);

  useEffect(() => {
    const unsubscribe = useStats.subscribe(
      (state) => state.hintCount,
      (value, prevValue) => {
        // console.log(value);

        if (value === 1) {
          gsap.to(bakedNeutralMaterial.uniforms.uFirstProgress, {
            value: 1,
            duration: 2.5,
            delay: 0.2,
            ease: "power3.in",
          });
        } else if (value === 2) {
          gsap.to(bakedNeutralMaterial.uniforms.uSecondProgress, {
            value: 1,
            duration: 2.5,
            delay: 0.2,
            ease: "power3.in",
          });
        } else if (value === 3) {
          gsap.to(bakedNeutralMaterial.uniforms.uThirdProgress, {
            value: 1,
            duration: 2.5,
            delay: 0.2,
            ease: "power3.in",
          });
        }
      }
    );

    return () => unsubscribe();
  }, []);

  useFrame((_, delta) => {
    bakedNeutralMaterial.uniforms.uTime.value += delta;
  });

  return (
    <>
      <primitive object={gltf.scene} />
      {/* <mesh ref={groundRef} geometry={planeGeometry}></mesh> */}
    </>
  );
};

export default Model;

useGLTF.preload("/models/japan-castle.glb");
