import { useGLTF, useTexture } from "@react-three/drei";
import { RigidBody, TrimeshCollider } from "@react-three/rapier";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const WaterCollider = () => {
  const gltf = useGLTF("/models/water-collider.glb");

  const geometry = gltf.scene.children[0].geometry;
  const vertices = geometry.attributes.position.array;
  const indices = geometry.index.array;

  // console.log(gltf);

  const bakedPropsTexture = useTexture("/textures/waterPropss.jpg");
  bakedPropsTexture.flipY = false;
  bakedPropsTexture.encoding = THREE.sRGBEncoding;

  const bakedNeutralMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: bakedPropsTexture,
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
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={gltf.scene} />
      <TrimeshCollider args={[vertices, indices]} />
    </RigidBody>
  );
};

export default WaterCollider;

useGLTF.preload("/models/water-collider.glb");
