import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import useStats from "../../../stores/useStats";
import gsap from "gsap";

import jcastleVertexShader from "../shaders/jcastle/vertex.glsl";
import jcastleFragmentShader from "../shaders/jcastle/fragment.glsl";

import groundVertexShader from "../shaders/ground/vertex.glsl";
import groundFragmentShader from "../shaders/ground/fragment.glsl";

import windowVertexShader from "../shaders/window/vertex.glsl";
import windowFragmentShader from "../shaders/window/fragment.glsl";

const Model = () => {
  const gltf = useGLTF("/models/japan-castle.glb");

  const noiseTexture = useTexture("/textures/noise.png");
  noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;
  noiseTexture.encoding = THREE.NoColorSpace;

  const vornoiTexture = useTexture("/textures/vornoi.png");
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

  // const emissiveMaterial = useMemo(
  //   () =>
  //     new THREE.MeshStandardMaterial({
  //       color: 0xffffff,
  //       emissive: 0xffffff,
  //       emissiveIntensity: 0.5,
  //     }),
  //   []
  // );

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
  const bakeGroundTexture = useTexture("/textures/bakeGround.jpg");
  bakeGroundTexture.flipY = false;
  bakeGroundTexture.encoding = THREE.sRGBEncoding;

  const groundMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uCharPosition: new THREE.Uniform(new THREE.Vector3(0, 0, 0)),
          uTexture: new THREE.Uniform(bakeGroundTexture),
          uNoiseTexture: new THREE.Uniform(noiseTexture),
          uVornoiTexture: new THREE.Uniform(vornoiTexture),
        },
        vertexShader: groundVertexShader,
        fragmentShader: groundFragmentShader,
        vertexColors: true,
      }),
    []
  );

  useEffect(() => {
    gltf.scene.traverse((child) => {
      // console.log(child.name);
      if (child.name.includes("cameraPosition")) {
        // camera.position.set(
        //   child.position.x,
        //   child.position.y,
        //   child.position.z
        // );
      }

      if (child.material) {
        child.material.dispose();
        // child.material = null;
      }
      //
      if (child.isMesh) {
        if (child.name.includes("custom")) {
          child.material = windowMaterial;
        } else if (child.name.includes("Ground")) {
          child.material = groundMaterial;

          // console.log(child);
        } else {
          child.material = bakedNeutralMaterial;
        }
      }
    });

    return () => {};
  }, [gltf]);

  useFrame((_, delta) => {
    const charPosition = useStats.getState().charPosition;

    groundMaterial.uniforms.uCharPosition.value = charPosition;
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
