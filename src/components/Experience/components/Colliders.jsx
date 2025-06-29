import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, TrimeshCollider } from "@react-three/rapier";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import useStats from "../../../stores/useStats";

import groundVertexShader from "../shaders/ground/vertex.glsl";
import groundFragmentShader from "../shaders/ground/fragment.glsl";

const Colliders = () => {
  const gltf = useGLTF("/models/colliders.glb");

  const geometry = gltf.scene.children[0].geometry;
  const vertices = geometry.attributes.position.array;
  const indices = geometry.index.array;

  const noiseTexture = useTexture("/textures/noise.png");
  noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;
  noiseTexture.encoding = THREE.NoColorSpace;

  const vornoiTexture = useTexture("/textures/voronoi.png");
  vornoiTexture.wrapS = vornoiTexture.wrapT = THREE.RepeatWrapping;
  vornoiTexture.encoding = THREE.NoColorSpace;

  const bakeGroundTexture = useTexture("/textures/bakeGround.jpg");
  bakeGroundTexture.flipY = false;
  bakeGroundTexture.encoding = THREE.sRGBEncoding;

  const groundMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: new THREE.Uniform(0),
          uCharPosition: new THREE.Uniform(new THREE.Vector3(0, 0, 0)),
          uTexture: new THREE.Uniform(bakeGroundTexture),
          uNoiseTexture: new THREE.Uniform(noiseTexture),
          uVornoiTexture: new THREE.Uniform(vornoiTexture),
        },
        vertexShader: groundVertexShader,
        fragmentShader: groundFragmentShader,
        // vertexColors: true,
      }),
    []
  );

  useEffect(() => {
    gltf.scene.traverse((child) => {
      // console.log(child.name);

      //
      if (child.isMesh) {
        child.material.dispose();
        child.material = groundMaterial;
      }
    });
  }, []);

  useFrame((_, delta) => {
    const charPosition = useStats.getState().charPosition;

    groundMaterial.uniforms.uCharPosition.value = charPosition;
    groundMaterial.uniforms.uTime.value += delta;
  });

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <TrimeshCollider args={[vertices, indices]} />
      <primitive object={gltf.scene} />
    </RigidBody>
  );
};

export default Colliders;

useGLTF.preload("/models/colliders.glb");
