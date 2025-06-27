import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import useStats from "../../../stores/useStats";
import gsap from "gsap";

import jcastleVertexShader from "../shaders/jcastle/vertex.glsl";
import jcastleFragmentShader from "../shaders/jcastle/fragment.glsl";

const PropsModel = () => {
  const gltf = useGLTF("/models/japan-castle-props.glb");

  const bakedPropsTexture = useTexture("/textures/bakeProps.jpg");
  bakedPropsTexture.flipY = false;
  bakedPropsTexture.encoding = THREE.sRGBEncoding;

  const bakedNeutralMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uNeutralTexture: new THREE.Uniform(bakedPropsTexture),
        },
        transparent: true,
        vertexShader: jcastleVertexShader,
        fragmentShader: jcastleFragmentShader,
      }),
    []
  );

  useEffect(() => {
    gltf.scene.traverse((child) => {
      // console.log(child.name);

      //
      if (child.isMesh) {
        child.material.dispose();
        child.material = bakedNeutralMaterial;
      }
    });

    return () => {};
  }, [gltf]);

  return (
    <>
      <primitive object={gltf.scene} />
    </>
  );
};

export default PropsModel;

useGLTF.preload("/models/japan-castle-props.glb");
