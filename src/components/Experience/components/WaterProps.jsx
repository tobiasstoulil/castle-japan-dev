import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import useStats from "../../../stores/useStats";
import gsap from "gsap";

import waterVertexShader from "../shaders/water/vertex.glsl";
import waterFragmentShader from "../shaders/water/fragment.glsl";

import waterPropsVertexShader from "../shaders/waterProps/vertex.glsl";
import waterPropsFragmentShader from "../shaders/waterProps/fragment.glsl";

const WaterProps = () => {
  const gltf = useGLTF("/models/water-props.glb");

  const bakedPropsTexture = useTexture("/textures/waterPropss.jpg");
  bakedPropsTexture.flipY = false;
  bakedPropsTexture.encoding = THREE.sRGBEncoding;

  const bakedNeutralMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uNeutralTexture: new THREE.Uniform(bakedPropsTexture),
        },
        vertexShader: waterPropsVertexShader,
        fragmentShader: waterPropsFragmentShader,
      }),
    []
  );

  const dataTexture = useTexture("/textures/terrainDat.png");
  dataTexture.flipY = false;
  dataTexture.encoding = THREE.NoColorSpace;

  const vornoiTexture = useTexture("/textures/voronoi.png");
  vornoiTexture.wrapS = vornoiTexture.wrapT = THREE.RepeatWrapping;
  vornoiTexture.encoding = THREE.NoColorSpace;

  const waterMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: new THREE.Uniform(0),
          uCharPosition: new THREE.Uniform(new THREE.Vector3(0, 0, 0)),
          uAlpha: new THREE.Uniform(dataTexture),
          uNoise: new THREE.Uniform(vornoiTexture),
        },
        vertexShader: waterVertexShader,
        fragmentShader: waterFragmentShader,
        transparent: true,
      }),
    []
  );

  useEffect(() => {
    gltf.scene.traverse((child) => {
      // console.log(child.name);

      //
      if (child.isMesh) {
        child.material.dispose();
        if (child.geometry.attributes.uv1) {
          child.geometry.setAttribute("uv", child.geometry.attributes.uv1);
          child.geometry.attributes.uv.needsUpdate = true;
        }

        if (child.name === "Water") {
          child.material = waterMaterial;
        } else {
          child.material = bakedNeutralMaterial;
        }
      }
    });

    return () => {};
  }, [gltf]);

  useFrame((state, delta) => {
    waterMaterial.uniforms.uTime.value += delta;
  });

  return (
    <>
      <primitive object={gltf.scene} />
    </>
  );
};

export default WaterProps;

useGLTF.preload("/models/water-props.glb");
