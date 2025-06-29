import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF, useHelper, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import useStats from "../../../stores/useStats";
import gsap from "gsap";

import leavesVertexShader from "../shaders/leaves/vertex.glsl";
import leavesFragmentShader from "../shaders/leaves/fragment.glsl";

const Leaves = () => {
  const gltf = useGLTF("/models/leaves.glb");

  const baseColor = useTexture("/textures/leaves_color.png");
  baseColor.flipY = false;
  baseColor.encoding = THREE.sRGBEncoding;

  const leavesMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uBaseColor: new THREE.Uniform(baseColor),
        },
        vertexShader: leavesVertexShader,
        fragmentShader: leavesFragmentShader,
        transparent: true,
        // side: THREE.DoubleSide,
      }),
    [baseColor]
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
        child.material = leavesMaterial;
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

export default Leaves;

useGLTF.preload("/models/leaves.glb");
