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

  const setHintPosition = useStats.getState().setHintPosition;

  const hintOneRef = useRef(null);
  const hintTwoRef = useRef(null);
  const hintThreeRef = useRef(null);

  const noiseTexture = useTexture("/textures/noise.png");
  noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;
  noiseTexture.encoding = THREE.NoColorSpace;

  const hintAlphaTexture = useTexture("/textures/alphaHint.png");
  hintAlphaTexture.encoding = THREE.NoColorSpace;

  const hintMaterialOne = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uNoiseTexture: new THREE.Uniform(noiseTexture),
          uHintAlpha: new THREE.Uniform(hintAlphaTexture),
          uTime: new THREE.Uniform(0),
          uAlphaProgress: new THREE.Uniform(0),
        },
        vertexShader: hintVertexShader,
        fragmentShader: hintFragmentShader,
        transparent: true,
        // side: THREE.DoubleSide,
      }),
    []
  );
  const hintMaterialTwo = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uNoiseTexture: new THREE.Uniform(noiseTexture),
          uHintAlpha: new THREE.Uniform(hintAlphaTexture),
          uTime: new THREE.Uniform(0),
          uAlphaProgress: new THREE.Uniform(1),
        },
        vertexShader: hintVertexShader,
        fragmentShader: hintFragmentShader,
        transparent: true,
        // side: THREE.DoubleSide,
      }),
    []
  );
  const hintMaterialThree = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uNoiseTexture: new THREE.Uniform(noiseTexture),
          uHintAlpha: new THREE.Uniform(hintAlphaTexture),
          uTime: new THREE.Uniform(0),
          uAlphaProgress: new THREE.Uniform(1),
        },
        vertexShader: hintVertexShader,
        fragmentShader: hintFragmentShader,
        transparent: true,
        // side: THREE.DoubleSide,
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
      if (child.name === "Geo") {
        setHintMesh(child);
      } else if (child.name === "First") {
        // console.log(hintMesh);

        if (hintMesh) {
          hintOneRef.current.position.copy(child.position);
          hintOneRef.current.rotation.copy(hintMesh.rotation);

          hintOneRef.current.material = hintMaterialOne;
          hintOneRef.current.geometry = hintMesh.geometry;

          // console.log(hintOneRef.current.position);
          setHintPosition({
            x: hintOneRef.current.position.x,
            y: hintOneRef.current.position.y,
            z: hintOneRef.current.position.z,
          });
        }
      } else if (child.name === "Second") {
        if (hintMesh) {
          hintTwoRef.current.position.copy(child.position);
          hintTwoRef.current.rotation.copy(hintMesh.rotation);

          hintTwoRef.current.material = hintMaterialTwo;
          hintTwoRef.current.geometry = hintMesh.geometry;
        }
      } else if (child.name === "Third") {
        if (hintMesh) {
          hintThreeRef.current.position.copy(child.position);
          hintThreeRef.current.rotation.copy(hintMesh.rotation);

          hintThreeRef.current.material = hintMaterialThree;
          hintThreeRef.current.geometry = hintMesh.geometry;
        }
      }
    });

    return () => {};
  }, [hintMesh]);

  useEffect(() => {
    const unsubscribe = useStats.subscribe(
      (state) => state.hintCount,
      (value, prevValue) => {
        console.log(value);
        if (value === 1) {
          gsap.to(hintMaterialOne.uniforms.uAlphaProgress, {
            value: 1,
            duration: 1.25,
            delay: 0,
            ease: "hop",
          });

          gsap.to(hintMaterialThree.uniforms.uAlphaProgress, {
            value: 0,
            duration: 1.25,
            delay: 0,
            ease: "hop",
          });

          setHintPosition({
            x: hintThreeRef.current.position.x,
            y: hintThreeRef.current.position.y,
            z: hintThreeRef.current.position.z,
          });
        } else if (value === 2) {
          gsap.to(hintMaterialThree.uniforms.uAlphaProgress, {
            value: 1,
            duration: 1.25,
            delay: 0,
            ease: "hop",
          });

          gsap.to(hintMaterialTwo.uniforms.uAlphaProgress, {
            value: 0,
            duration: 1.25,
            delay: 2,
            ease: "hop",
          });

          setHintPosition({
            x: hintTwoRef.current.position.x,
            y: hintTwoRef.current.position.y,
            z: hintTwoRef.current.position.z,
          });
        } else if (value === 3) {
          gsap.to(hintMaterialTwo.uniforms.uAlphaProgress, {
            value: 1,
            duration: 1.25,
            delay: 0,
            ease: "hop",
          });
        }
      }
    );

    return () => unsubscribe();
  }, []);

  useFrame((_, delta) => {
    hintMaterialOne.uniforms.uTime.value += delta;
    hintMaterialTwo.uniforms.uTime.value += delta;
    hintMaterialThree.uniforms.uTime.value += delta;
  });

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
