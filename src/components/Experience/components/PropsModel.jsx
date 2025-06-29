import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import useStats from "../../../stores/useStats";
import gsap from "gsap";

import castlePropsVertexShader from "../shaders/castleProps/vertex.glsl";
import castlePropsFragmentShader from "../shaders/castleProps/fragment.glsl";

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
        vertexShader: castlePropsVertexShader,
        fragmentShader: castlePropsFragmentShader,
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
