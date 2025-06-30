import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useGLTF, useHelper, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import useStats from "../../../stores/useStats";
import gsap from "gsap";

import hintVertexShader from "../shaders/hint/vertex.glsl";
import hintFragmentShader from "../shaders/hint/fragment.glsl";

const Hints = () => {
  const gltf = useGLTF("/models/hints.glb");

  const [hintMesh, setHintMesh] = useState();

  const hintOneRef = useRef(null);
  const hintTwoRef = useRef(null);
  const hintThreeRef = useRef(null);

  const noiseTexture = useTexture("/textures/noise.png");
  noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;
  noiseTexture.encoding = THREE.NoColorSpace;

  const hintAlphaTexture = useTexture("/textures/alphaHint.png");

  noiseTexture.encoding = THREE.NoColorSpace;

  const hintMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uNoiseTexture: new THREE.Uniform(noiseTexture),
          uHintAlpha: new THREE.Uniform(hintAlphaTexture),
        },
        vertexShader: hintVertexShader,
        fragmentShader: hintFragmentShader,
        transparent: true,
        // side: THREE.DoubleSide,
      }),
    []
  );

  //   const hintGeometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 1, 1), []);

  //   useFrame(({ size }, delta) => {
  //     const charPosition = useStats.getState().charPosition;
  //   });

  useEffect(() => {
    gltf.scene.traverse((child) => {
      // console.log(child.name);
      if (child.material) {
        child.material.dispose();
        // child.material = null;
      }
      //
      if (child.name === "Geo") {
        setHintMesh(child);
      } else if (child.name === "First") {
        // console.log(hintMesh);

        if (hintMesh) {
          hintOneRef.current.position.copy(child.position);
          hintOneRef.current.rotation.copy(hintMesh.rotation);

          hintOneRef.current.material = hintMaterial;
          hintOneRef.current.geometry = hintMesh.geometry;
        }
      } else if (child.name === "Second") {
        if (hintMesh) {
          hintTwoRef.current.position.copy(child.position);
          hintTwoRef.current.rotation.copy(hintMesh.rotation);

          hintTwoRef.current.material = hintMaterial;
          hintTwoRef.current.geometry = hintMesh.geometry;
        }
      } else if (child.name === "Third") {
        if (hintMesh) {
          hintThreeRef.current.position.copy(child.position);
          hintThreeRef.current.rotation.copy(hintMesh.rotation);

          hintThreeRef.current.material = hintMaterial;
          hintThreeRef.current.geometry = hintMesh.geometry;
        }
      }
    });

    return () => {};
  }, [hintMesh]);

  return (
    <>
      <mesh ref={hintOneRef}></mesh>
      <mesh ref={hintTwoRef}></mesh>
      <mesh ref={hintThreeRef}></mesh>
    </>
  );
};

export default Hints;

useGLTF.preload("/models/hints.glb");
