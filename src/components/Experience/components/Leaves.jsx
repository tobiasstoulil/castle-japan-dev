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

  const noiseTexture = useTexture("/textures/noise.png");
  noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;
  noiseTexture.encoding = THREE.NoColorSpace;

  const leavesColorOne = useTexture("/textures/leaves_one.png");
  leavesColorOne.flipY = false;
  leavesColorOne.encoding = THREE.sRGBEncoding;

  const leavesColorTwo = useTexture("/textures/leaves_two.png");
  leavesColorTwo.flipY = false;
  leavesColorTwo.encoding = THREE.sRGBEncoding;

  const leavesColorThree = useTexture("/textures/leaves_three.png");
  leavesColorThree.flipY = false;
  leavesColorThree.encoding = THREE.sRGBEncoding;

  const leavesColorFour = useTexture("/textures/leaves_four.png");
  leavesColorFour.flipY = false;
  leavesColorFour.encoding = THREE.sRGBEncoding;

  const leavesMaterialOne = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          // uBaseColor: new THREE.Uniform(baseColor),
          uBaseColor: new THREE.Uniform(leavesColorOne),
          uNoiseTexture: new THREE.Uniform(noiseTexture),
        },
        vertexShader: leavesVertexShader,
        fragmentShader: leavesFragmentShader,
        transparent: true,
        // side: THREE.DoubleSide,
      }),
    []
  );
  const leavesMaterialTwo = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          // uBaseColor: new THREE.Uniform(baseColor),
          uBaseColor: new THREE.Uniform(leavesColorTwo),
        },
        vertexShader: leavesVertexShader,
        fragmentShader: leavesFragmentShader,
        transparent: true,
        // side: THREE.DoubleSide,
      }),
    []
  );
  const leavesMaterialThree = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          // uBaseColor: new THREE.Uniform(baseColor),
          uBaseColor: new THREE.Uniform(leavesColorThree),
        },
        vertexShader: leavesVertexShader,
        fragmentShader: leavesFragmentShader,
        transparent: true,
        // side: THREE.DoubleSide,
      }),
    []
  );
  const leavesMaterialFour = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          // uBaseColor: new THREE.Uniform(baseColor),
          uBaseColor: new THREE.Uniform(leavesColorFour),
          uCharPosition: new THREE.Uniform(new THREE.Vector3(0, 0, 0)),
          uTime: new THREE.Uniform(0),
        },
        vertexShader: leavesVertexShader,
        fragmentShader: leavesFragmentShader,
        transparent: true,
        // side: THREE.DoubleSide,
      }),
    []
  );

  useFrame(({ size }, delta) => {
    const charPosition = useStats.getState().charPosition;

    leavesMaterialFour.uniforms.uCharPosition.value = charPosition;

    cloudsMaterial.uniforms.uAspect.value = size.width / size.height;
    cloudsMaterial.uniforms.uTime.value += delta;

    leavesMaterialFour.uniforms.uTime.value += delta;
  });

  const cloudTexture = useTexture("/textures/clouds.jpg");
  cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
  cloudTexture.encoding = THREE.NoColorSpace;

  const cloudsMaterial = useMemo(() => {
    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;

            
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
          }
        `,
      fragmentShader: `
          uniform float uTime;     
          uniform float uAspect;
          uniform sampler2D uCloudTexture;
  
          varying vec2 vUv;
  
          void main() {
            vec2 uv = vUv;
            uv -= 0.5;
            uv.x *= uAspect;
            uv += 0.5;
  
            float time = uTime * 0.025;
  
            float cloudAlpha = texture2D(uCloudTexture, vUv * 5. - time).r;
            cloudAlpha = pow(cloudAlpha, 2.);
            cloudAlpha *= 0.775;
  
            gl_FragColor = vec4(vec3(1.), cloudAlpha);
          }
        `,
      uniforms: {
        uTime: new THREE.Uniform(0),
        uAspect: new THREE.Uniform(window.innerWidth / window.innerHeight),
        uCloudTexture: new THREE.Uniform(cloudTexture),
      },
      depthTest: false,
      depthWrite: false,
      transparent: true,
    });

    return shaderMaterial;
  }, [cloudTexture]);

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

        if (child.name === "One") {
          child.material = leavesMaterialOne;
          return;
        } else if (child.name === "Two") {
          child.material = leavesMaterialTwo;
          return;
        } else if (child.name === "Three001") {
          child.material = leavesMaterialThree;
          return;
        } else if (child.name === "Four") {
          child.material = leavesMaterialFour;
          return;
        } else if (child.name === "Clouds") {
          child.material = cloudsMaterial;
          child.position.y -= 10;
          return;
        }
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
