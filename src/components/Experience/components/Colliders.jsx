import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, TrimeshCollider } from "@react-three/rapier";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import useStats from "../../../stores/useStats";

import groundVertexShader from "../shaders/ground/vertex.glsl";
import groundFragmentShader from "../shaders/ground/fragment.glsl";
import gsap from "gsap";

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

  const bakeGroundProgressTexture = useTexture(
    "/textures/bakeGroundProgress.jpg"
  );
  bakeGroundProgressTexture.flipY = false;
  bakeGroundProgressTexture.encoding = THREE.sRGBEncoding;

  const groundMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: new THREE.Uniform(0),
          uProgress: new THREE.Uniform(0),
          uImpulseProgress: new THREE.Uniform(0),
          uImpulsePosition: new THREE.Uniform(new THREE.Vector3(-21, 0, 34)),
          uCharPosition: new THREE.Uniform(new THREE.Vector3(0, 0, 0)),
          uTexture: new THREE.Uniform(bakeGroundTexture),
          uProgressTexture: new THREE.Uniform(bakeGroundProgressTexture),
          uNoiseTexture: new THREE.Uniform(noiseTexture),
          uVornoiTexture: new THREE.Uniform(vornoiTexture),
        },
        vertexShader: groundVertexShader,
        fragmentShader: groundFragmentShader,
        // vertexColors: true,
      }),
    []
  );

  const bgMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: 0xffffff }),
    []
  );

  const { scene } = useThree();

  useEffect(() => {
    gltf.scene.traverse((child) => {
      // console.log(child.name);

      //
      if (child.isMesh) {
        child.material.dispose();
        if (child.name.includes("Ground")) {
          child.material = groundMaterial;
        } else if (child.name === "Bounds") {
          child.visible = false;
        } else {
          child.material = bgMaterial;
        }
      }
    });
  }, []);

  useEffect(() => {
    const unsubscribe = useStats.subscribe(
      (state) => state.hintCount,
      (value, prevValue) => {
        // console.log(value);

        if (value === 1) {
          groundMaterial.uniforms.uImpulsePosition.value = new THREE.Vector3(
            -21,
            0,
            34
          );
        }

        if (value === 2) {
          groundMaterial.uniforms.uImpulsePosition.value = new THREE.Vector3(
            23,
            0,
            5.6
          );

          gsap.to(groundMaterial.uniforms.uProgress, {
            value: 1,
            duration: 2,
            ease: "hop",
          });
          // console.log("animate");
        }
        if (value === 3) {
          groundMaterial.uniforms.uImpulsePosition.value = new THREE.Vector3(
            -12,
            0,
            -3
          );
        }

        gsap.to(groundMaterial.uniforms.uImpulseProgress, {
          value: 1,
          duration: 4,
          ease: "none",
          delay: 0.25,
          onComplete: () => {
            gsap.to(groundMaterial.uniforms.uImpulseProgress, {
              value: 0,
              duration: 0,
              ease: "none",
            });
          },
        });
      }
    );

    return () => unsubscribe();
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
