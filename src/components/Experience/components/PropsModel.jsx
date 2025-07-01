import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import useStats from "../../../stores/useStats";
import gsap from "gsap";

import castlePropsVertexShader from "../shaders/castleProps/vertex.glsl";
import castlePropsFragmentShader from "../shaders/castleProps/fragment.glsl";

import castleProgressVertexShader from "../shaders/castleProgress/vertex.glsl";
import castleProgressFragmentShader from "../shaders/castleProgress/fragment.glsl";

const PropsModel = () => {
  const gltf = useGLTF("/models/japan-castle-props.glb");

  const bakedPropsTexture = useTexture("/textures/bakeProps1.jpg");
  bakedPropsTexture.flipY = false;
  bakedPropsTexture.encoding = THREE.sRGBEncoding;

  const noiseTexture = useTexture("/textures/noise.png");
  noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;
  noiseTexture.encoding = THREE.NoColorSpace;

  const bakedNeutralMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uNeutralTexture: new THREE.Uniform(bakedPropsTexture),
        },
        transparent: true,
        vertexShader: castlePropsVertexShader,
        fragmentShader: castlePropsFragmentShader,
      }),
    []
  );

  const bakedProgressMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uNeutralTexture: new THREE.Uniform(bakedPropsTexture),
          uNoiseTexture: new THREE.Uniform(noiseTexture),
          uProgress: new THREE.Uniform(0),
        },
        transparent: true,
        vertexShader: castleProgressVertexShader,
        fragmentShader: castleProgressFragmentShader,
      }),
    []
  );

  useEffect(() => {
    gltf.scene.traverse((child) => {
      // console.log(child.name);

      //
      if (child.isMesh) {
        child.material.dispose();
        if (child.name.includes("Progress")) {
          child.material = bakedProgressMaterial;
          return;
        } else {
          child.material = bakedNeutralMaterial;
        }
      }
    });

    return () => {};
  }, [gltf]);

  useEffect(() => {
    const unsubscribe = useStats.subscribe(
      (state) => state.hintCount,
      (value, prevValue) => {
        console.log(value);
        if (value === 2) {
          gsap.to(bakedProgressMaterial.uniforms.uProgress, {
            value: 1,
            duration: 6,
            delay: 0.5,
            ease: "hop",
          });
          // console.log("animate");
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <>
      <primitive object={gltf.scene} />
    </>
  );
};

export default PropsModel;

useGLTF.preload("/models/japan-castle-props.glb");
