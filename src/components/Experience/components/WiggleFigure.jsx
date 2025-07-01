import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useKeyboardControls, useTexture } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import { useGLTF } from "@react-three/drei";
import useStats from "../../../stores/useStats";

import { WiggleRigHelper } from "wiggle/helper";
// import { WiggleBone } from "wiggle";
import { WiggleBone } from "wiggle/spring";

// const normalizeAngle = (angle) => {
//   while (angle > Math.PI) angle -= Math.PI * 2;
//   while (angle < -Math.PI) angle += Math.PI * 2;

//   return angle;
// };

// const lerpAngle = (start, end, t) => {
//   start = normalizeAngle(start);
//   end = normalizeAngle(end);

//   if (Math.abs(end - start) > Math.PI) {
//     if (end > start) {
//       start += Math.PI * 2;
//     } else {
//       end += Math.PI * 2;
//     }
//   }

//   return normalizeAngle(start + (end - start) * t);
// };

const WiggleFigure = () => {
  const { nodes, scene } = useGLTF("/models/wiggle-rig.glb");

  const setCharPosition = useStats((state) => state.setCharPosition);
  const increaseHintCount = useStats((state) => state.increaseHintCount);

  const isIncreased = useRef(false);

  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED } = useControls(
    "Character Control",
    {
      WALK_SPEED: { value: 4, min: 0.1, max: 10, step: 0.1 },
      RUN_SPEED: { value: 7, min: 0.2, max: 20, step: 0.1 },
      ROTATION_SPEED: {
        value: degToRad(3.5),
        min: degToRad(0.1),
        max: degToRad(5),
        step: degToRad(0.1),
      },
    }
  );

  const rb = useRef(null);
  const container = useRef();
  const character = useRef();
  const wiggleBones = useRef([]);

  const hintPositionRef = useRef(null);
  const isLoaded = useRef(false);

  const rotationTarget = useRef(0);
  const characterRotationTarget = useRef(0);
  const [_, get] = useKeyboardControls();
  const isClicking = useRef(false);

  const matcapTexture = useTexture("/textures/m3.png");

  const material = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });

  // useEffect(() => {
  //   const onMouseDown = (e) => {
  //     isClicking.current = true;
  //   };

  //   const onMouseUp = (e) => {
  //     isClicking.current = false;
  //   };

  //   document.addEventListener("mousedown", onMouseDown);
  //   document.addEventListener("mouseup", onMouseUp);

  //   document.addEventListener("touchstart", onMouseDown);
  //   document.addEventListener("touchend", onMouseUp);

  //   return () => {
  //     document.removeEventListener("mousedown", onMouseDown);
  //     document.removeEventListener("mouseup", onMouseUp);
  //     document.addEventListener("touchstart", onMouseDown);
  //     document.addEventListener("touchend", onMouseUp);
  //   };
  // }, []);

  useEffect(() => {
    const unsubscribe = useStats.subscribe(
      (state) => state.scopeAnim,
      (value, prevValue) => {
        // console.log(value);
        if (value) {
          setTimeout(() => {
            isLoaded.current = true;
          }, 2500);
        }
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    wiggleBones.current.length = 0;

    scene.traverse((child) => {
      // console.log(child.name);
      if (child.isMesh) {
        child.material.dispose();

        child.material = material;
      }
    });

    // console.log(nodes);
    nodes.RootBone.traverse((bone) => {
      if (bone.isBone && bone !== nodes.RootBone) {
        const wiggleBone = new WiggleBone(bone, {
          stiffness: 400,
          damping: 25,
        });
        wiggleBones.current.push(wiggleBone);
      }
    });
    return () => {
      wiggleBones.current.forEach((wiggleBone) => {
        wiggleBone.reset();
        wiggleBone.dispose();
      });
    };
  }, [nodes, material]);

  const isJumped = useRef(false);

  useFrame((state, delta) => {
    // console.log(rb.current);

    if (rb.current) {
      wiggleBones.current.forEach((wiggleBone) => {
        wiggleBone.update();
      });

      if (!isLoaded.current) {
        return;
      }

      const vel = rb.current.linvel();

      const movement = {
        x: 0,
        z: 0,
      };

      if (get().forward) {
        movement.z = 1;
      }

      if (get().backward) {
        movement.z = -1;
      }

      if (get().leftward) {
        movement.x = 1;
      }

      if (get().rightward) {
        movement.x = -1;
      }

      let speed = get().run ? RUN_SPEED : WALK_SPEED;

      if (isClicking.current) {
        if (Math.abs(state.pointer.x) > 0.1) {
          movement.x = -state.pointer.x;
        }

        movement.z = state.pointer.y + 0.4;

        if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) {
          speed = RUN_SPEED;
        }
      }

      if (movement.x !== 0) {
        rotationTarget.current += ROTATION_SPEED * movement.x;
      }

      if (movement.x !== 0 || movement.z !== 0) {
        //uhel mezi nimi; znamínko
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);

        vel.x =
          Math.sin(rotationTarget.current + characterRotationTarget.current) *
          speed;
        vel.z =
          Math.cos(rotationTarget.current + characterRotationTarget.current) *
          speed;

        const worldPosition = new THREE.Vector3();
        container.current.getWorldPosition(worldPosition);
        worldPosition.y -= 2;
        // console.log("World Position:", worldPosition.y);

        if (worldPosition.y < 1) {
          isJumped.current = false;
        }

        setCharPosition(worldPosition.clone());

        // const hintPosition = new THREE.Vector3(0, 0, 0);

        const distFromHint = worldPosition.distanceTo(hintPositionRef.current);
        // console.log(distFromHint, hintPositionRef.current);
        // console.log(isIncreased.current);

        if (distFromHint < 5 && !isIncreased.current) {
          increaseHintCount();
          isIncreased.current = true;
          // console.log("hint");
        }
      } else {
        vel.x = 0;
        vel.z = 0;
      }

      if (get().jump) {
        if (!isJumped.current) {
          isJumped.current = true;

          vel.y = 7;
          // console.log("jump");
        }
      }

      // character.current.rotation.y = lerpAngle(
      //   character.current.rotation.y,
      //   characterRotationTarget.current,
      //   0.1
      // );

      rb.current.setLinvel(vel, true);
    }

    container.current.rotation.y = THREE.MathUtils.lerp(
      container.current.rotation.y,
      rotationTarget.current,
      0.1
    );
  });

  useEffect(() => {
    const unsubscribe = useStats.subscribe(
      (state) => state.hintPosition,
      (value, prevValue) => {
        hintPositionRef.current = value;
        setTimeout(() => (isIncreased.current = false), 1000);
        // console.log(value);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <RigidBody ref={rb} colliders={false} lockRotations>
      <group ref={container}>
        <group ref={character}>
          <group scale={1.825} position={[0, -2.3, 0]}>
            <primitive object={scene} />
            {/* <mesh ref={suzzaneRef} /> */}
          </group>
        </group>
      </group>
      <CapsuleCollider args={[1, 2]} />
    </RigidBody>
  );
};

export default WiggleFigure;
