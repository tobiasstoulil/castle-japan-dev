// const WiggleFigure = () => {
//   const { nodes, scene } = useGLTF("/models/wiggle-rig.glb");
//   const wiggleBones = useRef([]);
//   const rb = useRef();

//   const [, get] = useKeyboardControls();

//   const setCharPosition = useStats((state) => state.setCharPosition);

//   const speed = 0.1;
//   // const camera = useThree((state) => state.camera);
//   // const offset = new THREE.Vector3(0, 1, -3);

//   useEffect(() => {
//     wiggleBones.current.length = 0;

//     // console.log(nodes);
//     nodes.RootBone.traverse((bone) => {
//       if (bone.isBone && bone !== nodes.RootBone) {
//         const wiggleBone = new WiggleBone(bone, {
//           stiffness: 500,
//           damping: 50,
//         });
//         wiggleBones.current.push(wiggleBone);
//       }
//     });
//     return () => {
//       wiggleBones.current.forEach((wiggleBone) => {
//         wiggleBone.reset();
//         wiggleBone.dispose();
//       });
//     };
//   }, [nodes]);

//   const rotationAngle = useRef(0);

//   useFrame((state, delta) => {
//     wiggleBones.current.forEach((wiggleBone) => {
//       wiggleBone.update();
//     });

//     const { forward, backward, left, right, jump, run } = get();

//     if (
//       !forward &&
//       !backward &&
//       !left &&
//       !right &&
//       !jump &&
//       !run &&
//       rb.current.position.y < 0.01
//     ) {
//       return;
//     }

//     let t = 1.0 - Math.pow(0.01, delta);

//     if (left) {
//       rotationAngle.current += t * 0.5;
//     }
//     if (right) {
//       rotationAngle.current -= t * 0.5;
//     }

//     rb.current.rotation.y = THREE.MathUtils.lerp(
//       rb.current.rotation.y,
//       rotationAngle.current,
//       t * 2
//     );

//     const direction = new THREE.Vector3(
//       Math.sin(rotationAngle.current),
//       0,
//       Math.cos(rotationAngle.current)
//     );

//     direction.normalize();

//     if (forward) rb.current.position.addScaledVector(direction, speed);
//     if (backward) rb.current.position.addScaledVector(direction, -speed);

//     rb.current.position.y += jump * speed;

//     if (!jump) {
//       rb.current.position.y = THREE.MathUtils.lerp(
//         rb.current.position.y,
//         0,
//         t * 0.25
//       );
//     }

//     setCharPosition(rb.current.position.clone());
//   });

import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useKeyboardControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import { useGLTF } from "@react-three/drei";
import useStats from "../../../stores/useStats";

import { WiggleRigHelper } from "wiggle/helper";
// import { WiggleBone } from "wiggle";
import { WiggleBone } from "wiggle/spring";

const normalizeAngle = (angle) => {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;

  return angle;
};

const lerpAngle = (start, end, t) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += Math.PI * 2;
    } else {
      end += Math.PI * 2;
    }
  }

  return normalizeAngle(start + (end - start) * t);
};

const WiggleFigure = () => {
  const { nodes, scene } = useGLTF("/models/wiggle-rig.glb");

  const setCharPosition = useStats((state) => state.setCharPosition);

  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED } = useControls(
    "Character Control",
    {
      WALK_SPEED: { value: 5, min: 0.1, max: 10, step: 0.1 },
      RUN_SPEED: { value: 9, min: 0.2, max: 20, step: 0.1 },
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

  const [animation, setAnimation] = useState("idle");

  const rotationTarget = useRef(0);
  const characterRotationTarget = useRef(0);
  const [_, get] = useKeyboardControls();
  const isClicking = useRef(false);

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
    wiggleBones.current.length = 0;

    // console.log(nodes);
    nodes.RootBone.traverse((bone) => {
      if (bone.isBone && bone !== nodes.RootBone) {
        const wiggleBone = new WiggleBone(bone, {
          stiffness: 350,
          damping: 20,
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
  }, [nodes]);

  const isJumped = useRef(false);

  useFrame((state, delta) => {
    // console.log(rb.current);
    if (rb.current) {
      wiggleBones.current.forEach((wiggleBone) => {
        wiggleBone.update();
      });

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
      } else {
        vel.x = 0;
        vel.z = 0;
      }

      if (get().jump) {
        if (!isJumped.current) {
          isJumped.current = true;

          vel.y = 8;
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

    const worldPosition = new THREE.Vector3();
    container.current.getWorldPosition(worldPosition);
    worldPosition.y -= 2;
    // console.log("World Position:", worldPosition.y);

    if (worldPosition.y < 1) {
      isJumped.current = false;
    }

    setCharPosition(worldPosition.clone());

    container.current.rotation.y = THREE.MathUtils.lerp(
      container.current.rotation.y,
      rotationTarget.current,
      0.1 //10% z přidaného rotatce; na každej frame se k nemu bude dostavat
    );
  });

  return (
    <RigidBody ref={rb} colliders={false} lockRotations>
      <group ref={container}>
        <group ref={character}>
          <group scale={1.825} position={[0, -2.3, 0]}>
            <primitive object={scene} />
          </group>
        </group>
      </group>
      <CapsuleCollider args={[1, 2]} />
    </RigidBody>
  );
};

export default WiggleFigure;
