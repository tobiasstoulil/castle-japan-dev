import { useGLTF } from "@react-three/drei";
import { RigidBody, TrimeshCollider } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const Colliders = () => {
  const gltf = useGLTF("/models/colliders.glb");
  const group = useRef(null);

  const geometry = gltf.scene.children[0].geometry;
  const vertices = geometry.attributes.position.array;
  const indices = geometry.index.array;

  // console.log(gltf);

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <TrimeshCollider args={[vertices, indices]} />
    </RigidBody>
  );
};

export default Colliders;

useGLTF.preload("/models/colliders.glb");
