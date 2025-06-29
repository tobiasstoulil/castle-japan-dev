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

  const vornoiTexture = useTexture("/textures/voronoi.png");
  vornoiTexture.wrapS = vornoiTexture.wrapT = THREE.RepeatWrapping;
  vornoiTexture.encoding = THREE.NoColorSpace;

  const bakedNeutralTexture = useTexture("/textures/bakeNeutral.jpg");
  bakedNeutralTexture.flipY = false;
  bakedNeutralTexture.encoding = THREE.sRGBEncoding;

  const bakedNeutralMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uNeutralTexture: new THREE.Uniform(bakedNeutralTexture),
          uNoiseTexture: new THREE.Uniform(noiseTexture),
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
        }
      }
    });

    return () => {};
  }, [gltf]);

  return (
    <>
      <primitive object={gltf.scene} />
      {/* <mesh ref={groundRef} geometry={planeGeometry}></mesh> */}
    </>
  );
};

export default Model;

useGLTF.preload("/models/japan-castle.glb");
